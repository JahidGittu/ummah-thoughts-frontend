import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, GraduationCap, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole, RegisterData } from "@/contexts/AuthContext";

const ROLES: { value: UserRole; label: string; icon: string; desc: string; color: string }[] = [
  { value: "scholar", label: "Scholar", icon: "🎓", desc: "Publish fatwas, lead debates, review content", color: "border-primary/40 bg-primary/5 text-primary" },
  { value: "writer", label: "Writer", icon: "✍️", desc: "Create articles, analyses, and research papers", color: "border-secondary/40 bg-secondary/5 text-secondary" },
  { value: "user", label: "Learner", icon: "📚", desc: "Access content, track progress, join discussions", color: "border-blue-400/40 bg-blue-500/5 text-blue-600" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<RegisterData>({ name: "", email: "", password: "", role: "user" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(p => ({ ...p, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select a role."); return; }
    setError("");
    setLoading(true);
    const res = await register({ ...formData, role: selectedRole });
    setLoading(false);
    if (res.success) navigate("/dashboard");
    else setError(res.error ?? "Registration failed.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">Ummah Thoughts</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Create your account</h1>
          <p className="text-muted-foreground mt-1">Join the platform for authentic Islamic scholarship</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              {s < 2 && <div className={`w-16 h-0.5 transition-all ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-8 space-y-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Choose your role</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Select the role that best describes you</p>
                </div>
                <div className="grid gap-3">
                  {ROLES.map(r => (
                    <button key={r.value} onClick={() => handleRoleSelect(r.value)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left hover:scale-[1.01]
                        ${selectedRole === r.value ? `${r.color} border-2` : "border-border bg-muted/30 hover:bg-muted/60"}`}>
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${selectedRole === r.value ? "" : "text-foreground"}`}>{r.label}</p>
                        <p className={`text-xs mt-0.5 ${selectedRole === r.value ? "opacity-80" : "text-muted-foreground"}`}>{r.desc}</p>
                      </div>
                      {selectedRole === r.value && <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
                <Button onClick={() => { if (!selectedRole) setError("Please select a role."); else { setError(""); setStep(2); } }}
                  className="w-full h-11 rounded-xl font-semibold" disabled={!selectedRole}>
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <h2 className="font-display text-xl font-bold text-foreground mb-5">Your details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Full name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name" className="pl-10 h-11 rounded-xl" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com" className="pl-10 h-11 rounded-xl" required />
                    </div>
                  </div>
                  {(selectedRole === "scholar" || selectedRole === "writer") && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Specialization <span className="text-muted-foreground">(optional)</span></label>
                      <Input value={formData.specialization || ""} onChange={e => setFormData(p => ({ ...p, specialization: e.target.value }))}
                        placeholder="e.g. Usul al-Fiqh, Islamic History…" className="h-11 rounded-xl" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 8 characters" className="pl-10 pr-10 h-11 rounded-xl" required minLength={6} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-semibold mt-2">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                        Creating account…
                      </span>
                    ) : "Create Account"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
