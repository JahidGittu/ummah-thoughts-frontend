import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, GraduationCap, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";

// Mock scholar credentials (frontend only)
const MOCK_SCHOLARS: Record<string, { name: string; title: string; specialization: string; avatar: string }> = {
  "ahmad@ummahthoughts.com": {
    name: "Dr. Ahmad Al-Rashid",
    title: "Professor of Islamic Political Thought",
    specialization: "Fiqh al-Siyasah",
    avatar: "A",
  },
  "fatima@ummahthoughts.com": {
    name: "Dr. Fatima Zahra",
    title: "Senior Researcher",
    specialization: "Islamic Governance",
    avatar: "F",
  },
  "muhammad@ummahthoughts.com": {
    name: "Sh. Muhammad Hasan",
    title: "Senior Scholar, Dar al-Ifta",
    specialization: "Usul al-Fiqh",
    avatar: "M",
  },
  "ibrahim@ummahthoughts.com": {
    name: "Prof. Ibrahim Khalil",
    title: "Academic & Researcher",
    specialization: "Political Theory",
    avatar: "I",
  },
};

const MOCK_PASSWORD = "scholar123"; // same for all mock accounts

export interface ScholarProfile {
  email: string;
  name: string;
  title: string;
  specialization: string;
  avatar: string;
}

interface ScholarLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (scholar: ScholarProfile) => void;
}

export const ScholarLoginModal = ({ isOpen, onClose, onLogin }: ScholarLoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const scholar = MOCK_SCHOLARS[email.toLowerCase()];
    if (scholar && password === MOCK_PASSWORD) {
      onLogin({ email, ...scholar });
      setEmail("");
      setPassword("");
    } else {
      setError("Invalid credentials. Try a demo account below.");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border px-8 py-7">
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <Badge className="bg-primary/15 text-primary border border-primary/25 text-xs mb-1.5">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Scholar Portal
                    </Badge>
                    <h2 className="text-xl font-bold text-foreground">Scholar Login</h2>
                    <p className="text-sm text-muted-foreground">Access your debate dashboard</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="scholar@ummahthoughts.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Authenticating…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Sign In to Scholar Portal
                    </span>
                  )}
                </Button>

                {/* Demo accounts */}
                <div className="rounded-2xl bg-muted/50 border border-border p-4 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Demo Scholar Accounts (password: scholar123)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(MOCK_SCHOLARS).map(([mail, s]) => (
                      <button
                        key={mail}
                        type="button"
                        onClick={() => { setEmail(mail); setPassword(MOCK_PASSWORD); setError(""); }}
                        className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {s.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{s.name.split(" ")[0]} {s.name.split(" ")[1]}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{s.specialization}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
