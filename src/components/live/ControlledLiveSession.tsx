import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Video, 
  Mic, 
  MicOff, 
  Hand, 
  MessageSquare, 
  Users,
  Clock,
  Shield,
  Play,
  Pause,
  StopCircle,
  Archive,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QueuedQuestion {
  id: string;
  author: string;
  question: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "answered";
}

interface ControlledLiveSessionProps {
  sessionId: string;
  title: string;
  scholar: string;
  isLive: boolean;
  viewerCount: number;
}

export const ControlledLiveSession = ({
  sessionId,
  title,
  scholar,
  isLive,
  viewerCount,
}: ControlledLiveSessionProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const [questionQueue] = useState<QueuedQuestion[]>([
    {
      id: "1",
      author: "Abdullah M.",
      question: "Can you elaborate on the conditions mentioned for valid consultation?",
      submittedAt: "2 min ago",
      status: "approved",
    },
    {
      id: "2",
      author: "Fatima R.",
      question: "How does this apply to modern parliamentary systems?",
      submittedAt: "5 min ago",
      status: "pending",
    },
    {
      id: "3",
      author: "Omar Y.",
      question: "What is the scholarly consensus on binding vs advisory shura?",
      submittedAt: "8 min ago",
      status: "answered",
    },
  ]);

  const getStatusBadge = (status: QueuedQuestion["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Ready</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400">In Queue</Badge>;
      case "answered":
        return <Badge className="bg-blue-500/20 text-blue-400">Answered</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400">Not Selected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          {isLive ? (
            <>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white mr-1" />
                  LIVE
                </Badge>
                <Badge variant="outline" className="bg-background/80">
                  <Users className="h-3 w-3 mr-1" />
                  {viewerCount} watching
                </Badge>
              </div>
              <div className="text-center">
                <Video className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Live session in progress</p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Clock className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Session not started yet</p>
            </div>
          )}
        </div>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="text-muted-foreground">with {scholar}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={handRaised ? "default" : "outline"}
                size="sm"
                onClick={() => setHandRaised(!handRaised)}
              >
                <Hand className="h-4 w-4 mr-1" />
                {handRaised ? "Hand Raised" : "Raise Hand"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Q&A Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Q&A Queue
              </span>
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Moderated
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Submit Question */}
            <div className="space-y-3">
              <Textarea
                placeholder="Type your question for the scholar..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={2}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Questions are reviewed by moderators before being shown
                </p>
                <Button size="sm" disabled={!newQuestion.trim()}>
                  Submit Question
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Question Queue
              </p>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  <AnimatePresence>
                    {questionQueue.map((q, idx) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-3 rounded-lg border ${
                          q.status === "approved"
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {q.author}
                          </span>
                          {getStatusBadge(q.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {q.submittedAt}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Moderator Controls (visible to moderators) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Session Controls
              <Badge variant="outline" className="ml-auto bg-amber-500/10 text-amber-400">
                Moderator View
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Status */}
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">
                  Session Status
                </span>
                <Badge className={isLive ? "bg-red-500 text-white" : "bg-muted"}>
                  {isLive ? "LIVE" : "Not Started"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button size="sm" variant="destructive" className="flex-1">
                  <StopCircle className="h-4 w-4 mr-1" />
                  End
                </Button>
              </div>
            </div>

            {/* Pending Questions */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Pending Review ({questionQueue.filter((q) => q.status === "pending").length})
              </p>
              <div className="space-y-2">
                {questionQueue
                  .filter((q) => q.status === "pending")
                  .map((q) => (
                    <div key={q.id} className="p-3 rounded-lg border bg-card">
                      <p className="text-sm text-foreground mb-2">{q.question}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          from {q.author}
                        </span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <CheckCircle className="h-3 w-3 text-emerald-400" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <XCircle className="h-3 w-3 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recording */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Auto-Recording Enabled
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Session will be archived after conclusion
                  </p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
