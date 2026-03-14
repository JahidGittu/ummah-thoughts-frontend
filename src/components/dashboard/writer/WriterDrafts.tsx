'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenSquare, Clock, Trash2, Eye, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { getDrafts, saveDraft, deleteDraft, type StoredDraft } from "@/lib/draftStorage";

const DEFAULT_DRAFTS: StoredDraft[] = [
  { id: 1, title: "Digital Caliphate: A Critical Analysis", category: "Contemporary", wordCount: 2840, lastEdited: "2 hours ago", progress: 70, content: "The notion of a 'Digital Caliphate' has emerged as one of the most contested concepts in contemporary Islamic discourse. Proponents argue that the internet provides an unprecedented platform for Muslim unity across geographic boundaries...\n\nHowever, classical scholars have consistently maintained that legitimate Islamic governance requires physical jurisdiction, accountability structures, and the presence of qualified scholars in positions of authority...\n\nThis analysis examines three dimensions: theological legitimacy, practical governance, and the historical precedent of Islamic political theory.", tags: [] },
  { id: 2, title: "Fiqh of Artificial Intelligence", category: "Technology & Islam", wordCount: 1200, lastEdited: "Yesterday", progress: 40, content: "Artificial intelligence presents novel fiqhi questions that classical jurists could not have anticipated. At its core, AI raises questions about agency, responsibility (mas'uliyya), and the moral status of non-human decision-makers...\n\nThe Maliki tradition's emphasis on maslaha (public interest) may offer the most flexible framework for evaluating AI applications in Islamic contexts.", tags: [] },
  { id: 3, title: "The Concept of Ummah in the 21st Century", category: "Governance", wordCount: 650, lastEdited: "3 days ago", progress: 20, content: "The ummah — the global community of Muslims — has always been more than a sociological category. It carries theological weight, implying shared obligation, mutual care (ta'awun), and collective identity...", tags: [] },
  { id: 4, title: "Interfaith Dialogue: An Islamic Perspective", category: "Comparative Religion", wordCount: 3100, lastEdited: "1 week ago", progress: 85, content: "Islamic tradition has a rich, though often underappreciated, history of interfaith engagement. From the Constitution of Medina to the scholarly exchanges of Andalusia, Muslims have participated in substantive dialogue with adherents of other faiths...\n\nContemporary interfaith dialogue must navigate between the imperative of da'wa and the ethics of respectful engagement with the religious other.", tags: [] },
];

function seedIfEmpty() {
  const existing = getDrafts();
  if (existing.length === 0) {
    try {
      localStorage.setItem("article-drafts-list", JSON.stringify(DEFAULT_DRAFTS));
    } catch {
      // ignore
    }
  }
}

export default function WriterDrafts() {
  const [draftList, setDraftList] = useState<StoredDraft[]>([]);

  const refreshDrafts = () => {
    seedIfEmpty();
    setDraftList(getDrafts());
  };

  useEffect(() => {
    refreshDrafts();
  }, []);

  useEffect(() => {
    const onFocus = () => refreshDrafts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleSave = (d: StoredDraft) => {
    saveDraft({ ...d, lastEdited: "Just now" });
    setDraftList(getDrafts());
    toast.success("Draft saved");
  };

  const handleDelete = (id: string | number) => {
    deleteDraft(id);
    setDraftList(getDrafts());
    toast.success("Draft deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{draftList.length} drafts in progress</p>
        <Link
          href="/dashboard/newarticle"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> New Draft
        </Link>
      </div>

      <div className="space-y-4">
        {draftList.map((d, i) => (
          <motion.div
            key={String(d.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-block">{d.category}</span>
                <h3 className="text-sm font-semibold text-foreground">{d.title || "Untitled Draft"}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.lastEdited}</span>
                  <span>{d.wordCount.toLocaleString()} words</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/dashboard/editarticle/${d.id}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleSave(d)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                  title="Save"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Completion</span><span>{d.progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.progress}%` }} />
              </div>
            </div>
            <Link
              href={`/dashboard/editarticle/${d.id}`}
              className="mt-4 w-full py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <PenSquare className="h-4 w-4" /> Continue Writing
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
