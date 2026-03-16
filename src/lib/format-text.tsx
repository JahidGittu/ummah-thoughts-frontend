/**
 * Render **bold**, *italic*, __underline__ as visual formatting.
 * Used in chat messages and input preview.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert markdown (**, *, __) to HTML for safe display */
export function formatTextToHtml(text: string): string {
  if (!text) return "";
  let html = escapeHtml(text);
  // Protect list bullets (* at line start) from italic conversion
  html = html.replace(/(^|\n)(\* )(?=\S)/g, "$1&#42; ");
  // Order: __ first, then **, then * (so ** isn't consumed by *)
  html = html.replace(/__(.+?)__/gs, "<u>$1</u>");
  html = html.replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\n/g, "<br />");
  return html;
}

interface FormattedTextProps {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
}

/** Renders text with **bold**, *italic*, __underline__ as visual formatting */
export function FormattedText({ text, className, as: Tag = "span" }: FormattedTextProps) {
  const html = formatTextToHtml(text);
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Convert HTML from contentEditable back to markdown (** * __) */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === "" || html === "<br>") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  function walk(node: ChildNode): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const inner = Array.from(node.childNodes).map(walk).join("");
      if (tag === "b" || tag === "strong") return `**${inner}**`;
      if (tag === "i" || tag === "em") return `*${inner}*`;
      if (tag === "u") return `__${inner}__`;
      if (tag === "br") return "\n";
      if (tag === "div") return inner + "\n";
      return inner;
    }
    return "";
  }
  return Array.from(div.childNodes).map(walk).join("").trim();
}
