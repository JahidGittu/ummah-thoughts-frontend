import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  XCircle, 
  AlertTriangle, 
  Info, 
  Shield,
  BookOpen,
  Scale,
  Flame,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

interface RejectedQuestion {
  id: string;
  category: string;
  exampleQuestion: string;
  reason: string;
  methodology: string;
  icon: "takfir" | "violence" | "sectarian" | "political" | "personal";
}

export const RejectedQuestionsArchive = () => {
  const rejectedQuestions: RejectedQuestion[] = [
    {
      id: "1",
      category: "Takfir (Excommunication) Questions",
      exampleQuestion: "Is [person/group] a kafir?",
      reason: "Pronouncing takfir on individuals or groups requires conditions that only qualified scholars in specific judicial contexts can assess. General declarations lead to fitna and bloodshed.",
      methodology: "Takfir has strict conditions (establishment of proof, removal of barriers, judicial process) that cannot be fulfilled through online Q&A. We refer such matters to local scholarly authorities.",
      icon: "takfir",
    },
    {
      id: "2",
      category: "Incitement to Violence",
      exampleQuestion: "How can we fight against [government/group]?",
      reason: "Questions seeking justification for violence, rebellion, or armed action are rejected. Such matters require deep contextual understanding and cannot be answered responsibly online.",
      methodology: "Islamic jurisprudence on jihad, rebellion, and political action has numerous conditions and considerations that require in-person scholarly consultation, not remote fatwa.",
      icon: "violence",
    },
    {
      id: "3",
      category: "Sectarian Attacks",
      exampleQuestion: "Why are [sect] not real Muslims?",
      reason: "Questions designed to attack other Muslim groups or promote sectarian hatred are refused. We focus on presenting Sunni scholarship without denigrating others.",
      methodology: "Academic differences are discussed respectfully. We present our methodology (manhaj) positively without engaging in polemics that serve no educational purpose.",
      icon: "sectarian",
    },
    {
      id: "4",
      category: "Political Party Endorsements",
      exampleQuestion: "Which political party should Muslims vote for?",
      reason: "Ummah Thoughts does not endorse political parties or movements. Such questions require local knowledge and cannot be answered with universal fatwas.",
      methodology: "Political engagement is contextual. We provide principles (shura, justice, maslaha) but leave application to local scholars who understand specific political landscapes.",
      icon: "political",
    },
    {
      id: "5",
      category: "Personal Relationship Disputes",
      exampleQuestion: "My spouse did X, should I divorce them?",
      reason: "Personal family matters require understanding both sides, context, and often mediation. Online responses cannot serve justice in such cases.",
      methodology: "We encourage consulting local imams or family counselors who can hear all parties, understand cultural context, and provide appropriate guidance.",
      icon: "personal",
    },
  ];

  const getIcon = (icon: RejectedQuestion["icon"]) => {
    switch (icon) {
      case "takfir":
        return <Flame className="h-5 w-5" />;
      case "violence":
        return <AlertTriangle className="h-5 w-5" />;
      case "sectarian":
        return <Users className="h-5 w-5" />;
      case "political":
        return <Scale className="h-5 w-5" />;
      case "personal":
        return <Users className="h-5 w-5" />;
      default:
        return <XCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                What We Do NOT Answer
              </h2>
              <p className="text-muted-foreground">
                Intellectual honesty includes knowing what questions should not be answered 
                in an online format. This archive explains our boundaries and why they exist, 
                demonstrating our commitment to responsible knowledge sharing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejected Categories */}
      <div className="space-y-4">
        {rejectedQuestions.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                    {getIcon(item.icon)}
                  </div>
                  <span className="text-destructive">{item.category}</span>
                  <Badge variant="outline" className="ml-auto text-destructive border-destructive/30">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Answered
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Example */}
                <div className="p-3 rounded-lg bg-muted/30 border-l-4 border-destructive/50">
                  <p className="text-sm text-muted-foreground mb-1">Example question type:</p>
                  <p className="text-foreground italic">"{item.exampleQuestion}"</p>
                </div>

                {/* Why Harmful */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">
                      Why This Is Harmful
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{item.reason}</p>
                </div>

                {/* Methodology */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Our Methodological Position
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{item.methodology}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <Card className="bg-muted/30">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Why We Publish This
              </h4>
              <p className="text-sm text-muted-foreground">
                Many platforms avoid controversial topics without explanation. We believe 
                transparency about our limitations builds trust. By explaining what we don't 
                answer and why, we demonstrate intellectual honesty and help users understand 
                the responsible approach to Islamic knowledge online.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
