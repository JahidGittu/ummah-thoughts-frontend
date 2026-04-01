"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Image, Palette, Upload } from "lucide-react";
import { ISLAMIC_BACKGROUNDS, VB_CUSTOM_PREFIX } from "@/hooks/useVirtualBackground";
import { saveCustomBackground } from "@/lib/customBackgroundStorage";
import { cn } from "@/lib/utils";

export interface EffectOption {
  id: string;
  label: string;
  filter?: string;
  thumbnail?: string;
}

const FILTER_EFFECTS: EffectOption[] = [
  { id: "none", label: "None", filter: "" },
  { id: "blur", label: "Blur", filter: "blur(4px)" },
  { id: "grayscale", label: "Grayscale", filter: "grayscale(100%)" },
  { id: "sepia", label: "Sepia", filter: "sepia(100%)" },
  { id: "vintage", label: "Vintage", filter: "sepia(100%) contrast(1.1) brightness(0.9)" },
  { id: "warm", label: "Warm", filter: "sepia(30%) saturate(1.2)" },
  { id: "cool", label: "Cool", filter: "hue-rotate(180deg) saturate(0.8)" },
  { id: "invert", label: "Invert", filter: "invert(100%)" },
];

const VIRTUAL_BLUR = { id: "vb-blur", label: "Blur background", thumbnail: "blur" } as const;

const VIRTUAL_BACKGROUNDS = [
  VIRTUAL_BLUR,
  ...ISLAMIC_BACKGROUNDS.map((b) => ({
    id: b.id,
    label: b.label,
    thumbnail: b.url,
  })),
];

interface BackgroundEffectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEffectId: string;
  onSelectEffect: (effectId: string) => void;
}

export function BackgroundEffectsModal({
  open,
  onOpenChange,
  selectedEffectId,
  onSelectEffect,
}: BackgroundEffectsModalProps) {
  const [activeTab, setActiveTab] = useState<"none" | "blur" | "backgrounds">("none");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (dataUrl?.startsWith("data:image/")) {
        saveCustomBackground(dataUrl);
        const effectId = `${VB_CUSTOM_PREFIX}${dataUrl}`;
        onSelectEffect(effectId);
        onOpenChange(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isCustomSelected = selectedEffectId.startsWith(VB_CUSTOM_PREFIX);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Background effects
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6 h-12">
            <TabsTrigger value="none" className="gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Palette className="h-4 w-4" />
              None & filters
            </TabsTrigger>
            <TabsTrigger value="blur" className="gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Blur
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Image className="h-4 w-4" />
              Virtual backgrounds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="none" className="mt-0">
            <ScrollArea className="h-64 px-6 py-4">
              <div className="grid grid-cols-4 gap-3">
                {FILTER_EFFECTS.map((eff) => (
                  <button
                    key={eff.id}
                    onClick={() => {
                      onSelectEffect(eff.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:bg-muted/50",
                      selectedEffectId === eff.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div
                      className="w-14 h-14 rounded-lg overflow-hidden bg-[linear-gradient(135deg,#ef4444_0%,#22c55e_33%,#3b82f6_66%,#eab308_100%)]"
                      style={eff.filter ? { filter: eff.filter } : {}}
                    />
                    <span className="text-xs font-medium text-center">{eff.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="blur" className="mt-0">
            <ScrollArea className="h-64 px-6 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    onSelectEffect("vb-blur");
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:bg-muted/50",
                    selectedEffectId === "vb-blur"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/40" />
                    </div>
                  </div>
                  <span className="text-xs font-medium">Blur background</span>
                  <span className="text-[10px] text-muted-foreground">Virtual blur</span>
                </button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="backgrounds" className="mt-0">
            <ScrollArea className="h-64 px-6 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleCustomUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-dashed transition-all hover:bg-muted/50 hover:border-primary/50",
                    isCustomSelected ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="w-full aspect-video max-h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {isCustomSelected && selectedEffectId.startsWith(VB_CUSTOM_PREFIX) ? (
                      <img
                        src={selectedEffectId.slice(VB_CUSTOM_PREFIX.length)}
                        alt="Custom"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">Custom image</span>
                  <span className="text-[10px] text-muted-foreground">JPG, PNG, WebP</span>
                </button>
                {VIRTUAL_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      onSelectEffect(bg.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all hover:bg-muted/50",
                      selectedEffectId === bg.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div className="w-full aspect-video max-h-20 rounded-md overflow-hidden bg-muted relative">
                      {bg.thumbnail === "blur" ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary/40" />
                        </div>
                      ) : (
                        <img
                          src={bg.thumbnail}
                          alt={bg.label}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">{bg.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
