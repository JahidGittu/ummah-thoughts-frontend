import { motion } from "framer-motion";
import { Users, Clock, RotateCcw, Share2, Globe, Smartphone } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const engagementData = [
  { name: "Mobile", value: 54, color: "hsl(var(--primary))" },
  { name: "Desktop", value: 36, color: "hsl(var(--secondary))" },
  { name: "Tablet", value: 10, color: "hsl(var(--muted-foreground))" },
];

const retentionData = [
  { week: "W1", readers: 4200 },
  { week: "W2", readers: 5800 },
  { week: "W3", readers: 5100 },
  { week: "W4", readers: 6700 },
  { week: "W5", readers: 7200 },
  { week: "W6", readers: 8400 },
];

const metrics = [
  { label: "Avg. Read Time", value: "4m 32s", icon: Clock, desc: "Per article session" },
  { label: "Return Readers", value: "68%", icon: RotateCcw, desc: "Read multiple articles" },
  { label: "Share Rate", value: "12%", icon: Share2, desc: "Articles shared/forwarded" },
  { label: "Subscribers", value: "1,240", icon: Users, desc: "Following your content" },
];

export default function WriterStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <m.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-sm font-medium text-foreground">{m.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-6">Reader Growth (6 Weeks)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }} />
              <Line type="monotone" dataKey="readers" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} name="Readers" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Reader Device Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={engagementData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                {engagementData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {engagementData.map(e => (
              <div key={e.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: e.color }} />
                <span className="text-xs text-muted-foreground">{e.name} {e.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
