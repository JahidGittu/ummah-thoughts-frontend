"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  MessageSquare,
  Globe,
  Award,
  Shield,
  PenTool,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole, RegisterData } from "@/contexts/AuthContext";

// Enhanced role configuration with more visual appeal
const ROLES: {
  value: UserRole;
  label: string;
  labelBn: string;
  icon: React.ElementType;
  iconColor: string;
  gradient: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  desc: string;
  descBn: string;
  features: string[];
}[] = [
    {
      value: "scholar",
      label: "Scholar",
      labelBn: "আলেম",
      icon: GraduationCap,
      iconColor: "text-primary",
      gradient: "from-primary/20 via-primary/5 to-transparent",
      borderColor: "border-primary/30 group-hover:border-primary/50",
      bgColor: "bg-primary/5",
      textColor: "text-primary",
      desc: "Publish fatwas, lead debates, review content",
      descBn: "ফতোয়া প্রকাশ, বিতর্ক পরিচালনা, বিষয়বস্তু পর্যালোচনা",
      features: ["Publish fatwas", "Lead debates", "Review content", "Scholar network"]
    },
    {
      value: "writer",
      label: "Writer",
      labelBn: "লেখক",
      icon: PenTool,
      iconColor: "text-secondary",
      gradient: "from-secondary/20 via-secondary/5 to-transparent",
      borderColor: "border-secondary/30 group-hover:border-secondary/50",
      bgColor: "bg-secondary/5",
      textColor: "text-secondary",
      desc: "Create articles, analyses, and research papers",
      descBn: "নিবন্ধ, বিশ্লেষণ এবং গবেষণা পত্র তৈরি করুন",
      features: ["Write articles", "Research papers", "Analyses", "Editorial access"]
    },
    {
      value: "user",
      label: "Learner",
      labelBn: "শিক্ষার্থী",
      icon: BookOpen,
      iconColor: "text-blue-500",
      gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
      borderColor: "border-blue-500/30 group-hover:border-blue-500/50",
      bgColor: "bg-blue-500/5",
      textColor: "text-blue-500",
      desc: "Access content, track progress, join discussions",
      descBn: "কন্টেন্ট অ্যাক্সেস, অগ্রগতি ট্র্যাক, আলোচনায় যোগ দিন",
      features: ["Access all content", "Track progress", "Join discussions", "Earn badges"]
    },
  ];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(p => ({ ...p, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await register({ ...formData, role: selectedRole });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error ?? "Registration failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Stats for the sidebar (can be moved to a separate component)
  const platformStats = [
    { number: "50+", label: "Scholars", icon: GraduationCap },
    { number: "500+", label: "Articles", icon: BookOpen },
    { number: "10K+", label: "Learners", icon: Users },
    { number: "200+", label: "Debates", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Animated circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl ring-2 ring-white/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-white font-display text-2xl font-bold tracking-tight">
                Ummah Thoughts
              </span>
              <p className="text-white/60 text-xs mt-0.5">Islamic Knowledge Platform</p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white/40 font-arabic text-3xl mb-6 leading-relaxed">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              <h2 className="text-white font-display text-4xl font-bold leading-tight mb-4">
                Begin Your Journey<br />of Sacred Knowledge
              </h2>

              <p className="text-white/70 text-lg leading-relaxed mb-10">
                Join a global community of learners, scholars, and seekers
                committed to authentic Islamic education and discourse.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {[
                { icon: Shield, text: "Authentic Content" },
                { icon: Award, text: "Verified Scholars" },
                { icon: Globe, text: "Global Community" },
                { icon: Sparkles, text: "Structured Learning" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {platformStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20"
                >
                  <stat.icon className="w-5 h-5 text-white/60 mb-2" />
                  <p className="text-white font-bold text-xl">{stat.number}</p>
                  <p className="text-white/50 text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer quote */}
          <div className="mt-auto pt-12">
            <p className="text-white/30 text-sm italic">
              "The seeking of knowledge is an obligation upon every Muslim."
            </p>
            <p className="text-white/20 text-xs mt-1">— Prophet Muhammad ﷺ</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              Ummah Thoughts
            </span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Create account
            </h1>
            <p className="text-muted-foreground mt-2">
              Join the platform for authentic Islamic scholarship
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step >= s
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-muted text-muted-foreground border border-border"
                  }`}>
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}

                  {/* Pulse effect on active step */}
                  {step === s && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                  )}
                </div>
                {s < 2 && (
                  <div className={`w-20 h-0.5 rounded-full transition-all ${step > s ? "bg-primary" : "bg-border"
                    }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Choose your path
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select the role that best describes your journey
                    </p>
                  </div>

                  {/* Role Cards */}
                  <div className="space-y-3">
                    {ROLES.map((r) => {
                      const isSelected = selectedRole === r.value;
                      const isHovered = hoveredRole === r.value;
                      const Icon = r.icon;

                      return (
                        <motion.button
                          key={r.value}
                          onClick={() => handleRoleSelect(r.value)}
                          onHoverStart={() => setHoveredRole(r.value)}
                          onHoverEnd={() => setHoveredRole(null)}
                          className={`group relative w-full overflow-hidden rounded-2xl border-2 transition-all duration-300
                            ${isSelected
                              ? `${r.borderColor} ${r.bgColor} scale-[1.02] shadow-lg`
                              : 'border-border hover:border-muted-foreground/30 bg-card hover:bg-accent/5'
                            }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {/* Gradient overlay on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${r.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                          <div className="relative p-5">
                            <div className="flex items-start gap-4">
                              {/* Icon with animated background */}
                              <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center
                                ${isSelected ? r.bgColor : 'bg-muted'} 
                                group-hover:scale-110 transition-transform duration-300`}
                              >
                                <Icon className={`w-7 h-7 ${isSelected ? r.textColor : 'text-muted-foreground'}`} />

                                {/* Decorative ring on hover */}
                                {isHovered && (
                                  <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.2, opacity: 0.5 }}
                                    className="absolute inset-0 rounded-xl border-2 border-primary/30"
                                  />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`font-semibold text-lg ${isSelected ? r.textColor : 'text-foreground'}`}>
                                    {r.label}
                                  </p>
                                  <span className="text-xs text-muted-foreground">· {r.labelBn}</span>
                                </div>

                                <p className={`text-sm mb-2 ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                                  {r.desc}
                                </p>

                                {/* Feature chips */}
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {r.features.map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className={`text-[10px] px-2 py-0.5 rounded-full border
                                        ${isSelected
                                          ? `${r.bgColor} ${r.borderColor} ${r.textColor}`
                                          : 'bg-muted/50 text-muted-foreground border-border'
                                        }`}
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Selection indicator */}
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`flex-shrink-0 w-6 h-6 rounded-full ${r.bgColor} flex items-center justify-center`}
                                >
                                  <CheckCircle2 className={`w-4 h-4 ${r.textColor}`} />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={() => {
                      if (!selectedRole) {
                        setError("Please select a role to continue");
                      } else {
                        setError("");
                        setStep(2);
                      }
                    }}
                    disabled={!selectedRole}
                    className="w-full h-12 rounded-xl font-semibold text-base group relative overflow-hidden"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Continue
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  {/* Back button */}
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to role selection
                  </button>

                  {/* Selected role indicator */}
                  {selectedRole && (
                    <div className="mb-6 p-3 rounded-xl bg-muted/30 border border-border flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${ROLES.find(r => r.value === selectedRole)?.bgColor} flex items-center justify-center`}>
                        {React.createElement(ROLES.find(r => r.value === selectedRole)?.icon || GraduationCap, {
                          className: `w-4 h-4 ${ROLES.find(r => r.value === selectedRole)?.textColor}`
                        })}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Signing up as {ROLES.find(r => r.value === selectedRole)?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ROLES.find(r => r.value === selectedRole)?.desc}
                        </p>
                      </div>
                    </div>
                  )}

                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Your details
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Full name
                      </label>
                      <div className="relative group">
                        <Input
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="pl-4 h-12 rounded-xl border-border bg-background/50 focus:border-primary/50 transition-all"
                          required
                        />
                        <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>

                    {/* Specialization (for scholar/writer) */}
                    {(selectedRole === "scholar" || selectedRole === "writer") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-medium text-foreground flex items-center gap-1">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          Specialization <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>
                        <Input
                          value={formData.specialization || ""}
                          onChange={e => setFormData(p => ({ ...p, specialization: e.target.value }))}
                          placeholder={selectedRole === "scholar" ? "e.g. Usul al-Fiqh, Tafsir..." : "e.g. Islamic History, Fiqh..."}
                          className="h-12 rounded-xl border-border"
                        />
                      </motion.div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email address
                      </label>
                      <div className="relative group">
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="pl-4 h-12 rounded-xl border-border bg-background/50 focus:border-primary/50 transition-all"
                          required
                        />
                      </div>
                    </div>



                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        Password
                      </label>
                      <div className="relative group">
                        <Input
                          type={showPw ? "text" : "password"}
                          value={formData.password}
                          onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                          placeholder="Create a strong password"
                          className="pl-4 pr-12 h-12 rounded-xl border-border bg-background/50 focus:border-primary/50 transition-all"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be at least 6 characters long
                      </p>
                    </div>

                    {/* Error message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3"
                      >
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </motion.div>
                    )}

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl font-semibold text-base mt-6 relative overflow-hidden"
                      size="lg"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Create Account
                          <Sparkles className="w-4 h-4" />
                        </span>
                      )}
                    </Button>

                    {/* Terms notice */}
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By creating an account, you agree to our{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1 group"
            >
              Sign in
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>

          {/* Language toggle for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60 mt-4">
            <Globe className="h-3 w-3" />
            <span>English · বাংলা</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

