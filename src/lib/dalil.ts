/**
 * Parse dalil (evidence) blocks from message text.
 * Format: [Type: Reference — Arabic — "Translation"]
 */

export type ParsedDalil = {
  type: string;
  reference: string;
  arabic?: string;
  translation?: string;
};

export function parseDalils(text: string): {
  mainText: string;
  dalils: ParsedDalil[];
} {
  const dalils: ParsedDalil[] = [];
  const regex = /\[([^:]+):\s*([^\]]+)\]/g;
  let mainText = text;
  let match;
  const blocks: { full: string }[] = [];

  while ((match = regex.exec(text)) !== null) {
    const type = match[1].trim();
    const rest = match[2].trim();
    let reference = rest;
    let arabic: string | undefined;
    let translation: string | undefined;

    const parts = rest.split(/\s+—\s+/);
    if (parts.length >= 1) reference = parts[0].trim();
    if (parts.length >= 2) {
      const p2 = parts[1].trim();
      if (p2.startsWith('"') && p2.endsWith('"')) {
        translation = p2.slice(1, -1);
      } else {
        arabic = p2;
      }
    }
    if (parts.length >= 3) {
      const p3 = parts[2].trim();
      if (p3.startsWith('"') && p3.endsWith('"')) translation = p3.slice(1, -1);
    }

    dalils.push({ type, reference, arabic, translation });
    blocks.push({ full: match[0] });
  }

  for (const b of blocks) {
    mainText = mainText.replace(b.full, "");
  }
  mainText = mainText.replace(/\n\n\n+/g, "\n\n").trim();

  return { mainText, dalils };
}

export const evidenceIcons: Record<string, { icon: string; label: string; color: string }> = {
  quran: { icon: "📖", label: "Quran", color: "bg-primary/10 text-primary border-primary/20" },
  hadith: { icon: "📜", label: "Hadith", color: "bg-secondary/10 text-secondary border-secondary/20" },
  ijma: { icon: "🤝", label: "Ijma", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  qiyas: { icon: "⚖️", label: "Qiyas", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  scholarly: { icon: "📚", label: "Scholarly", color: "bg-muted text-muted-foreground border-border" },
};

export function getEvidenceConfig(type: string) {
  return evidenceIcons[type.toLowerCase()] ?? evidenceIcons.scholarly;
}

/** Validate dalil reference format. Returns error message or null if valid. */
export function validateDalilReference(type: string, reference: string): string | null {
  if (!reference.trim()) return "Reference is required";
  const t = type.toLowerCase();
  if (t === "quran") {
    if (!/surah|ayat|\d+\s*:\s*\d+/i.test(reference)) {
      return "Use format: Surah 2:255 or 2:255";
    }
  }
  if (t === "hadith") {
    if (reference.length < 3) return "Add book name and reference";
  }
  return null;
}
