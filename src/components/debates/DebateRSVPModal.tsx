import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Users, MapPin, Video, BookOpen, CheckCircle2, Bell, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Participant {
  name: string;
  title: string;
  specialization: string;
  institution: string;
  position: string;
  bio: string;
}

interface DebateRSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  debate: {
    id: string;
    title: string;
    titleAr?: string;
    topic: string;
    scheduledDate?: string;
    duration?: string;
    format: "async" | "live";
    participants: {
      positionA: { name: string; role: string };
      positionB: { name: string; role: string };
    };
    bookmarks?: number;
  };
}

// Extended bio data keyed by name
const EXTENDED_BIOS: Record<string, Participant> = {
  "Dr. Fatima Zahra": {
    name: "Dr. Fatima Zahra",
    title: "Senior Research Fellow",
    specialization: "Islamic Political Theory",
    institution: "International Islamic University",
    position: "Khilafah as a valid political model for contemporary Muslim-majority states",
    bio: "Dr. Zahra has authored over 40 peer-reviewed papers on Islamic governance and political philosophy. Her landmark work 'Reviving the Caliphate Discourse' has been translated into 7 languages.",
  },
  "Prof. Ibrahim Khalil": {
    name: "Prof. Ibrahim Khalil",
    title: "Professor of Comparative Politics",
    specialization: "Islamic Constitutional Law",
    institution: "Al-Azhar University, Cairo",
    position: "Modern nation-states can embody Khilafah principles without formal institutional restoration",
    bio: "Prof. Khalil is a constitutional scholar who has advised three governments on Islamic legal frameworks. He holds doctorates from both Al-Azhar and Oxford University.",
  },
};

export function DebateRSVPModal({ isOpen, onClose, debate }: DebateRSVPModalProps) {
  const [rsvped, setRsvped] = useState(false);
  const [attendees, setAttendees] = useState(45);
  const [notifyMe, setNotifyMe] = useState(false);

  const participantA = EXTENDED_BIOS[debate.participants.positionA.name] ?? {
    name: debate.participants.positionA.name,
    title: debate.participants.positionA.role,
    specialization: debate.topic,
    institution: "Ummah Thoughts Scholar",
    position: "Position A on " + debate.title,
    bio: "A verified scholar participating in this debate.",
  };

  const participantB = EXTENDED_BIOS[debate.participants.positionB.name] ?? {
    name: debate.participants.positionB.name,
    title: debate.participants.positionB.role,
    specialization: debate.topic,
    institution: "Ummah Thoughts Scholar",
    position: "Position B on " + debate.title,
    bio: "A verified scholar participating in this debate.",
  };

  const handleRSVP = () => {
    if (!rsvped) {
      setRsvped(true);
      setAttendees(v => v + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl shadow-[var(--shadow-elevated)]">

              {/* Header gradient banner */}
              <div className="relative h-3 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-t-3xl" />

              <div className="p-6 space-y-6">
                {/* Title row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">Upcoming</Badge>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Video className="h-2.5 w-2.5" /> Live Session
                      </Badge>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <BookOpen className="h-2.5 w-2.5" /> {debate.topic}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-foreground leading-snug">{debate.title}</h2>
                    {debate.titleAr && (
                      <p className="text-sm font-amiri text-muted-foreground" dir="rtl">{debate.titleAr}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl hover:bg-muted flex items-center justify-center flex-shrink-0 transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Schedule info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Calendar, label: "Date & Time", value: debate.scheduledDate ?? "TBA" },
                    { icon: Clock,    label: "Duration",    value: debate.duration ?? "TBA" },
                    { icon: Users,    label: "Registered",  value: `${attendees} people` },
                    { icon: Video,    label: "Format",      value: "Live Online Session" },
                    { icon: MapPin,   label: "Platform",    value: "Ummah Thoughts Live" },
                  ].map(info => (
                    <div key={info.label} className="flex items-start gap-2.5 rounded-2xl bg-muted/50 border border-border p-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <info.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium">{info.label}</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Participants */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> Debate Participants
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { participant: participantA, side: "A", sideColor: "text-primary", sideBg: "bg-primary/10", borderColor: "border-primary/20" },
                      { participant: participantB, side: "B", sideColor: "text-secondary", sideBg: "bg-secondary/10", borderColor: "border-secondary/20" },
                    ].map(({ participant, side, sideColor, sideBg, borderColor }) => (
                      <div key={side} className={cn("rounded-2xl border p-4 space-y-2.5", borderColor)}>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0", sideBg, sideColor)}>
                            {side}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{participant.name}</p>
                            <p className="text-[10px] text-muted-foreground">{participant.title}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Award className="h-3 w-3 flex-shrink-0" />
                            {participant.institution}
                          </div>
                        </div>
                        <div className={cn("rounded-xl p-2.5 text-[11px] leading-relaxed", sideBg)}>
                          <span className="font-semibold text-foreground">Position: </span>
                          <span className="text-muted-foreground">{participant.position}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{participant.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RSVP actions */}
                <div className="space-y-3 pt-1 border-t border-border">
                  {rsvped ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-emerald-700">You're registered!</p>
                        <p className="text-xs text-muted-foreground mt-0.5">You'll receive a reminder 30 minutes before the debate starts.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <Button
                      className="w-full rounded-xl gap-2 h-11 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                      onClick={handleRSVP}
                    >
                      <Users className="h-4 w-4" /> Confirm Attendance ({attendees} registered)
                    </Button>
                  )}

                  <button
                    onClick={() => setNotifyMe(v => !v)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all",
                      notifyMe
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Bell className={cn("h-4 w-4", notifyMe && "fill-current")} />
                    {notifyMe ? "✓ Reminder set" : "Notify me 30 min before"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
