import { useState } from "react";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminActivity } from "@/contexts/AdminActivityContext";

const REQUESTS = [
  { id: "r1", name: "Hamza Al-Farsi", email: "hamza@example.com", from: "user", to: "writer", reason: "I have written 15+ articles on Islamic history and wish to contribute formally.", date: "Feb 17, 2026", status: "pending" },
  { id: "r2", name: "Nadia Benali", email: "nadia@example.com", from: "user", to: "researcher", reason: "Currently pursuing PhD in Usul al-Fiqh at Al-Azhar University.", date: "Feb 16, 2026", status: "pending" },
  { id: "r3", name: "Khalid Anwar", email: "khalid@example.com", from: "user", to: "volunteer", reason: "I want to help moderate community discussions and assist new learners.", date: "Feb 15, 2026", status: "pending" },
  { id: "r4", name: "Safiya Osman", email: "safiya@example.com", from: "user", to: "writer", reason: "Published author with a focus on women in Islamic history.", date: "Feb 12, 2026", status: "approved" },
  { id: "r5", name: "Tariq Fahad", email: "tariq@example.com", from: "user", to: "researcher", reason: "Seeking research access for a comparative fiqh project.", date: "Feb 10, 2026", status: "rejected" },
];

const ROLE_COLORS: Record<string, string> = {
  writer: "bg-secondary/20 text-secondary-foreground",
  researcher: "bg-purple-100 text-purple-700",
  volunteer: "bg-rose-100 text-rose-700",
  user: "bg-primary/10 text-primary",
};

export default function AdminRoleRequests() {
  const { t } = useTranslation();
  const { logActivity } = useAdminActivity();
  const [requests, setRequests] = useState(REQUESTS);
  const [filter, setFilter] = useState("pending");

  const filtered = requests.filter(r => filter === "all" || r.status === filter);

  const handle = (id: string, action: "approved" | "rejected") => {
    const req = requests.find(r => r.id === id);
    if (req) {
      const actType = action === "approved" ? "role_approve" : "role_reject";
      logActivity(actType, req.email, `Role request ${action}: ${req.from} → ${req.to}`);
    }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };


  const filterLabels: Record<string, string> = {
    all: t("admin.all"),
    pending: t("admin.pendingCount"),
    approved: t("admin.approvedCount"),
    rejected: t("admin.rejectedCount"),
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { labelKey: "pendingCount", value: requests.filter(r => r.status === "pending").length, color: "text-amber-600", bg: "bg-amber-500/10" },
          { labelKey: "approvedCount", value: requests.filter(r => r.status === "approved").length, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { labelKey: "rejectedCount", value: requests.filter(r => r.status === "rejected").length, color: "text-destructive", bg: "bg-destructive/10" },
        ].map(s => (
          <div key={s.labelKey} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{t(`admin.${s.labelKey}`)}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {req.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{req.name}</p>
                  <p className="text-xs text-muted-foreground">{req.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[req.from]}`}>{req.from}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[req.to]}`}>{req.to}</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-sm text-muted-foreground italic">"{req.reason}"</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{req.date}</span>
              </div>

              {req.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handle(req.id, "rejected")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors"
                  >
                    <XCircle className="h-3.5 w-3.5" /> {t("admin.reject")}
                  </button>
                  <button
                    onClick={() => handle(req.id, "approved")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> {t("admin.approve")}
                  </button>
                </div>
              ) : (
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl ${
                  req.status === "approved" ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"
                }`}>
                  {req.status === "approved" ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  {req.status === "approved" ? t("admin.approvedCount") : t("admin.rejectedCount")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
