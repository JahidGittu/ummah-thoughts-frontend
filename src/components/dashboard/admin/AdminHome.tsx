import { useContext } from "react";
import { Users, FileText, AlertTriangle, CheckCircle, Clock, Globe, ShieldCheck, Zap, ArrowRight, CheckCircle2, XCircle, UserX, Shield, LogIn, LogOut, Settings, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { AdminActivityContext, ActivityAction } from "@/contexts/AdminActivityContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const statsData = [
  { month: "Aug", users: 420, content: 38 },
  { month: "Sep", users: 510, content: 52 },
  { month: "Oct", users: 630, content: 67 },
  { month: "Nov", users: 720, content: 81 },
  { month: "Dec", users: 840, content: 94 },
  { month: "Jan", users: 1020, content: 112 },
];

const ACTION_META: Record<ActivityAction, { icon: React.ElementType; color: string; bg: string }> = {
  role_approve:    { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  role_reject:     { icon: XCircle,      color: "text-destructive",  bg: "bg-destructive/10" },
  content_approve: { icon: FileText,     color: "text-emerald-600", bg: "bg-emerald-500/10" },
  content_delete:  { icon: Trash2,       color: "text-destructive",  bg: "bg-destructive/10" },
  user_suspend:    { icon: UserX,        color: "text-destructive",  bg: "bg-destructive/10" },
  user_unsuspend:  { icon: Shield,       color: "text-emerald-600", bg: "bg-emerald-500/10" },
  role_change:     { icon: ShieldCheck,  color: "text-amber-600",   bg: "bg-amber-500/10" },
};

const STATIC_ACTIVITY = [
  { type: "user_join",  msg: "New user registered: Khadija Rahman",                         time: "2m ago",  icon: Users,       color: "text-primary",       bg: "bg-primary/10" },
  { type: "content",    msg: "Article submitted for review: 'Zakat in Modern Economy'",     time: "15m ago", icon: FileText,    color: "text-secondary",     bg: "bg-secondary/10" },
  { type: "role_req",   msg: "Role upgrade request: Omar → Writer",                          time: "32m ago", icon: ShieldCheck, color: "text-amber-600",     bg: "bg-amber-500/10" },
  { type: "flag",       msg: "Content flagged by community: Post #4821",                    time: "1h ago",  icon: AlertTriangle,color: "text-destructive",   bg: "bg-destructive/10" },
  { type: "verify",     msg: "Scholar profile verified: Dr. Hassan Al-Turabi",              time: "2h ago",  icon: CheckCircle, color: "text-emerald-500",   bg: "bg-emerald-500/10" },
];

export default function AdminHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const activityCtx = useContext(AdminActivityContext);
  const sessionLogs = activityCtx?.sessionLogs ?? [];

  const roleDistribution = [
    { roleKey: "learners",    count: 3420, color: "bg-primary" },
    { roleKey: "writers",     count: 148,  color: "bg-secondary" },
    { roleKey: "researchers", count: 87,   color: "bg-purple-500" },
    { roleKey: "volunteers",  count: 234,  color: "bg-rose-500" },
    { roleKey: "scholars",    count: 42,   color: "bg-amber-500" },
  ];

  const KPI_CARDS = [
    { labelKey: "totalUsers",       value: "3,931", change: "+12%", icon: Users,    bg: "bg-primary/10",        text: "text-primary" },
    { labelKey: "publishedContent", value: "1,248", change: "+8%",  icon: FileText, bg: "bg-secondary/10",      text: "text-secondary" },
    { labelKey: "pendingReviews",   value: "23",    change: "-3",   icon: Clock,    bg: "bg-amber-500/10",      text: "text-amber-600" },
    { labelKey: "activeCountries",  value: "38",    change: "+2",   icon: Globe,    bg: "bg-emerald-500/10",    text: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(card => (
          <div key={card.labelKey} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`h-5 w-5 ${card.text}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{t(`admin.${card.labelKey}`)}</p>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-emerald-600 font-semibold">{card.change} {t("admin.thisMonth")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">{t("admin.platformGrowth")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="users"   name={t("admin.totalUsers")}       stroke="hsl(var(--primary))"   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="content" name={t("admin.publishedContent")} stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">{t("admin.roleDistribution")}</h3>
          <div className="space-y-3">
            {roleDistribution.map(r => (
              <div key={r.roleKey}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground font-medium">{t(`admin.${r.roleKey}`)}</span>
                  <span className="font-bold text-foreground">{r.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${r.color} h-2 rounded-full transition-all`} style={{ width: `${(r.count / 3931) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Session Activity Feed ── */}
      {sessionLogs.length > 0 && (
        <div className="bg-card border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                <Zap className="h-3 w-3" />
                Live Session
              </div>
              <h3 className="font-semibold text-foreground">Recent Actions</h3>
            </div>
            <button
              onClick={() => router.push("/dashboard/audit-log")}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            {sessionLogs.slice(0, 5).map((log, i) => {
              const meta = ACTION_META[log.action] ?? { icon: Shield, color: "text-muted-foreground", bg: "bg-muted" };
              const Icon = meta.icon;
              return (
                <div key={log.id} className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5",
                  i === 0 && "ring-1 ring-emerald-500/20"
                )}>
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", meta.bg)}>
                    <Icon className={cn("h-4 w-4", meta.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground capitalize">{log.action.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground truncate">{log.detail}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase">live</span>
                    <span className="text-[10px] text-muted-foreground">{log.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Static Recent Activity (always visible) */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{t("admin.recentActivity")}</h3>
          {sessionLogs.length === 0 && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Historical</span>
          )}
        </div>
        <div className="space-y-2">
          {STATIC_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", item.bg)}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{item.msg}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
