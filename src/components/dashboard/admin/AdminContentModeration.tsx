import { useState } from "react";
import { Flag, CheckCircle, Trash2, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminActivity } from "@/contexts/AdminActivityContext";

const FLAGGED = [
  { id: "c1", title: "Controversial View on Riba in Modern Banking", type: "article", author: "Anon User", flags: 7, reason: "Contradicts established scholarly consensus", date: "Feb 18, 2026", status: "pending" },
  { id: "c2", title: "Comment on Jihad discussion thread", type: "comment", author: "user_xyz", flags: 12, reason: "Potentially inflammatory language", date: "Feb 17, 2026", status: "pending" },
  { id: "c3", title: "Is Democracy Permissible in Islam?", type: "article", author: "Bilal Taher", flags: 4, reason: "Lacks scholarly sources and dalil", date: "Feb 16, 2026", status: "pending" },
  { id: "c4", title: "Reply in Women's Rights debate", type: "comment", author: "anon_99", flags: 9, reason: "Misattributed hadith", date: "Feb 14, 2026", status: "resolved" },
  { id: "c5", title: "Sufism: Bidah or Tradition?", type: "article", author: "Hassan Ali", flags: 3, reason: "Sectarian bias in framing", date: "Feb 12, 2026", status: "resolved" },
];

const TYPE_ICONS: Record<string, React.ElementType> = {
  article: FileText,
  comment: MessageSquare,
};

export default function AdminContentModeration() {
  const { t } = useTranslation();
  const { logActivity } = useAdminActivity();
  const [items, setItems] = useState(FLAGGED);
  const [filter, setFilter] = useState("pending");

  const filtered = items.filter(i => filter === "all" || i.status === filter);

  const resolve = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) logActivity("content_approve", item.title, `Flagged ${item.type} approved and restored`);
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "resolved" } : i));
  };

  const remove = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) logActivity("content_delete", item.title, `Removed: ${item.reason}`);
    setItems(prev => prev.filter(i => i.id !== id));
  };


  const filterLabels: Record<string, string> = {
    all: t("admin.all"),
    pending: t("admin.pendingFlagged"),
    resolved: t("admin.resolved"),
  };

  return (
    <div className="space-y-5">
      {/* Alert banner */}
      <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-700 font-medium">
          {items.filter(i => i.status === "pending").length} {t("admin.contentRequiresAttention")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { labelKey: "totalFlagged", value: items.length, color: "text-foreground" },
          { labelKey: "pendingFlagged", value: items.filter(i => i.status === "pending").length, color: "text-amber-600" },
          { labelKey: "resolved", value: items.filter(i => i.status === "resolved").length, color: "text-emerald-600" },
        ].map(s => (
          <div key={s.labelKey} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{t(`admin.${s.labelKey}`)}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "pending", "resolved"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>{filterLabels[f]}</button>
        ))}
      </div>

      {/* Content Cards */}
      <div className="space-y-3">
        {filtered.map(item => {
          const Icon = TYPE_ICONS[item.type] ?? FileText;
          return (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-1 bg-destructive/10 px-2 py-0.5 rounded-full flex-shrink-0">
                      <Flag className="h-3 w-3 text-destructive" />
                      <span className="text-xs font-bold text-destructive">{item.flags}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">By {item.author} · {item.date}</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{t("admin.reason")}:</span> {item.reason}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                  item.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>{item.status === "pending" ? t("admin.pendingFlagged") : t("admin.resolved")}</span>

                {item.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => resolve(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" /> {t("admin.approve")}
                    </button>
                    <button onClick={() => remove(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" /> {t("admin.remove")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
