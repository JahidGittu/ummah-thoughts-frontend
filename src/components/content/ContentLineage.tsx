import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  CheckCircle, 
  Eye, 
  History, 
  GitBranch,
  MessageSquare,
  Calendar,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

interface Contributor {
  name: string;
  role: "author" | "verifier" | "reviewer" | "editor";
  date: string;
  avatar?: string;
  verified?: boolean;
}

interface Revision {
  version: string;
  date: string;
  author: string;
  changes: string;
}

interface DisagreementNote {
  scholar: string;
  position: string;
  reference?: string;
}

interface ContentLineageProps {
  title: string;
  contributors: Contributor[];
  revisions: Revision[];
  disagreementNotes?: DisagreementNote[];
  lastUpdated: string;
  totalViews?: number;
}

const roleConfig = {
  author: { label: "Author", color: "bg-primary/20 text-primary", icon: User },
  verifier: { label: "Verified By", color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle },
  reviewer: { label: "Reviewed By", color: "bg-blue-500/20 text-blue-400", icon: Eye },
  editor: { label: "Edited By", color: "bg-amber-500/20 text-amber-400", icon: History },
};

export const ContentLineage = ({
  title,
  contributors,
  revisions,
  disagreementNotes = [],
  lastUpdated,
  totalViews,
}: ContentLineageProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                <GitBranch className="h-3 w-3 mr-1" />
                Content Lineage
              </Badge>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            {totalViews && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {totalViews.toLocaleString()} views
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contributors.map((contributor, idx) => {
              const config = roleConfig[contributor.role];
              const RoleIcon = config.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {contributor.avatar ? (
                      <img src={contributor.avatar} alt={contributor.name} className="rounded-full" />
                    ) : (
                      <span className="text-lg font-medium">{contributor.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{contributor.name}</span>
                      {contributor.verified && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={config.color} variant="secondary">
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <span>• {contributor.date}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revision History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Revision History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {revisions.map((revision, idx) => (
                <motion.div
                  key={revision.version}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-10"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full ${
                    idx === 0 ? "bg-primary" : "bg-muted"
                  }`} />

                  <div className="p-3 rounded-lg bg-background/50 border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">v{revision.version}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {revision.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{revision.changes}</p>
                    <p className="text-xs text-muted-foreground mt-1">By {revision.author}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Button variant="link" className="mt-4 p-0 h-auto">
            View full revision history <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Disagreement Notes */}
      {disagreementNotes.length > 0 && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-400">
              <MessageSquare className="h-4 w-4" />
              Scholarly Disagreement Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disagreementNotes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-background/50 border border-amber-500/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{note.scholar}</p>
                      <p className="text-sm text-muted-foreground mt-1">{note.position}</p>
                    </div>
                    {note.reference && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-background/30">
              <p className="text-xs text-muted-foreground italic">
                These notes reflect areas where scholars have differing opinions. 
                Ummah Thoughts presents all positions transparently for scholarly review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transparency Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <GitBranch className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Like GitHub for Knowledge</h4>
              <p className="text-sm text-muted-foreground">
                Every piece of content on Ummah Thoughts has full transparency about who wrote it, 
                who verified it, and how it evolved. This ensures accountability and allows 
                the community to trace the intellectual lineage of ideas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
