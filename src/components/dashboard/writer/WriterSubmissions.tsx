'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, AlertCircle, Send, Calendar } from "lucide-react";

const submissions = [
  { title: "Maqasid and Human Rights", category: "Governance", submitted: "Feb 18, 2025", status: "approved", reviewer: "Dr. Ahmad Al-Rashid", feedback: "Excellent analysis. Minor formatting changes applied." },
  { title: "Fiqh of Social Media", category: "Contemporary", submitted: "Mar 10, 2025", status: "review", reviewer: "Sh. Ibrahim Khalil", feedback: "Under review — expected response in 3-5 days." },
  { title: "Islamic Finance Principles", category: "Finance", submitted: "Mar 1, 2025", status: "revision", reviewer: "Dr. Fatima Zahra", feedback: "Needs more citations in section 3. References to classical scholars are insufficient." },
  { title: "Early Islamic Diplomacy", category: "History", submitted: "Jan 15, 2025", status: "rejected", reviewer: "Editorial Board", feedback: "Topic already covered. Suggested to submit an updated comparative perspective." },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", label: "Approved" },
  review: { icon: Clock, color: "text-blue-500 bg-blue-500/10", label: "In Review" },
  revision: { icon: AlertCircle, color: "text-secondary bg-secondary/10", label: "Revision Needed" },
  rejected: { icon: XCircle, color: "text-destructive bg-destructive/10", label: "Rejected" },
};

export default function WriterSubmissions() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Approved", count: 1, color: "text-emerald-500" },
          { label: "In Review", count: 1, color: "text-blue-500" },
          { label: "Needs Revision", count: 1, color: "text-secondary" },
          { label: "Rejected", count: 1, color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {submissions.map((s, i) => {
          const cfg = statusConfig[s.status];
          const Icon = cfg.icon;
          return (
            <motion.div key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-block">{s.category}</span>
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Submitted {s.submitted} · Reviewer: {s.reviewer}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${cfg.color}`}>
                  <Icon className="h-3.5 w-3.5" /> {cfg.label}
                </div>
              </div>
              <div className="bg-muted/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">Feedback: </span>{s.feedback}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Link
        href="/dashboard/newarticle"
        className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Send className="h-4 w-4" /> Submit New Article
      </Link>
    </div>
  );
}
