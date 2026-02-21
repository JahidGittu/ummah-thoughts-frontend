import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Eye,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

interface TopicProgress {
  topic: string;
  topicAr?: string;
  foundationalRead: number;
  intermediateRead: number;
  advancedRead: number;
  readiness: "not_ready" | "caution" | "ready";
}

interface LearningMaturityIndexProps {
  userName: string;
  overallLevel: "beginner" | "intermediate" | "advanced";
  topicProgress: TopicProgress[];
  totalArticlesRead: number;
  conceptsExposed: number;
  averageComplexity: number;
}

const levelConfig = {
  beginner: {
    label: "Foundation Building",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: BookOpen,
    description: "You're building a strong foundation. Focus on core concepts.",
  },
  intermediate: {
    label: "Expanding Understanding",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Brain,
    description: "Good progress! You can explore more nuanced topics.",
  },
  advanced: {
    label: "Deep Scholarship",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: GraduationCap,
    description: "You're ready for advanced scholarly discussions.",
  },
};

const readinessConfig = {
  not_ready: {
    label: "Foundational Study Needed",
    color: "text-red-400",
    icon: Lock,
  },
  caution: {
    label: "Proceed with Care",
    color: "text-amber-400",
    icon: AlertTriangle,
  },
  ready: {
    label: "Ready to Explore",
    color: "text-emerald-400",
    icon: CheckCircle,
  },
};

export const LearningMaturityIndex = ({
  userName,
  overallLevel,
  topicProgress,
  totalArticlesRead,
  conceptsExposed,
  averageComplexity,
}: LearningMaturityIndexProps) => {
  const config = levelConfig[overallLevel];
  const LevelIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Private Learning Index</h4>
              <p className="text-sm text-muted-foreground">
                This learning maturity assessment is visible <strong>only to you</strong>. 
                It helps guide your learning journey without gamification or competition. 
                No points, no ranks—just personal growth tracking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LevelIcon className="h-5 w-5 text-primary" />
              Your Learning Maturity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${config.color} flex items-center justify-center`}>
                <LevelIcon className="h-8 w-8" />
              </div>
              <div>
                <Badge className={config.color}>{config.label}</Badge>
                <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-background/50 border">
                <p className="text-2xl font-bold text-foreground">{totalArticlesRead}</p>
                <p className="text-xs text-muted-foreground">Articles Read</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50 border">
                <p className="text-2xl font-bold text-foreground">{conceptsExposed}</p>
                <p className="text-xs text-muted-foreground">Concepts Explored</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50 border">
                <p className="text-2xl font-bold text-foreground">{averageComplexity}%</p>
                <p className="text-xs text-muted-foreground">Complexity Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Topic-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Topic Readiness
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topicProgress.map((topic, idx) => {
              const readiness = readinessConfig[topic.readiness];
              const ReadinessIcon = readiness.icon;

              return (
                <motion.div
                  key={topic.topic}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{topic.topic}</h4>
                      {topic.topicAr && (
                        <p className="text-sm text-muted-foreground font-amiri" dir="rtl">
                          {topic.topicAr}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className={`${readiness.color} border-current`}>
                      <ReadinessIcon className="h-3 w-3 mr-1" />
                      {readiness.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24">Foundational</span>
                      <Progress value={topic.foundationalRead} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-10">{topic.foundationalRead}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24">Intermediate</span>
                      <Progress value={topic.intermediateRead} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-10">{topic.intermediateRead}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24">Advanced</span>
                      <Progress value={topic.advancedRead} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-10">{topic.advancedRead}%</span>
                    </div>
                  </div>

                  {topic.readiness === "not_ready" && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-xs text-red-400">
                        ⚠️ Advanced content on this topic may cause confusion. 
                        Complete foundational readings first.
                      </p>
                    </div>
                  )}

                  {topic.readiness === "caution" && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-xs text-amber-400">
                        ⚡ You can explore intermediate content. 
                        Advanced topics should be approached carefully.
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tadrij Notice */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">The Principle of Tadrij (تدرج)</h4>
              <p className="text-sm text-muted-foreground">
                Islamic scholarship emphasizes gradual learning. This index respects that principle 
                by guiding you through complexity levels naturally, preventing ideological shock 
                and ensuring deep understanding before moving to advanced topics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
