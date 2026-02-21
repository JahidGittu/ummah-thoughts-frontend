import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, 
  Shield, 
  Lock, 
  Share2, 
  Eye, 
  Bell,
  Info,
  XCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CrisisContent {
  id: string;
  title: string;
  titleAr?: string;
  normalStatus: "published" | "draft";
  crisisStatus: "locked" | "warning" | "normal";
  sharingDisabled: boolean;
  contextBanner: string;
}

interface CrisisModeBannerProps {
  isActive: boolean;
  reason?: string;
  activatedAt?: string;
}

// Public-facing crisis banner component
export const CrisisModeBanner = ({
  isActive,
  reason,
  activatedAt,
}: CrisisModeBannerProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-amber-400">
              Content Advisory Active
            </h3>
            <Badge className="bg-amber-500/20 text-amber-400">
              <Clock className="h-3 w-3 mr-1" />
              Since {activatedAt}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{reason}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Some content restricted
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              Sharing limited on sensitive topics
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Admin dashboard for crisis mode management
export const CrisisModeAdminDashboard = () => {
  const [crisisModeActive, setCrisisModeActive] = useState(true);
  const [crisisReason] = useState(
    "Due to ongoing political events in the region, we are adding additional context to sensitive content to prevent misuse."
  );

  const [affectedContent] = useState<CrisisContent[]>([
    {
      id: "1",
      title: "Rebellion Against Rulers",
      titleAr: "الخروج على الحكام",
      normalStatus: "published",
      crisisStatus: "locked",
      sharingDisabled: true,
      contextBanner: "This historical topic is being temporarily restricted due to potential for political misuse during current events.",
    },
    {
      id: "2",
      title: "Jihad: Definitions and Types",
      titleAr: "الجهاد: التعريفات والأنواع",
      normalStatus: "published",
      crisisStatus: "warning",
      sharingDisabled: true,
      contextBanner: "Please read the full methodology introduction before engaging with this content. Isolated sections may be misleading.",
    },
    {
      id: "3",
      title: "Bay'ah and Political Allegiance",
      titleAr: "البيعة والولاء السياسي",
      normalStatus: "published",
      crisisStatus: "warning",
      sharingDisabled: false,
      contextBanner: "This content discusses historical concepts. Application to modern contexts requires scholarly guidance.",
    },
  ]);

  const getStatusBadge = (status: CrisisContent["crisisStatus"]) => {
    switch (status) {
      case "locked":
        return (
          <Badge className="bg-red-500/20 text-red-400">
            <Lock className="h-3 w-3 mr-1" />
            Locked
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning Added
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Normal
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Crisis Mode Management
          </h2>
          <p className="text-muted-foreground">
            Control content access during sensitive periods
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            crisisModeActive
              ? "bg-red-500/10 text-red-400 border-red-500/30"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          }
        >
          {crisisModeActive ? "CRISIS MODE ACTIVE" : "Normal Operations"}
        </Badge>
      </div>

      {/* Main Control */}
      <Card className={crisisModeActive ? "border-amber-500/30" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Crisis Mode Toggle
            </span>
            <Switch
              checked={crisisModeActive}
              onCheckedChange={setCrisisModeActive}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm font-medium text-foreground mb-2">
              Current Reason:
            </p>
            <p className="text-sm text-muted-foreground">{crisisReason}</p>
          </div>

          <AnimatePresence>
            {crisisModeActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                  <Lock className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">
                    {affectedContent.filter((c) => c.crisisStatus === "locked").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Content Locked</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <AlertTriangle className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">
                    {affectedContent.filter((c) => c.crisisStatus === "warning").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Warnings Added</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                  <Share2 className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">
                    {affectedContent.filter((c) => c.sharingDisabled).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Sharing Disabled</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Affected Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Affected Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {affectedContent.map((content, idx) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{content.title}</h4>
                  {content.titleAr && (
                    <p className="text-sm text-muted-foreground font-amiri" dir="rtl">
                      {content.titleAr}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(content.crisisStatus)}
                  {content.sharingDisabled && (
                    <Badge variant="outline" className="text-muted-foreground">
                      <XCircle className="h-3 w-3 mr-1" />
                      No Sharing
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-3 rounded bg-muted/30 mb-3">
                <p className="text-xs text-muted-foreground mb-1">Context Banner:</p>
                <p className="text-sm text-foreground">{content.contextBanner}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Banner
                </Button>
                <Button variant="outline" size="sm">
                  Change Status
                </Button>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-muted/30">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                About Crisis Mode
              </h4>
              <p className="text-sm text-muted-foreground">
                Crisis Mode is activated during periods of political unrest or when 
                there's elevated risk of content being weaponized. It allows temporary 
                restrictions on sensitive content, mandatory context banners, and 
                sharing limitations—all while maintaining transparency about why 
                these measures are in place.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
