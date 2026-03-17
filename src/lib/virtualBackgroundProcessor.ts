/**
 * Virtual Background Processor
 * Uses MediaPipe Selfie Segmentation (loaded from CDN) to replace/blur the background behind the person.
 * Supports: blur, or custom background images (e.g. Islamic themes).
 */

export type VirtualBackgroundType = "none" | "blur" | string; // string = image URL

export interface VirtualBackgroundProcessorOptions {
  /** "blur" or URL to background image */
  type: VirtualBackgroundType;
  /** Blur strength when type is "blur" (pixels) */
  blurAmount?: number;
}

const MEDIAPIPE_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation";

declare global {
  interface Window {
    SelfieSegmentation?: new (config?: { locateFile?: (path: string) => string }) => {
      setOptions: (opts: { modelSelection?: number; selfieMode?: boolean }) => void;
      initialize: () => Promise<void>;
      onResults: (cb: (r: { segmentationMask: HTMLCanvasElement | HTMLImageElement; image: HTMLCanvasElement | HTMLImageElement }) => void) => void;
      send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
      close: () => Promise<void>;
    };
  }
}

async function loadSelfieSegmentation(): Promise<typeof window.SelfieSegmentation> {
  if (typeof window === "undefined") throw new Error("Browser only");
  if (window.SelfieSegmentation) return window.SelfieSegmentation;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MEDIAPIPE_CDN}/selfie_segmentation.js`;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      if (window.SelfieSegmentation) resolve(window.SelfieSegmentation);
      else reject(new Error("SelfieSegmentation not loaded"));
    };
    script.onerror = () => reject(new Error("Failed to load MediaPipe"));
    document.head.appendChild(script);
  });
}

export class VirtualBackgroundProcessor {
  private segmentation: InstanceType<NonNullable<typeof window.SelfieSegmentation>> | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private outputStream: MediaStream | null = null;
  private inputVideo: HTMLVideoElement | null = null;
  private bgImage: HTMLImageElement | null = null;
  private options: VirtualBackgroundProcessorOptions;
  private rafId: number | null = null;
  private isRunning = false;

  constructor(options: VirtualBackgroundProcessorOptions) {
    this.options = {
      blurAmount: 12,
      ...options,
    };
  }

  async init(): Promise<void> {
    if (this.segmentation) return;

    const SelfieSegmentation = await loadSelfieSegmentation();
    if (!SelfieSegmentation) throw new Error("SelfieSegmentation not available");
    this.segmentation = new SelfieSegmentation({
      locateFile: (file) => `${MEDIAPIPE_CDN}/${file}`,
    });

    this.segmentation.setOptions({
      modelSelection: 1,
      selfieMode: true,
    });

    await this.segmentation.initialize();
  }

  async start(inputStream: MediaStream): Promise<MediaStream> {
    await this.init();
    if (!this.segmentation) throw new Error("Segmentation not initialized");

    const video = document.createElement("video");
    video.srcObject = inputStream;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.style.display = "none";
    document.body.appendChild(video);

    this.inputVideo = video;

    const w = inputStream.getVideoTracks()[0]?.getSettings().width ?? 640;
    const h = inputStream.getVideoTracks()[0]?.getSettings().height ?? 480;

    this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("Could not get canvas 2d context");

    if (this.options.type && this.options.type !== "none" && this.options.type !== "blur") {
      this.bgImage = new Image();
      this.bgImage.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        this.bgImage!.onload = () => resolve();
        this.bgImage!.onerror = () => reject(new Error("Failed to load background image"));
        this.bgImage!.src = this.options.type;
      });
    }

    this.segmentation.onResults((results) => this.drawFrame(results, video));

    this.isRunning = true;
    this.processFrame(video);
    this.outputStream = this.canvas.captureStream(30);
    return this.outputStream;
  }

  private processFrame = async (video: HTMLVideoElement) => {
    if (!this.isRunning || !this.segmentation || video.readyState < 2) {
      if (this.isRunning) this.rafId = requestAnimationFrame(() => this.processFrame(video));
      return;
    }
    try {
      await this.segmentation.send({ image: video });
    } catch {
      // Ignore frame errors
    }
    this.rafId = requestAnimationFrame(() => this.processFrame(video));
  };

  private drawFrame(
    results: { segmentationMask: HTMLCanvasElement | HTMLImageElement; image: HTMLCanvasElement | HTMLImageElement },
    video: HTMLVideoElement
  ) {
    if (!this.ctx || !this.canvas) return;

    const { segmentationMask } = results;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Draw background (blur or image)
    if (this.options.type === "blur") {
      this.ctx.filter = `blur(${this.options.blurAmount ?? 12}px)`;
      this.ctx.drawImage(video, 0, 0, w, h);
      this.ctx.filter = "none";
    } else if (this.bgImage && this.bgImage.complete) {
      this.ctx.drawImage(this.bgImage, 0, 0, w, h);
    } else {
      this.ctx.fillStyle = "#1a1a2e";
      this.ctx.fillRect(0, 0, w, h);
    }

    // 2. Create person layer: video masked by segmentation (white=person)
    const personCanvas = document.createElement("canvas");
    personCanvas.width = w;
    personCanvas.height = h;
    const pCtx = personCanvas.getContext("2d");
    if (!pCtx) return;
    pCtx.drawImage(video, 0, 0, w, h);
    pCtx.globalCompositeOperation = "destination-in";
    pCtx.drawImage(segmentationMask, 0, 0, w, h);

    // 3. Draw person on top of background
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.drawImage(personCanvas, 0, 0, w, h);
  }

  stop(): void {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.outputStream?.getTracks().forEach((t) => t.stop());
    this.outputStream = null;
    this.segmentation?.close();
    this.segmentation = null;
    this.canvas = null;
    this.ctx = null;
    if (this.inputVideo) {
      this.inputVideo.srcObject = null;
      if (this.inputVideo.parentNode) this.inputVideo.parentNode.removeChild(this.inputVideo);
    }
    this.inputVideo = null;
    this.bgImage = null;
  }

  setOptions(options: Partial<VirtualBackgroundProcessorOptions>): void {
    this.options = { ...this.options, ...options };
    if (options.type && options.type !== "blur" && options.type !== "none") {
      this.bgImage = new Image();
      this.bgImage.crossOrigin = "anonymous";
      this.bgImage.src = options.type;
    }
  }
}
