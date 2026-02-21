import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Eye, ThumbsUp, Share2, Users, BarChart3, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
} from "recharts";

const monthlyData = [
  { month: "Aug", views: 6400, likes: 310, shares: 88, readers: 3900 },
  { month: "Sep", views: 8200, likes: 420, shares: 120, readers: 5100 },
  { month: "Oct", views: 11000, likes: 560, shares: 160, readers: 6800 },
  { month: "Nov", views: 9800,  likes: 490, shares: 140, readers: 6100 },
  { month: "Dec", views: 13500, likes: 720, shares: 210, readers: 8300 },
  { month: "Jan", views: 15200, likes: 840, shares: 260, readers: 9700 },
  { month: "Feb", views: 18400, likes: 980, shares: 310, readers: 11900 },
  { month: "Mar", views: 21000, likes: 1100,shares: 380, readers: 14200 },
];

const weeklyData = [
  { day: "Mon", views: 1820, likes: 94, shares: 28, readers: 1100 },
  { day: "Tue", views: 2340, likes: 118, shares: 36, readers: 1420 },
  { day: "Wed", views: 3100, likes: 157, shares: 48, readers: 1890 },
  { day: "Thu", views: 2700, likes: 140, shares: 42, readers: 1640 },
  { day: "Fri", views: 4200, likes: 228, shares: 72, readers: 2600 },
  { day: "Sat", views: 3600, likes: 195, shares: 60, readers: 2200 },
  { day: "Sun", views: 2950, likes: 148, shares: 44, readers: 1780 },
];

const engagementTrend = [
  { month: "Aug", rate: 5.1, avgRead: 3.2, shareRate: 1.4 },
  { month: "Sep", rate: 5.8, avgRead: 3.6, shareRate: 1.7 },
  { month: "Oct", rate: 6.2, avgRead: 3.9, shareRate: 1.9 },
  { month: "Nov", rate: 5.9, avgRead: 3.7, shareRate: 1.8 },
  { month: "Dec", rate: 6.8, avgRead: 4.1, shareRate: 2.1 },
  { month: "Jan", rate: 7.2, avgRead: 4.4, shareRate: 2.3 },
  { month: "Feb", rate: 7.8, avgRead: 4.6, shareRate: 2.5 },
  { month: "Mar", rate: 8.4, avgRead: 4.9, shareRate: 2.8 },
];

const kpis = [
  { label: "Total Views", value: "84K", change: "+12%", icon: Eye, color: "text-primary bg-primary/10" },
  { label: "Total Likes", value: "6.2K", change: "+18%", icon: ThumbsUp, color: "text-rose-500 bg-rose-500/10" },
  { label: "Shares", value: "1.4K", change: "+9%", icon: Share2, color: "text-blue-500 bg-blue-500/10" },
  { label: "Unique Readers", value: "38K", change: "+22%", icon: Users, color: "text-secondary bg-secondary/10" },
];

const topArticles = [
  { title: "Women Scholars in Classical Islam", views: "8.7K", share: 42 },
  { title: "Shariah and the Modern State", views: "6.8K", share: 33 },
  { title: "Ethics of Political Dissent in Islam", views: "5.6K", share: 27 },
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    fontSize: 11,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

type Period = "weekly" | "monthly";

export default function WriterAnalytics() {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = period === "monthly" ? monthlyData : weeklyData;
  const xKey = period === "monthly" ? "month" : "day";

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
              <k.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-sm text-foreground font-medium">{k.label}</p>
            <p className="text-xs text-emerald-500 mt-0.5 font-semibold">{k.change} vs last period</p>
          </motion.div>
        ))}
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1 bg-muted/60 rounded-xl p-1">
          {(["weekly", "monthly"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all capitalize ${period === p ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Area chart – Views & Readers */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" /> Views & Unique Readers
        </h3>
        <p className="text-xs text-muted-foreground mb-6">Reach trend over time</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="readersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Area type="monotone" dataKey="views" name="Views" stroke="hsl(var(--primary))" fill="url(#viewsGrad)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
            <Area type="monotone" dataKey="readers" name="Unique Readers" stroke="hsl(var(--secondary))" fill="url(#readersGrad)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--secondary))" }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Line chart – Engagement */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-rose-500" /> Engagement Over Time
        </h3>
        <p className="text-xs text-muted-foreground mb-6">Engagement rate, avg. read time (min), share rate (%)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={engagementTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Line type="monotone" dataKey="rate" name="Engagement %" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="avgRead" name="Avg. Read (min)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="shareRate" name="Share Rate %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar chart – Likes & Shares */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-500" /> Likes & Shares
        </h3>
        <p className="text-xs text-muted-foreground mb-6">Social interaction breakdown by period</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Bar dataKey="likes" name="Likes" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} maxBarSize={28} />
            <Bar dataKey="shares" name="Shares" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top performing articles */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Top Performing Articles</h3>
        <div className="space-y-4">
          {topArticles.map(a => (
            <div key={a.title}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.views} views</p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${a.share}%` }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
