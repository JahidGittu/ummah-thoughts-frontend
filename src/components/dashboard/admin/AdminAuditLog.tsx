import { useState, useRef, useEffect } from "react";
import {
  Search, Shield, FileText, Settings, LogIn, LogOut, UserCheck,
  Trash2, CheckCircle, XCircle, UserX, Zap, Download,
  ChevronDown, SlidersHorizontal, Eye, EyeOff, CalendarIcon, X,
} from "lucide-react";
import { format, isWithinInterval, parse } from "date-fns";
import { useTranslation } from "react-i18next";
import { useAdminActivity, ActivityEntry } from "@/contexts/AdminActivityContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTION_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  login:           { icon: LogIn,        color: "text-emerald-600" },
  logout:          { icon: LogOut,       color: "text-muted-foreground" },
  role_change:     { icon: UserCheck,    color: "text-amber-600" },
  role_approve:    { icon: CheckCircle,  color: "text-emerald-600" },
  role_reject:     { icon: XCircle,      color: "text-destructive" },
  content_delete:  { icon: Trash2,       color: "text-destructive" },
  content_approve: { icon: FileText,     color: "text-emerald-600" },
  settings_change: { icon: Settings,     color: "text-primary" },
  user_suspend:    { icon: UserX,        color: "text-destructive" },
  user_unsuspend:  { icon: Shield,       color: "text-emerald-600" },
};

const ACTION_TYPES = Object.keys(ACTION_ICONS);

const STATIC_LOGS = [
  { id: "sl1", action: "role_change",     actor: "admin@ummahthoughts.com", target: "safiya@example.com",  detail: "Role changed: user → writer",                   time: "Feb 19, 2026 · 09:14", ip: "192.168.1.1" },
  { id: "sl2", action: "content_approve", actor: "admin@ummahthoughts.com", target: "Article #2841",       detail: "Flagged content approved and restored",          time: "Feb 19, 2026 · 08:52", ip: "192.168.1.1" },
  { id: "sl3", action: "user_suspend",    actor: "admin@ummahthoughts.com", target: "yusuf@example.com",   detail: "Account suspended: repeated policy violations",  time: "Feb 18, 2026 · 17:30", ip: "10.0.0.42" },
  { id: "sl4", action: "login",           actor: "admin@ummahthoughts.com", target: "",                   detail: "Admin logged in",                                time: "Feb 18, 2026 · 09:00", ip: "10.0.0.42" },
  { id: "sl5", action: "content_delete",  actor: "admin@ummahthoughts.com", target: "Comment #9921",      detail: "Removed for misattributed hadith",               time: "Feb 17, 2026 · 14:22", ip: "192.168.1.1" },
  { id: "sl6", action: "settings_change", actor: "admin@ummahthoughts.com", target: "Platform Settings",  detail: "New user registration: set to moderated",        time: "Feb 17, 2026 · 11:05", ip: "192.168.1.1" },
  { id: "sl7", action: "role_change",     actor: "admin@ummahthoughts.com", target: "nadia@example.com",  detail: "Role upgrade approved: user → researcher",       time: "Feb 16, 2026 · 10:48", ip: "172.16.0.5" },
  { id: "sl8", action: "logout",          actor: "admin@ummahthoughts.com", target: "",                   detail: "Admin logged out",                               time: "Feb 15, 2026 · 18:00", ip: "172.16.0.5" },
];

type LogRow = ActivityEntry | typeof STATIC_LOGS[0];

// ─── Helper: parse "Feb 19, 2026 · 09:14" → Date ───────────────────────────
function parseLogTime(time: string): Date | null {
  try {
    const clean = time.replace(" · ", " ");
    return parse(clean, "MMM d, yyyy HH:mm", new Date());
  } catch {
    return null;
  }
}

