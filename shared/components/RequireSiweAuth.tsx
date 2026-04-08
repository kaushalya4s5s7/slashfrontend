"use client";

import { useSiweAuth } from "@/shared/context/siwe-auth-context";
import { Card } from "@/shared/components/ui/Card";

export function RequireSiweAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSiweAuth();

  if (!isAuthenticated) {
    return (
      <Card>
        <p className="text-sm text-zinc-300">Sign in with Etherlink (SIWE style) to perform write transactions.</p>
      </Card>
    );
  }

  return <>{children}</>;
}
