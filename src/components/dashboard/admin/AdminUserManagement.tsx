import { useState } from "react";
import { Search, Filter, MoreVertical, UserX, ShieldCheck, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminActivity } from "@/contexts/AdminActivityContext";

const ROLE_COLORS: Record<string, string> = {
  scholar: "bg-amber-100 text-amber-700 border-amber-200",
  writer: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  researcher: "bg-purple-100 text-purple-700 border-purple-200",
  volunteer: "bg-rose-100 text-rose-700 border-rose-200",
  user: "bg-primary/10 text-primary border-primary/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
};

const INITIAL_USERS = [
  { id: "u1", name: "Omar Abdullah", email: "user@ummahthoughts.com", role: "user", status: "active", joined: "Mar 10, 2024", country: "Bangladesh" },
  { id: "s1", name: "Dr. Ahmad Al-Rashid", email: "scholar@ummahthoughts.com", role: "scholar", status: "active", joined: "Jan 15, 2023", country: "Saudi Arabia" },
  { id: "w1", name: "Fatima Zahra", email: "writer@ummahthoughts.com", role: "writer", status: "active", joined: "Aug 22, 2023", country: "Morocco" },
  { id: "r1", name: "Ibrahim Khalil", email: "researcher@ummahthoughts.com", role: "user", status: "active", joined: "May 01, 2023", country: "Turkey" },
  { id: "v1", name: "Maryam Hassan", email: "maryam@ummahthoughts.com", role: "user", status: "active", joined: "Jan 05, 2024", country: "Malaysia" },
  { id: "u2", name: "Yusuf Al-Qassim", email: "yusuf@example.com", role: "user", status: "suspended", joined: "Feb 18, 2024", country: "Egypt" },
  { id: "u3", name: "Aisha Siddiqui", email: "aisha@example.com", role: "writer", status: "active", joined: "Nov 03, 2023", country: "Pakistan" },
  { id: "u4", name: "Bilal Taher", email: "bilal@example.com", role: "volunteer", status: "inactive", joined: "Dec 12, 2023", country: "UK" },
];

const ROLES = ["all", "scholar", "writer", "researcher", "volunteer", "user", "admin"];

export default function AdminUserManagement() {
  const { t } = useTranslation();
  const { logActivity } = useAdminActivity();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSuspend = (u: typeof INITIAL_USERS[0]) => {
    const isSuspended = u.status === "suspended";
    const action = isSuspended ? "user_unsuspend" : "user_suspend";
    const detail = isSuspended ? "Account reinstated" : "Account suspended: policy violation";
    logActivity(action, u.email, detail);
    setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: isSuspended ? "active" : "suspended" } : usr));
    setOpenMenu(null);
  };


  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={t("admin.searchUsers")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
          >
            {ROLES.map(r => <option key={r} value={r}>{r === "all" ? t("admin.allRoles") : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("admin.totalUsersCount"), value: users.length },
          { label: t("admin.activeUsers"), value: users.filter(u => u.status === "active").length },
          { label: t("admin.suspended"), value: users.filter(u => u.status === "suspended").length },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.user")}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">{t("admin.role")}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">{t("admin.country")}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">{t("admin.joined")}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.status")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{u.country}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      u.status === "suspended" ? "bg-destructive/10 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {u.status === "active" ? t("admin.active") : u.status === "suspended" ? t("admin.suspended") : t("admin.inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                        className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {openMenu === u.id && (
                        <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-xl shadow-lg py-1 w-44">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {t("admin.sendEmail")}
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
                            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /> {t("admin.changeRole")}
                          </button>
                           <button
                              onClick={() => handleSuspend(u)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors text-left">
                             <UserX className="h-3.5 w-3.5" /> {u.status === "suspended" ? t("admin.active") : t("admin.suspendUser")}
                           </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{t("admin.noUsersFound")}</div>
        )}
      </div>
    </div>
  );
}
