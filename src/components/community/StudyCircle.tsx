import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle,
  Circle,
  MessageSquare,
  FileText,
  User,
  Lock,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

interface Reading {
  id: string;
  title: string;
  type: "article" | "chapter" | "paper";
  duration: string;
  completed: boolean;
  week: number;
}

interface Member {
  id: string;
  name: string;
  role: "scholar" | "moderator" | "member";
  progress: number;
  avatar?: string;
}

interface Discussion {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  replies: number;
}

interface StudyCircleProps {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  topic: string;
  duration: string;
  startDate: string;
  endDate: string;
  visibility: "public" | "private";
  currentWeek: number;
  totalWeeks: number;
  readings: Reading[];
  members: Member[];
  discussions: Discussion[];
  moderator: string;
  scholar?: string;
  maxMembers: number;
  onJoin?: () => void;
}

const roleConfig = {
  scholar: { label: "Scholar", color: "bg-primary/20 text-primary" },
  moderator: { label: "Moderator", color: "bg-amber-500/20 text-amber-400" },
  member: { label: "Member", color: "bg-slate-500/20 text-slate-400" },
};

export const StudyCircle = ({
  title,
  titleAr,
  description,
  topic,
  duration,
  startDate,
  endDate,
  visibility,
  currentWeek,
  totalWeeks,
  readings,
  members,
  discussions,
  moderator,
  scholar,
  maxMembers,
  onJoin,
}: StudyCircleProps) => {
  const [activeTab, setActiveTab] = useState("readings");
  const progress = (currentWeek / totalWeeks) * 100;
  const completedReadings = readings.filter(r => r.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {visibility === "public" ? (
                    <><Globe className="h-3 w-3" /> Public</>
                  ) : (
                    <><Lock className="h-3 w-3" /> Private</>
                  )}
                </Badge>
                <Badge className="bg-primary/20 text-primary">
                  Week {currentWeek}/{totalWeeks}
                </Badge>
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
              {titleAr && (
                <p className="text-lg font-amiri text-muted-foreground mt-1" dir="rtl">
                  {titleAr}
                </p>
              )}
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
            <Button onClick={onJoin} variant="hero">
              <Users className="h-4 w-4 mr-2" />
              Join Circle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-background/50 border">
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">{topic}</p>
              <p className="text-xs text-muted-foreground">Topic</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border">
              <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">{duration}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">{startDate}</p>
              <p className="text-xs text-muted-foreground">Started</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">{members.length}/{maxMembers}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Circle Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="readings" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Readings ({readings.length})
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        {/* Readings Tab */}
        <TabsContent value="readings" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Reading List</CardTitle>
                <Badge variant="outline">
                  {completedReadings}/{readings.length} completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: totalWeeks }, (_, weekIdx) => {
                  const weekNum = weekIdx + 1;
                  const weekReadings = readings.filter(r => r.week === weekNum);
                  const isCurrentWeek = weekNum === currentWeek;
                  const isPastWeek = weekNum < currentWeek;

                  return (
                    <div key={weekNum} className="space-y-2">
                      <div className={`flex items-center gap-2 ${
                        isCurrentWeek ? "text-primary" : isPastWeek ? "text-muted-foreground" : "text-muted-foreground/50"
                      }`}>
                        <span className="text-sm font-medium">Week {weekNum}</span>
                        {isCurrentWeek && (
                          <Badge className="bg-primary/20 text-primary text-xs">Current</Badge>
                        )}
                      </div>
                      {weekReadings.map((reading) => (
                        <motion.div
                          key={reading.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            reading.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-background/50"
                          }`}
                        >
                          {reading.completed ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${reading.completed ? "text-muted-foreground" : "text-foreground"}`}>
                              {reading.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {reading.type}
                              </Badge>
                              <span>• {reading.duration}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Circle Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Scholar (if assigned) */}
                {scholar && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{scholar}</p>
                        <Badge className={roleConfig.scholar.color}>{roleConfig.scholar.label}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other members */}
                {members.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="rounded-full" />
                      ) : (
                        <span className="font-medium">{member.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <Badge className={roleConfig[member.role].color} variant="secondary">
                        {roleConfig[member.role].label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{member.progress}%</p>
                      <p className="text-xs text-muted-foreground">progress</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Circle Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {discussions.map((discussion, idx) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg bg-background/50 border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">{discussion.author.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{discussion.author}</p>
                            <span className="text-xs text-muted-foreground">{discussion.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{discussion.message}</p>
                          <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {discussion.replies} replies
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Circle Guidelines */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Study Circle Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Circles are topic-specific and time-limited</li>
                <li>• Complete readings before weekly discussions</li>
                <li>• Maintain respectful scholarly discourse (adab)</li>
                <li>• The moderator ensures discussions stay on track</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
