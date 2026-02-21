import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Star,
  Shield,
  Eye,
  FileCheck,
  MessageSquare,
  Flag
} from "lucide-react";
import { motion } from "framer-motion";

interface RoleScore {
  userId: string;
  name: string;
  role: "scholar" | "research_assistant" | "moderator" | "contributor";
  scores: {
    accuracy: number;
    revisionAcceptance: number;
    conduct: number;
    biasFlags: number;
  };
  overallScore: number;
  trend: "up" | "down" | "stable";
  lastActivity: string;
  flags: string[];
  recommendations: string[];
}

export const RoleResponsibilityScore = () => {
  const roleScores: RoleScore[] = [
    {
      userId: "1",
      name: "Dr. Ahmad Hassan",
      role: "scholar",
      scores: {
        accuracy: 98,
        revisionAcceptance: 95,
        conduct: 100,
        biasFlags: 0,
      },
      overallScore: 97,
      trend: "stable",
      lastActivity: "2024-01-15",
      flags: [],
      recommendations: ["Eligible for senior scholar designation"],
    },
    {
      userId: "2",
      name: "Fatima Al-Rashid",
      role: "research_assistant",
      scores: {
        accuracy: 92,
        revisionAcceptance: 88,
        conduct: 95,
        biasFlags: 1,
      },
      overallScore: 89,
      trend: "up",
      lastActivity: "2024-01-15",
      flags: ["Minor citation format issues"],
      recommendations: ["Consider for promotion review in 3 months"],
    },
    {
      userId: "3",
      name: "Omar Yusuf",
      role: "moderator",
      scores: {
        accuracy: 85,
        revisionAcceptance: 78,
        conduct: 90,
        biasFlags: 2,
      },
      overallScore: 82,
      trend: "down",
      lastActivity: "2024-01-14",
      flags: ["2 bias flags from peer review", "Response time below target"],
      recommendations: ["Schedule mentorship session", "Review moderation guidelines"],
    },
    {
      userId: "4",
      name: "Khadija Mahmoud",
      role: "contributor",
      scores: {
        accuracy: 75,
        revisionAcceptance: 65,
        conduct: 88,
        biasFlags: 0,
      },
      overallScore: 72,
      trend: "up",
      lastActivity: "2024-01-13",
      flags: ["High revision rate on submissions"],
      recommendations: ["Provide additional training resources", "Pair with senior contributor"],
    },
  ];

  const getRoleColor = (role: RoleScore["role"]) => {
    switch (role) {
      case "scholar":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "research_assistant":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "moderator":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-amber-400";
    return "text-red-400";
  };

  const getTrendIcon = (trend: RoleScore["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <div className="h-4 w-4 border-b-2 border-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Role Responsibility Scores
          </h2>
          <p className="text-muted-foreground">
            Internal quality metrics for privileged roles (invisible to users)
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
          <Eye className="h-3 w-3 mr-1" />
          Admin View Only
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {roleScores.filter((r) => r.overallScore >= 90).length}
                </p>
                <p className="text-xs text-muted-foreground">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {roleScores.filter((r) => r.overallScore >= 75 && r.overallScore < 90).length}
                </p>
                <p className="text-xs text-muted-foreground">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {roleScores.filter((r) => r.overallScore < 75).length}
                </p>
                <p className="text-xs text-muted-foreground">Needs Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{roleScores.length}</p>
                <p className="text-xs text-muted-foreground">Total Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Individual Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {roleScores.map((person, idx) => (
            <motion.div
              key={person.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-foreground">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{person.name}</h4>
                    <Badge className={getRoleColor(person.role)}>
                      {person.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(person.overallScore)}`}>
                      {person.overallScore}
                    </p>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                  {getTrendIcon(person.trend)}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className={getScoreColor(person.scores.accuracy)}>
                      {person.scores.accuracy}%
                    </span>
                  </div>
                  <Progress value={person.scores.accuracy} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Revisions</span>
                    <span className={getScoreColor(person.scores.revisionAcceptance)}>
                      {person.scores.revisionAcceptance}%
                    </span>
                  </div>
                  <Progress value={person.scores.revisionAcceptance} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Conduct</span>
                    <span className={getScoreColor(person.scores.conduct)}>
                      {person.scores.conduct}%
                    </span>
                  </div>
                  <Progress value={person.scores.conduct} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Bias Flags</span>
                    <span className={person.scores.biasFlags === 0 ? "text-emerald-400" : "text-amber-400"}>
                      {person.scores.biasFlags}
                    </span>
                  </div>
                  <Progress 
                    value={100 - (person.scores.biasFlags * 20)} 
                    className="h-1.5" 
                  />
                </div>
              </div>

              {/* Flags & Recommendations */}
              {(person.flags.length > 0 || person.recommendations.length > 0) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {person.flags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        Active Flags
                      </p>
                      <ul className="space-y-1">
                        {person.flags.map((flag, i) => (
                          <li key={i} className="text-xs text-amber-400 flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {person.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Recommendations
                      </p>
                      <ul className="space-y-1">
                        {person.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Last active: {person.lastActivity}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Feedback
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
