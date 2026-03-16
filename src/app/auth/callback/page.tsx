"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * OAuth callback - receives token & user from backend redirect.
 * URL: /auth/callback?token=xxx&user=...
 */
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userEncoded = searchParams.get("user");

    if (token && userEncoded) {
      try {
        const user = JSON.parse(decodeURIComponent(userEncoded));
        localStorage.setItem("ummahthoughts_token", token);
        localStorage.setItem("ummahthoughts_user", JSON.stringify(user));
      } catch {
        /* ignore parse error */
      }
    }
    router.replace("/dashboard");
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Signing you in…</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
