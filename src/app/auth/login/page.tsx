import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Lock, Mail, GraduationCap, AlertCircle, Sparkles, BookOpen, Users, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const DEMO_ACCOUNTS: { email: string; role: UserRole; label: string; labelBn: string; icon: React.ElementType; gradient: string }[] = [
  { email: "scholar@ummahthoughts.com", role: "scholar", label: "Scholar", labelBn: "আলেম", icon: GraduationCap, gradient: "from-primary/20 to-primary/5 border-primary/30 text-primary hover:border-primary/50" },
  { email: "user@ummahthoughts.com", role: "user", label: "Learner", labelBn: "শিক্ষার্থী", icon: BookOpen, gradient: "from-blue-500/20 to-blue-500/5 border-blue-400/30 text-blue-600 hover:border-blue-400/50" },
  { email: "writer@ummahthoughts.com", role: "writer", label: "Writer", labelBn: "লেখক", icon: MessageSquare, gradient: "from-secondary/20 to-secondary/5 border-secondary/30 text-secondary hover:border-secondary/50" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) navigate("/dashboard");
    else setError(res.error ?? "Login failed.");
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left – premium branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden"
        style={{ background: "var(--gradient-emerald)" }}>
        {/* Geometric overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

        {/* Top logo */}
        <div className="relative z-10 px-12 pt-12">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-display text-lg font-bold tracking-tight">Ummah Thoughts</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 px-12 space-y-8">
          <div>
            <p className="text-white/50 font-arabic text-4xl leading-loose mb-6">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="text-white font-display text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Knowledge Rooted<br />in Sacred<br />Tradition
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              {lang === "bn"
                ? "আধুনিক যুগে প্রামাণিক ইসলামী পাণ্ডিত্য, বিতর্ক এবং শিক্ষার জন্য নিবেদিত একটি প্ল্যাটফর্ম।"
                : "A platform dedicated to authentic Islamic scholarship, debate, and learning for the modern age."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            {[
              { n: "12K+", l: lang === "bn" ? "আলেম" : "Scholars" },
              { n: "45K+", l: lang === "bn" ? "শিক্ষার্থী" : "Learners" },
              { n: "3K+", l: lang === "bn" ? "নিবন্ধ" : "Articles" },
              { n: "200+", l: lang === "bn" ? "বিতর্ক" : "Debates" }
            ].map(s => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <p className="text-white font-bold text-xl">{s.n}</p>
                <p className="text-white/55 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 px-12 pb-12">
          <div className="border-t border-white/15 pt-6">
            <p className="text-white/50 text-xs font-arabic leading-loose text-right">
              وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ
            </p>
            <p className="text-white/40 text-xs mt-1">Quran 12:76 · {lang === "bn" ? "প্রতিটি জ্ঞানীর উপরে আরও জ্ঞানী আছেন" : "Above every knower is a higher knower"}</p>
          </div>
        </div>
      </div>

      {/* Right – form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-background">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] space-y-7"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" style={{ width: 18, height: 18 }} />
            </div>
            <span className="font-display font-bold text-foreground text-lg">Ummah Thoughts</span>
          </div>

          {/* Header */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {lang === "bn" ? "স্বাগতম" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {lang === "bn" ? "আপনার ড্যাশবোর্ড অ্যাক্সেস করতে সাইন ইন করুন" : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {lang === "bn" ? "ইমেইল ঠিকানা" : "Email address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={lang === "bn" ? "আপনার@ইমেইল.com" : "you@example.com"}
                  className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:border-primary/50 transition-colors" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={lang === "bn" ? "পাসওয়ার্ড দিন" : "Enter password"}
                  className="pl-10 pr-10 h-11 rounded-xl bg-muted/30 border-border focus:border-primary/50 transition-colors" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-shadow">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  {lang === "bn" ? "সাইন ইন হচ্ছে…" : "Signing in…"}
                </span>
              ) : (lang === "bn" ? "সাইন ইন" : "Sign In")}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-secondary" />
                {lang === "bn" ? "ডেমো অ্যাকাউন্ট চেষ্টা করুন" : "Try a demo account"}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {lang === "bn" ? "সবার পাসওয়ার্ড:" : "Password for all:"}{" "}
              <code className="bg-muted px-2 py-0.5 rounded-md font-mono text-foreground">demo1234</code>
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {DEMO_ACCOUNTS.map((d, i) => (
                <motion.button
                  key={d.role}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onClick={() => fillDemo(d.email)}
                  className={`bg-gradient-to-br ${d.gradient} border rounded-xl px-3.5 py-3 text-xs font-semibold transition-all hover:scale-[1.02] hover:shadow-md text-left flex items-center gap-2.5`}
                >
                  <d.icon className="h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p>{lang === "bn" ? d.labelBn : d.label}</p>
                    <p className="text-[10px] font-normal opacity-55 mt-0.5 truncate">{d.email}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {lang === "bn" ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {lang === "bn" ? "একটি তৈরি করুন" : "Create one"}
            </Link>
          </p>

          {/* Language hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
            <Globe className="h-3 w-3" />
            <span>{lang === "bn" ? "বাংলা ইন্টারফেস সক্রিয়" : "English interface active"}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
