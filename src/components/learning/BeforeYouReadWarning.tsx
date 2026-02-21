import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertTriangle, 
  Shield, 
  History, 
  Users, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type WarningType = "emotional" | "political" | "historical" | "minority" | "sensitive";

interface BeforeYouReadWarningProps {
  warnings: WarningType[];
  topicTitle: string;
  methodologyLink?: string;
  onProceed?: () => void;
  onReadMethodology?: () => void;
}

const warningConfig: Record<WarningType, { 
  icon: React.ElementType; 
  label: string; 
  description: string;
  color: string;
}> = {
  emotional: {
    icon: Shield,
    label: "Emotional Sensitivity",
    description: "This topic may evoke strong emotional responses. Approach with a calm, scholarly mindset.",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  political: {
    icon: AlertTriangle,
    label: "Political Misuse Risk",
    description: "This topic is often weaponized politically. Understanding the methodology is essential before forming conclusions.",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  historical: {
    icon: History,
    label: "Historical Complexity",
    description: "The historical context of this topic requires careful study. Modern applications may differ significantly.",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  minority: {
    icon: Users,
    label: "Minority Opinion Involved",
    description: "This topic includes minority scholarly positions. The dominant view may differ from what's presented.",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  sensitive: {
    icon: BookOpen,
    label: "Advanced Scholarly Content",
    description: "This content is intended for those with foundational knowledge. Beginners should read prerequisites first.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
};

export const BeforeYouReadWarning = ({
  warnings,
  topicTitle,
  methodologyLink,
  onProceed,
  onReadMethodology,
}: BeforeYouReadWarningProps) => {
  const [expanded, setExpanded] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  const [readMethodology, setReadMethodology] = useState(false);

  const hasPoliticalWarning = warnings.includes("political");
  const canProceed = acknowledged && (!hasPoliticalWarning || readMethodology);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-amber-500/5 border-amber-500/30 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-amber-500/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Before You Read This</h3>
                <p className="text-sm text-muted-foreground">
                  Important context for "{topicTitle}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                {warnings.length} {warnings.length === 1 ? "notice" : "notices"}
              </Badge>
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 pb-4 space-y-4">
                  {/* Warning Cards */}
                  <div className="grid gap-3">
                    {warnings.map((warning) => {
                      const config = warningConfig[warning];
                      const Icon = config.icon;

                      return (
                        <div
                          key={warning}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${config.color}`}
                        >
                          <Icon className="h-5 w-5 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground text-sm">{config.label}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Methodology Link */}
                  {hasPoliticalWarning && methodologyLink && (
                    <Card className="bg-background/50">
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="methodology"
                              checked={readMethodology}
                              onCheckedChange={(checked) => setReadMethodology(!!checked)}
                            />
                            <label htmlFor="methodology" className="text-sm text-muted-foreground cursor-pointer">
                              I have read the methodology notes
                            </label>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary"
                            onClick={onReadMethodology}
                          >
                            Read Methodology <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Acknowledgment */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="acknowledge"
                      checked={acknowledged}
                      onCheckedChange={(checked) => setAcknowledged(!!checked)}
                    />
                    <label htmlFor="acknowledge" className="text-sm text-muted-foreground cursor-pointer">
                      I understand this topic requires careful, scholarly engagement and I will 
                      approach it with the appropriate mindset.
                    </label>
                  </div>

                  {/* Proceed Button */}
                  <Button
                    onClick={onProceed}
                    disabled={!canProceed}
                    className="w-full"
                    variant={canProceed ? "hero" : "outline"}
                  >
                    {canProceed ? "Proceed to Content" : "Please acknowledge the notices above"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
