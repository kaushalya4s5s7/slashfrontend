"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { useSiweAuth } from "@/shared/context/siwe-auth-context";

export function SignInWithEtherlink() {
  const { isAuthenticated, signIn, signOut, isSigning } = useSiweAuth();
  const [error, setError] = useState<string | null>(null);

  const onSignIn = async () => {
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <Button variant="secondary" onClick={signOut}>
          Sign out (SIWE)
        </Button>
      ) : (
        <Button variant="secondary" onClick={onSignIn} loading={isSigning}>
          Sign in with Etherlink
        </Button>
      )}
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
