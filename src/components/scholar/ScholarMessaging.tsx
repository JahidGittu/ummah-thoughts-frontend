import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Inbox, 
  Clock, 
  MessageSquare, 
  Send, 
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  id: string;
  topic: string;
  question: string;
  askedBy: string;
  askedAt: string;
  status: "pending" | "answered" | "archived";
  answer?: string;
  answeredAt?: string;
}

interface OfficeHour {
  id: string;
  scholarName: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  slotsAvailable: number;
  totalSlots: number;
}

const mockQuestions: Question[] = [
  {
    id: "1",
    topic: "Shura & Governance",
    question: "What is the scholarly position on mandatory consultation (Shura) in modern Islamic governance?",
    askedBy: "Abdullah M.",
    askedAt: "2 days ago",
    status: "answered",
    answer: "The majority of classical scholars view Shura as obligatory (wajib) based on Quranic commands...",
    answeredAt: "1 day ago",
  },
  {
    id: "2",
    topic: "Fiqh of Minorities",
    question: "How should Muslims living as minorities approach civic participation?",
    askedBy: "Fatima K.",
    askedAt: "3 hours ago",
    status: "pending",
  },
];

const mockOfficeHours: OfficeHour[] = [
  {
    id: "1",
    scholarName: "Dr. Ahmad Al-Rashid",
    topic: "Islamic Political Theory",
    date: "Friday, Feb 7",
    time: "7:00 PM - 8:00 PM (GMT+6)",
    duration: "1 hour",
    slotsAvailable: 3,
    totalSlots: 10,
  },
  {
    id: "2",
    scholarName: "Sh. Muhammad Hasan",
    topic: "Fiqh al-Awlawiyyat",
    date: "Saturday, Feb 8",
    time: "10:00 AM - 11:30 AM (GMT+6)",
    duration: "1.5 hours",
    slotsAvailable: 7,
    totalSlots: 15,
  },
];

export const ScholarMessaging = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Scholar Communication</h2>
        <p className="text-muted-foreground">
          Respectful, structured access to scholarly guidance
        </p>
      </div>

      {/* Why Not Open Chat Notice */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Why Controlled Channels?</h4>
              <p className="text-sm text-muted-foreground">
                To prevent scholar burnout, maintain dignity, and ensure thoughtful responses, 
                we use structured communication instead of open direct messages. This benefits 
                both scholars and seekers of knowledge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Question Inbox
          </TabsTrigger>
          <TabsTrigger value="office-hours" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Office Hours
          </TabsTrigger>
          <TabsTrigger value="ask" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ask Question
          </TabsTrigger>
        </TabsList>

        {/* Question Inbox */}
        <TabsContent value="inbox" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Questions</h3>
              <Badge variant="outline">{mockQuestions.length} questions</Badge>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {mockQuestions.map((q) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-card/50 hover:bg-card/80 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {q.topic}
                            </Badge>
                            <CardTitle className="text-base">{q.question}</CardTitle>
                          </div>
                          <Badge className={
                            q.status === "answered" 
                              ? "bg-emerald-500/20 text-emerald-400" 
                              : "bg-amber-500/20 text-amber-400"
                          }>
                            {q.status === "answered" ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Answered</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> Pending</>
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Asked {q.askedAt}
                        </p>
                        
                        {q.answer && (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-primary">Scholar's Response</span>
                              <span className="text-xs text-muted-foreground">• {q.answeredAt}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{q.answer}</p>
                            <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                              Read full response <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            <Card className="bg-muted/30">
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  📚 Answered questions become part of the public archive to benefit the community
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Office Hours */}
        <TabsContent value="office-hours" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming Office Hours</h3>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Limited Slots
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {mockOfficeHours.map((oh) => (
                <motion.div
                  key={oh.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{oh.scholarName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <BookOpen className="h-3 w-3" />
                            {oh.topic}
                          </CardDescription>
                        </div>
                        <Badge className={
                          oh.slotsAvailable > 5 
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }>
                          {oh.slotsAvailable}/{oh.totalSlots} slots
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {oh.date}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {oh.time}
                        </p>
                      </div>
                      <Button className="w-full" variant={oh.slotsAvailable <= 3 ? "hero" : "outline"}>
                        Reserve Slot
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Session Guidelines</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• One question per person to ensure fair access</li>
                      <li>• Questions are topic-specific only</li>
                      <li>• Arrive 5 minutes early</li>
                      <li>• Sessions are recorded for the archive</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ask Question */}
        <TabsContent value="ask" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Question</CardTitle>
              <CardDescription>
                Your question will be reviewed and answered when the scholar is available.
                Well-formulated questions receive priority.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Topic Category</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  <option value="">Select a topic...</option>
                  <option value="governance">Islamic Governance & Shura</option>
                  <option value="fiqh">Fiqh al-Awlawiyyat</option>
                  <option value="minorities">Fiqh of Minorities</option>
                  <option value="history">Islamic Political History</option>
                  <option value="contemporary">Contemporary Issues</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Question</label>
                <Textarea
                  placeholder="Write your question clearly and concisely. Include relevant context if necessary..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {newQuestion.length}/500 characters
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Before submitting:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Check if similar questions exist in the archive</li>
                  <li>✓ Ensure your question is clear and specific</li>
                  <li>✓ Avoid questions that require personal fatwa</li>
                </ul>
              </div>

              <Button className="w-full" disabled={!selectedTopic || !newQuestion.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Submit Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
