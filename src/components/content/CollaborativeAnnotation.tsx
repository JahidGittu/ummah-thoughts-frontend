import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Highlighter, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  BookOpen,
  User,
  GraduationCap,
  Lock,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Annotation {
  id: string;
  text: string;
  highlightedText: string;
  author: string;
  authorRole: "member" | "scholar" | "research_assistant";
  isPublic: boolean;
  createdAt: string;
  position: { start: number; end: number };
}

interface CollaborativeAnnotationProps {
  contentId: string;
  contentText: string;
}

export const CollaborativeAnnotation = ({
  contentId,
  contentText,
}: CollaborativeAnnotationProps) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Mock annotations
  const [annotations] = useState<Annotation[]>([
    {
      id: "1",
      text: "This principle is foundational to understanding later developments in political fiqh.",
      highlightedText: "consultation (shura)",
      author: "Dr. Ahmad Hassan",
      authorRole: "scholar",
      isPublic: true,
      createdAt: "2024-01-10",
      position: { start: 45, end: 65 },
    },
    {
      id: "2",
      text: "See also: Al-Mawardi's Al-Ahkam al-Sultaniyyah for classical elaboration.",
      highlightedText: "governance",
      author: "Research Team",
      authorRole: "research_assistant",
      isPublic: true,
      createdAt: "2024-01-08",
      position: { start: 120, end: 130 },
    },
    {
      id: "3",
      text: "My personal note: Need to research Ibn Khaldun's perspective on this.",
      highlightedText: "political authority",
      author: "You",
      authorRole: "member",
      isPublic: false,
      createdAt: "2024-01-12",
      position: { start: 200, end: 220 },
    },
  ]);

  const getRoleIcon = (role: Annotation["authorRole"]) => {
    switch (role) {
      case "scholar":
        return <GraduationCap className="h-3 w-3" />;
      case "research_assistant":
        return <BookOpen className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = (role: Annotation["authorRole"]) => {
    switch (role) {
      case "scholar":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "research_assistant":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const scholarAnnotations = annotations.filter(
    (a) => a.authorRole === "scholar" && a.isPublic
  );
  const myAnnotations = annotations.filter((a) => a.author === "You");

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Highlighter className="h-5 w-5 text-primary" />
              Annotations & Notes
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnnotations(!showAnnotations)}
            >
              {showAnnotations ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="gap-1">
              <GraduationCap className="h-3 w-3" />
              {scholarAnnotations.length} Scholar Notes
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              {myAnnotations.length} Private Notes
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Add New Note */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" />
            Add Private Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              Select text from the content above, then add your note:
            </p>
            <div className="p-2 bg-background rounded border min-h-[40px]">
              {selectedText ? (
                <span className="bg-primary/20 px-1 rounded">{selectedText}</span>
              ) : (
                <span className="text-muted-foreground italic">
                  No text selected...
                </span>
              )}
            </div>
          </div>

          <Textarea
            placeholder="Write your private note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Private notes are only visible to you
            </p>
            <Button size="sm" disabled={!newNote.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Annotations List */}
      <AnimatePresence>
        {showAnnotations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Scholar Notes Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-emerald-400" />
                  Scholar Notes
                  <Badge variant="secondary" className="ml-auto">
                    Read-only
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scholarAnnotations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No scholar annotations on this content yet.
                  </p>
                ) : (
                  scholarAnnotations.map((annotation) => (
                    <motion.div
                      key={annotation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">
                              {annotation.author}
                            </span>
                            <Badge className={getRoleBadgeVariant(annotation.authorRole)}>
                              Scholar
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            On: "<span className="bg-primary/20 px-1 rounded">{annotation.highlightedText}</span>"
                          </p>
                          <p className="text-sm text-foreground">{annotation.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* My Notes Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  My Private Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myAnnotations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    You haven't added any notes yet.
                  </p>
                ) : (
                  myAnnotations.map((annotation) => (
                    <motion.div
                      key={annotation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-muted/30 border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">
                            On: "<span className="bg-primary/20 px-1 rounded">{annotation.highlightedText}</span>"
                          </p>
                          <p className="text-sm text-foreground">{annotation.text}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {annotation.createdAt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
