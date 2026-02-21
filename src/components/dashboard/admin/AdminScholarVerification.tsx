import { useState } from "react";
import { CheckCircle, XCircle, GraduationCap, Globe, BookOpen, Calendar, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminActivity } from "@/contexts/AdminActivityContext";
import { useAuth } from "@/contexts/AuthContext";

const APPLICATIONS = [
  { id: "sv1", name: "Sheikh Yusuf Qadri", email: "yusuf.qadri@example.com", institution: "Darul Uloom Karachi", specialization: "Hadith Sciences", countries: "Pakistan, UK", experience: "18 years", works: 24, status: "pending", date: "Feb 18, 2026" },
  { id: "sv2", name: "Dr. Amal Farouk", email: "amal.farouk@example.com", institution: "Al-Azhar University", specialization: "Tafsir & Quranic Studies", countries: "Egypt", experience: "12 years", works: 31, status: "pending", date: "Feb 16, 2026" },
  { id: "sv3", name: "Ustadh Bilal Ismail", email: "bilal.ismail@example.com", institution: "Islamic University of Madinah", specialization: "Fiqh al-Muamalat", countries: "South Africa", experience: "9 years", works: 14, status: "pending", date: "Feb 14, 2026" },
  { id: "sv4", name: "Dr. Maryam Nasser", email: "maryam.n@example.com", institution: "University of Jordan", specialization: "Islamic Ethics & Philosophy", countries: "Jordan, Canada", experience: "15 years", works: 19, status: "verified", date: "Feb 10, 2026" },
  { id: "sv5", name: "Sheikh Hassan Turabi", email: "hassan.t@example.com", institution: "Independent", specialization: "Islamic Political Thought", countries: "Sudan", experience: "7 years", works: 8, status: "rejected", date: "Feb 08, 2026" },
];

export default function AdminScholarVerification() {
  const { t } = useTranslation();
  const { logActivity } = useAdminActivity();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [apps, setApps] = useState(APPLICATIONS);
  const [filter, setFilter] = useState("pending");

  const handle = (id: string, action: "verified" | "rejected") => {
    const app = apps.find(a => a.id === id);
    if (app) {
      logActivity(
        action === "verified" ? "role_approve" : "role_reject",
        app.name,
        action === "verified"
          ? `Scholar verified: ${app.name} (${app.specialization})`
          : `Scholar rejected: ${app.name} (${app.specialization})`
      );
    }
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
  };

  // Scholars see only their own entry (matched by email); admins see all
  const visibleApps = isAdmin
    ? apps.filter(a => filter === "all" || a.status === filter)
    : apps.filter(a => a.email === user?.email);

  const filterLabels: Record<string, string> = {
    all: t("admin.all"),
    pending: t("admin.pendingReview"),
    verified: t("admin.verifiedScholars"),
    rejected: t("admin.rejectedCount2"),
  };

  // Scholar view: just show their own status card
  if (!isAdmin) {
    const myApp = apps.find(a => a.email === user?.email);
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>You can view your own application status below. Only admins can verify or reject applications.</span>
        </div>
        {myApp ? (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                {myApp.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{myApp.name}</p>
                <p className="text-xs text-muted-foreground">{myApp.email}</p>
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                  myApp.status === "verified" ? "bg-emerald-100 text-emerald-700" :
                  myApp.status === "rejected" ? "bg-destructive/10 text-destructive" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {myApp.status === "verified" ? t("admin.verifiedScholars") :
                   myApp.status === "rejected" ? t("admin.rejectedCount2") :
                   t("admin.pendingReview")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: GraduationCap, labelKey: "institution", value: myApp.institution },
                { icon: BookOpen, labelKey: "specialization", value: myApp.specialization },
                { icon: Globe, labelKey: "countries", value: myApp.countries },
                { icon: Calendar, labelKey: "experience", value: myApp.experience },
              ].map(d => (
                <div key={d.labelKey} className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <d.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t(`admin.${d.labelKey}`)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{d.value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t("admin.applied")}: {myApp.date} · {myApp.works} {t("admin.publishedWorks")}</p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No application found for your account.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats — admin only */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { labelKey: "pendingReview",   value: apps.filter(a => a.status === "pending").length,  color: "text-amber-600",   bg: "bg-amber-500/10" },
          { labelKey: "verifiedScholars",value: apps.filter(a => a.status === "verified").length, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { labelKey: "rejectedCount2",  value: apps.filter(a => a.status === "rejected").length, color: "text-destructive", bg: "bg-destructive/10" },
        ].map(s => (
          <div key={s.labelKey} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{t(`admin.${s.labelKey}`)}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "pending", "verified", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>{filterLabels[f]}</button>
        ))}
      </div>

      {/* Scholar Cards */}
      <div className="space-y-4">
        {visibleApps.map(app => (
          <div key={app.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                {app.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                    app.status === "verified" ? "bg-emerald-100 text-emerald-700" :
                    app.status === "rejected" ? "bg-destructive/10 text-destructive" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {app.status === "verified" ? t("admin.verifiedScholars") :
                     app.status === "rejected" ? t("admin.rejectedCount2") :
                     t("admin.pendingReview")}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: GraduationCap, labelKey: "institution",    value: app.institution },
                { icon: BookOpen,      labelKey: "specialization",  value: app.specialization },
                { icon: Globe,         labelKey: "countries",       value: app.countries },
                { icon: Calendar,      labelKey: "experience",      value: app.experience },
              ].map(detail => (
                <div key={detail.labelKey} className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <detail.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t(`admin.${detail.labelKey}`)}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{t("admin.applied")}: {app.date} · {app.works} {t("admin.publishedWorks")}</p>
              {/* Verify/Reject only visible to admins */}
              {app.status === "pending" && isAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => handle(app.id, "rejected")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                    <XCircle className="h-3.5 w-3.5" /> {t("admin.reject")}
                  </button>
                  <button onClick={() => handle(app.id, "verified")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5" /> {t("admin.verify")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

