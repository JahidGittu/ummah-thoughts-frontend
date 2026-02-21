import { motion } from "framer-motion";
import { UserCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const reviews = [
  { id: 1, title: "The Role of Fiqh Councils in Modern States", author: "Dr. Ibrahim Khalil", type: "Paper", submitted: "Feb 14, 2026", priority: "high", status: "pending" },
  { id: 2, title: "Digital Media & Islamic Jurisprudence", author: "Prof. Bilal Hussain", type: "Article", submitted: "Feb 12, 2026", priority: "normal", status: "pending" },
  { id: 3, title: "Halal Certification: Global Standards", author: "Dr. Sara Al-Amin", type: "Paper", submitted: "Feb 10, 2026", priority: "normal", status: "in-review" },
  { id: 4, title: "Usul al-Fiqh in Contemporary Law", author: "Sh. Tariq Othman", type: "Book Chapter", submitted: "Feb 5, 2026", priority: "normal", status: "approved" },
  { id: 5, title: "Political Legitimacy in Early Caliphate", author: "Dr. Leila Mahmoud", type: "Paper", submitted: "Jan 28, 2026", priority: "high", status: "approved" },
];

export default function ScholarPeerReview() {
  const { t } = useTranslation();

  const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: t("subpages.awaitingReview"), color: "bg-secondary/10 text-secondary", icon: Clock },
    "in-review": { label: t("subpages.inReview"), color: "bg-purple-500/10 text-purple-600", icon: UserCheck },
    approved: { label: t("subpages.approved"), color: "bg-primary/10 text-primary", icon: CheckCircle2 },
    rejected: { label: t("subpages.rejected"), color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">{t("subpages.peerReview")}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">2 {t("subpages.pending")} · 1 {t("subpages.inReview")} · 2 {t("subpages.approved")}</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: t("subpages.pending"), val: "2", color: "text-secondary" },
          { label: t("subpages.inReview"), val: "1", color: "text-purple-600" },
          { label: t("subpages.approved"), val: "2", color: "text-primary" },
          { label: t("subpages.avgRating"), val: "4.8", color: "text-secondary" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.map((r, i) => {
          const st = statusMap[r.status];
          const Icon = st.icon;
          return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t("subpages.by")} {r.author} · {r.type}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {r.submitted}
                    </span>
                    {r.priority === "high" && (
                      <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {t("subpages.priority")}
                      </span>
                    )}
                    {r.status === "pending" && (
                      <button className="ml-auto text-xs font-semibold text-primary hover:underline">{t("subpages.startReview")}</button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
