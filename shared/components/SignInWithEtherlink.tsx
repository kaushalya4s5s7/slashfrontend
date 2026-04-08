"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { useSiweAuth } from "@/shared/context/siwe-auth-context";

export function SignInWithEtherlink() {
  const { isAuthenticated, signIn, signOut, isSigning } = useSiweAuth();
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const onSignIn = async () => {
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated || isSigning || attempted) return;
    setAttempted(true);
    void onSignIn();
  }, [attempted, isAuthenticated, isSigning]);

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <Button variant="secondary" onClick={signOut}>
          Sign out (SIWE)
        </Button>
      ) : (
        <span className="text-sm text-zinc-400">
          {isSigning ? "Signing in with Etherlink..." : "Starting sign-in..."}
        </span>
      )}
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
