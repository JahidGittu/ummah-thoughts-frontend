"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, GraduationCap, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ScholarLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export const ScholarLoginModal = ({ isOpen, onClose, onLogin }: ScholarLoginModalProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, close modal
  if (user) {
    onClose();
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(email, password);
      setEmail("");
      setPassword("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts
  const demoAccounts = [
    { email: "scholar@ummahthoughts.com", name: "Dr. Ahmad Al-Rashid", role: "Scholar", avatar: "A" },
    { email: "user@ummahthoughts.com", name: "Omar Abdullah", role: "Learner", avatar: "O" },
    { email: "admin@ummahthoughts.com", name: "Admin", role: "Administrator", avatar: "A" },
  ];

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
                    <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
                    <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl"
                    required
                    disabled={loading}
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
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
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
                      <Lock className="h-4 w-4" /> Sign In
                    </span>
                  )}
                </Button>

                {/* Demo Accounts */}
                <div className="rounded-2xl bg-muted/50 border border-border p-4 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Demo Accounts
                  </p>
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground">
                      <strong>Scholar:</strong> scholar@ummahthoughts.com / demo1234<br />
                      <strong>Learner:</strong> user@ummahthoughts.com / demo1234<br />
                      <strong>Admin:</strong> admin@ummahthoughts.com / admin1234
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => { 
                          setEmail(acc.email); 
                          setPassword(acc.email === "admin@ummahthoughts.com" ? "admin1234" : "demo1234"); 
                          setError(""); 
                        }}
                        className="flex flex-col items-center gap-1 bg-card border border-border rounded-xl px-2 py-2 hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {acc.avatar}
                        </div>
                        <span className="text-[8px] font-medium text-foreground text-center truncate w-full">
                          {acc.role}
                        </span>
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