import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Flag,
  ExternalLink,
  Clock,
  Share2,
  Quote,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface DriftAlert {
  id: string;
  contentTitle: string;
  contentTitleAr?: string;
  alertType: "misquote" | "oversharing" | "political_risk" | "context_missing";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metrics: {
    shares: number;
    contextualReads: number;
    isolatedViews: number;
  };
  detectedAt: string;
  status: "new" | "reviewing" | "resolved" | "dismissed";
}

export const IdeologicalDriftDashboard = () => {
  const alerts: DriftAlert[] = [
    {
      id: "1",
      contentTitle: "Jihad: Definitions and Misconceptions",
      contentTitleAr: "الجهاد: التعريفات والمفاهيم الخاطئة",
      alertType: "political_risk",
      severity: "high",
      description: "This topic is being shared heavily on political forums without context. 85% of shares link directly to specific sections without prerequisite content.",
      metrics: {
        shares: 342,
        contextualReads: 89,
        isolatedViews: 1247,
      },
      detectedAt: "2024-01-15 14:30",
      status: "reviewing",
    },
    {
      id: "2",
      contentTitle: "Khilafah: Historical Analysis",
      contentTitleAr: "الخلافة: تحليل تاريخي",
      alertType: "oversharing",
      severity: "medium",
      description: "Unusual spike in shares from accounts flagged for political activism. Content being consumed without the methodology introduction.",
      metrics: {
        shares: 156,
        contextualReads: 234,
        isolatedViews: 567,
      },
      detectedAt: "2024-01-14 09:15",
      status: "new",
    },
    {
      id: "3",
      contentTitle: "Rebellion Against Rulers",
      contentTitleAr: "الخروج على الحكام",
      alertType: "misquote",
      severity: "critical",
      description: "Detected on external sites with altered context. Original nuance about conditions being stripped. High weaponization risk.",
      metrics: {
        shares: 89,
        contextualReads: 45,
        isolatedViews: 890,
      },
      detectedAt: "2024-01-15 11:00",
      status: "new",
    },
    {
      id: "4",
      contentTitle: "Democracy and Shura",
      alertType: "context_missing",
      severity: "low",
      description: "Topic being accessed directly without reading prerequisite content on Islamic governance foundations.",
      metrics: {
        shares: 23,
        contextualReads: 156,
        isolatedViews: 78,
      },
      detectedAt: "2024-01-13 16:45",
      status: "resolved",
    },
  ];

  const getSeverityColor = (severity: DriftAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getAlertIcon = (type: DriftAlert["alertType"]) => {
    switch (type) {
      case "misquote":
        return <Quote className="h-4 w-4" />;
      case "oversharing":
        return <Share2 className="h-4 w-4" />;
      case "political_risk":
        return <Flag className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DriftAlert["status"]) => {
    switch (status) {
      case "new":
        return "bg-red-500/20 text-red-400";
      case "reviewing":
        return "bg-amber-500/20 text-amber-400";
      case "resolved":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;
  const activeCount = alerts.filter((a) => a.status !== "resolved" && a.status !== "dismissed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Ideological Drift Detection
          </h2>
          <p className="text-muted-foreground">
            Monitor content consumption patterns for potential misuse
          </p>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Last scan: 5 min ago
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">{highCount}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{alerts.length}</p>
              <p className="text-sm text-muted-foreground">Total This Week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-lg border ${
                alert.severity === "critical" 
                  ? "bg-red-500/5 border-red-500/30" 
                  : "bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {alert.contentTitle}
                    </h4>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </div>
                  {alert.contentTitleAr && (
                    <p className="text-sm text-muted-foreground font-amiri" dir="rtl">
                      {alert.contentTitleAr}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  {getAlertIcon(alert.alertType)}
                  <span className="text-xs capitalize">
                    {alert.alertType.replace("_", " ")}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {alert.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Shares</p>
                  <p className="text-lg font-semibold text-foreground">
                    {alert.metrics.shares}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contextual Reads</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {alert.metrics.contextualReads}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Isolated Views</p>
                  <p className="text-lg font-semibold text-orange-400">
                    {alert.metrics.isolatedViews}
                  </p>
                </div>
              </div>

              {/* Context Ratio */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Context Ratio</span>
                  <span className="text-muted-foreground">
                    {Math.round(
                      (alert.metrics.contextualReads /
                        (alert.metrics.contextualReads + alert.metrics.isolatedViews)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (alert.metrics.contextualReads /
                      (alert.metrics.contextualReads + alert.metrics.isolatedViews)) *
                    100
                  }
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Detected: {alert.detectedAt}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Content
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Track Sources
                  </Button>
                  {alert.status === "new" && (
                    <Button size="sm">
                      Start Review
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