// ─── Action Filter Dropdown ───────────────────────────────────────────────────
function ActionFilterDropdown({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = selected === "all"
    ? "All Actions"
    : selected.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="truncate capitalize">{label}</span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-52 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {["all", ...ACTION_TYPES].map(action => (
            <button
              key={action}
              onClick={() => { onChange(action); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors capitalize",
                action === selected
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {action === "all" ? (
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                (() => {
                  const meta = ACTION_ICONS[action];
                  const Icon = meta.icon;
                  return <Icon className={cn("h-3.5 w-3.5", meta.color)} />;
                })()
              )}
              {action === "all" ? "All Actions" : action.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Date Range Picker ────────────────────────────────────────────────────────
function DateRangePicker({
  range,
  onChange,
}: {
  range: DateRange | undefined;
  onChange: (r: DateRange | undefined) => void;
}) {
  const hasRange = range?.from || range?.to;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 h-10 px-3 rounded-xl border text-sm transition-colors",
            hasRange
              ? "border-primary/50 bg-primary/10 text-primary font-medium"
              : "border-border bg-card text-foreground hover:bg-muted"
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
          {hasRange ? (
            <span className="text-xs">
              {range?.from ? format(range.from, "MMM d") : ""}
              {range?.to ? ` → ${format(range.to, "MMM d")}` : ""}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">Date range</span>
          )}
          {hasRange && (
            <button
              onClick={e => { e.stopPropagation(); onChange(undefined); }}
              className="ml-1 hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 bg-card border border-border shadow-lg" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={onChange}
          numberOfMonths={2}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

const PAGE_SIZE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminAuditLog() {
  const { t } = useTranslation();
  const { sessionLogs } = useAdminActivity();

  const [search, setSearch]         = useState("");
  const [actionFilter, setAction]   = useState("all");
  const [dateRange, setDateRange]   = useState<DateRange | undefined>();
  const [showIP, setShowIP]         = useState(false);
  const [page, setPage]             = useState(1);

  const allLogs: LogRow[] = [...sessionLogs, ...STATIC_LOGS];

  const filtered = allLogs.filter(l => {
    const matchSearch =
      l.detail.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());

    const matchAction = actionFilter === "all" || l.action === actionFilter;

    const matchDate = (() => {
      if (!dateRange?.from) return true;
      const d = parseLogTime(l.time);
      if (!d) return true;
      const from = dateRange.from!;
      const to = dateRange.to ?? dateRange.from!;
      const toEnd = new Date(to);
      toEnd.setHours(23, 59, 59, 999);
      return isWithinInterval(d, { start: from, end: toEnd });
    })();

    return matchSearch && matchAction && matchDate;
  });

  // Reset to page 1 whenever filters change
  const resetPage = () => setPage(1);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageStart   = (safePage - 1) * PAGE_SIZE;
  const paginated   = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const exportCSV = () => {
    const headers = ["Action", "Actor", "Target", "Detail", "Timestamp", "IP"];
    const rows = filtered.map(l => [l.action, l.actor, l.target || "", l.detail, l.time, l.ip]);
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeFilters = [
    actionFilter !== "all" ? 1 : 0,
    dateRange?.from ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t("admin.auditDesc")}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {sessionLogs.length > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Zap className="h-3 w-3" />
              {sessionLogs.length} live
            </div>
          )}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <Download className="h-3.5 w-3.5" />
            {t("admin.exportCSV")}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Text search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={t("admin.searchLogs")}
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage(); }}
          />
        </div>

        {/* Action type dropdown */}
        <ActionFilterDropdown selected={actionFilter} onChange={v => { setAction(v); resetPage(); }} />

        {/* Date range picker */}
        <DateRangePicker range={dateRange} onChange={v => { setDateRange(v); resetPage(); }} />

        {/* IP toggle */}
        <button
          onClick={() => setShowIP(v => !v)}
          title={showIP ? "Hide IP column" : "Show IP column"}
          className={cn(
            "flex items-center gap-1.5 h-10 px-3 rounded-xl border text-xs font-semibold transition-colors",
            showIP
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {showIP ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          IP
        </button>

        {/* Active filter count badge */}
        {activeFilters > 0 && (
          <button
            onClick={() => { setAction("all"); setDateRange(undefined); }}
            className="flex items-center gap-1 h-10 px-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors border border-destructive/20"
          >
            <X className="h-3 w-3" />
            Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* Log Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("admin.action")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  {t("admin.target")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("admin.details")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  {t("admin.timestamp")}
                </th>
                {showIP && (
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                    IP Address
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((log, idx) => {
                const globalIdx = pageStart + idx;
                const isLive = !search && actionFilter === "all" && !dateRange?.from && globalIdx < sessionLogs.length;
                const actionMeta = ACTION_ICONS[log.action] ?? { icon: Shield, color: "text-muted-foreground" };
                const IconComp = actionMeta.icon;
                return (
                  <tr
                    key={log.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      isLive && "bg-emerald-500/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                          isLive ? "bg-emerald-500/15" : "bg-muted"
                        )}>
                          <IconComp className={cn("h-3.5 w-3.5", actionMeta.color)} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold capitalize text-foreground whitespace-nowrap">
                            {log.action.replace(/_/g, " ")}
                          </span>
                          {isLive && (
                            <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                              live
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                      {log.target || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                      {log.detail}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">
                      {log.time}
                    </td>
                    {showIP && (
                      <td className="px-4 py-3 hidden xl:table-cell text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {log.ip}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            {t("admin.noLogsFound")}
          </div>
        )}

        {/* Pagination footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">{pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}</span>
              {" "}of{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              {filtered.length !== allLogs.length && `(filtered from ${allLogs.length})`}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-xs border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
                title="First page"
              >«</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="h-7 px-2.5 rounded-lg flex items-center justify-center text-xs border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
              >← Prev</button>

              {/* Page number pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`ellipsis-${i}`} className="text-xs text-muted-foreground px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "h-7 w-7 rounded-lg text-xs font-semibold border transition-colors",
                        safePage === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:bg-muted text-foreground"
                      )}
                    >{p}</button>
                  )
                )
              }

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="h-7 px-2.5 rounded-lg flex items-center justify-center text-xs border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
              >Next →</button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-xs border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
                title="Last page"
              >»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

