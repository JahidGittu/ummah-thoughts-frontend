import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Calendar, 
  Clock, 
  Lock, 
  FileText,
  MessageSquare,
  Download,
  ExternalLink,
  CheckCircle,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

interface Scholar {
  id: string;
  name: string;
  nameAr?: string;
  specialization: string;
  isConfirmed: boolean;
}

interface Roundtable {
  id: string;
  title: string;
  titleAr?: string;
  theme: string;
  description: string;
  scholars: Scholar[];
  date: string;
  duration: string;
  status: "upcoming" | "live" | "concluded";
  hasSummary: boolean;
  summaryUrl?: string;
}

export const ScholarRoundtable = () => {
  const roundtables: Roundtable[] = [
    {
      id: "1",
      title: "Contemporary Applications of Shura",
      titleAr: "التطبيقات المعاصرة للشورى",
      theme: "Islamic Governance",
      description: "A scholarly discussion on how the principle of shura can be implemented in modern institutional frameworks while maintaining its Islamic foundations.",
      scholars: [
        { id: "1", name: "Dr. Ahmad Hassan", specialization: "Political Fiqh", isConfirmed: true },
        { id: "2", name: "Dr. Fatima Al-Rashid", specialization: "Comparative Politics", isConfirmed: true },
        { id: "3", name: "Sh. Omar Yusuf", specialization: "Usul al-Fiqh", isConfirmed: false },
      ],
      date: "2024-02-15",
      duration: "2 hours",
      status: "upcoming",
      hasSummary: false,
    },
    {
      id: "2",
      title: "Rebellion and Obedience: Historical Review",
      titleAr: "الخروج والطاعة: مراجعة تاريخية",
      theme: "Historical Analysis",
      description: "Examining classical scholarly positions on rebellion against rulers with attention to historical context and preventing modern misapplication.",
      scholars: [
        { id: "4", name: "Dr. Khalid Ibrahim", specialization: "Islamic History", isConfirmed: true },
        { id: "5", name: "Dr. Maryam Siddiq", specialization: "Hadith Sciences", isConfirmed: true },
      ],
      date: "2024-01-28",
      duration: "90 minutes",
      status: "concluded",
      hasSummary: true,
      summaryUrl: "/roundtable/2/summary",
    },
    {
      id: "3",
      title: "Economic Justice in Islamic Framework",
      theme: "Economics",
      description: "Scholars discuss the principles of economic justice, wealth distribution, and the role of the state in ensuring equitable access to resources.",
      scholars: [
        { id: "6", name: "Dr. Yusuf Qaradawi Jr.", specialization: "Islamic Economics", isConfirmed: true },
        { id: "7", name: "Dr. Aisha Mahmoud", specialization: "Development Studies", isConfirmed: true },
        { id: "8", name: "Sh. Hassan Ali", specialization: "Zakat & Awqaf", isConfirmed: true },
      ],
      date: "2024-02-01",
      duration: "2 hours",
      status: "live",
      hasSummary: false,
    },
  ];

  const getStatusBadge = (status: Roundtable["status"]) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-red-500 text-white animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white mr-1" />
            LIVE NOW
          </Badge>
        );
      case "upcoming":
        return <Badge className="bg-blue-500/20 text-blue-400">Upcoming</Badge>;
      case "concluded":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Concluded</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Scholar Roundtables
          </h2>
          <p className="text-muted-foreground">
            Invite-only multi-scholar discussions with published summaries
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Lock className="h-3 w-3" />
          Invite Only
        </Badge>
      </div>

      {/* Roundtables Grid */}
      <div className="grid gap-6">
        {roundtables.map((roundtable, idx) => (
          <motion.div
            key={roundtable.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={roundtable.status === "live" ? "border-red-500/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(roundtable.status)}
                      <Badge variant="outline">{roundtable.theme}</Badge>
                    </div>
                    <CardTitle className="text-xl">{roundtable.title}</CardTitle>
                    {roundtable.titleAr && (
                      <p className="text-muted-foreground font-amiri mt-1" dir="rtl">
                        {roundtable.titleAr}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      {roundtable.date}
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Clock className="h-3 w-3" />
                      {roundtable.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{roundtable.description}</p>

                {/* Participating Scholars */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Participating Scholars
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {roundtable.scholars.map((scholar) => (
                      <div
                        key={scholar.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {scholar.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            {scholar.name}
                            {scholar.isConfirmed && (
                              <CheckCircle className="h-3 w-3 text-emerald-400" />
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {scholar.specialization}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span>Featured Discussion</span>
                  </div>
                  <div className="flex gap-2">
                    {roundtable.status === "live" && (
                      <Button>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    )}
                    {roundtable.status === "upcoming" && (
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    )}
                    {roundtable.hasSummary && (
                      <>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Read Summary
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </>
                    )}
                    {roundtable.status === "concluded" && !roundtable.hasSummary && (
                      <Badge variant="outline" className="text-amber-400">
                        <Clock className="h-3 w-3 mr-1" />
                        Summary in preparation
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                About Scholar Roundtables
              </h3>
              <p className="text-sm text-muted-foreground">
                Roundtables are invite-only discussions between qualified scholars on 
                structured themes. Unlike regular sessions, they feature multiple perspectives 
                and always conclude with a published summary document for the benefit of the community.
                All roundtables are recorded and archived for reference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
