import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useTranslation } from "react-i18next";

const monthly = [
  { month: "Aug", users: 420, content: 38, debates: 8 },
  { month: "Sep", users: 510, content: 52, debates: 11 },
  { month: "Oct", users: 630, content: 67, debates: 14 },
  { month: "Nov", users: 720, content: 81, debates: 18 },
  { month: "Dec", users: 840, content: 94, debates: 21 },
  { month: "Jan", users: 1020, content: 112, debates: 27 },
  { month: "Feb", users: 1180, content: 128, debates: 31 },
];

const topTopics = [
  { topic: "Islamic Finance", views: 48200 },
  { topic: "Family Law", views: 37400 },
  { topic: "Worship & Prayer", views: 31100 },
  { topic: "Political Thought", views: 26800 },
  { topic: "Hadith Sciences", views: 22300 },
];

const TRAFFIC_PIE = [
  { name: "Bangladesh", value: 38, color: "hsl(var(--primary))" },
  { name: "Pakistan", value: 22, color: "hsl(var(--secondary))" },
  { name: "Malaysia", value: 15, color: "#a855f7" },
  { name: "UK", value: 12, color: "#f43f5e" },
  { name: "Others", value: 13, color: "#f59e0b" },
];

export default function AdminAnalytics() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { labelKey: "totalPageViews", value: "2.4M", sub: "+18%" },
          { labelKey: "avgSession", value: "7m 23s", sub: "+12%" },
          { labelKey: "bounceRate", value: "34%", sub: "-5%" },
          { labelKey: "returnVisitors", value: "67%", sub: "+3%" },
        ].map(k => (
          <div key={k.labelKey} className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs text-muted-foreground font-medium">{t(`admin.${k.labelKey}`)}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{k.value}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">{k.sub} {t("admin.thisMonth")}</p>
          </div>
        ))}
      </div>

      {/* Growth Line Chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">{t("admin.platformGrowth7")}</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="users" name={t("admin.totalUsers")} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="content" name={t("admin.publishedContent")} stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="debates" name={t("debates.badge")} stroke="#a855f7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">{t("admin.topTopics")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topTopics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="topic" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="views" name={t("subpages.views")} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic by Country */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">{t("admin.trafficByCountry")}</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={TRAFFIC_PIE} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {TRAFFIC_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {TRAFFIC_PIE.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
