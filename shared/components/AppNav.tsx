"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/shared/components/ui/Button";
import { useSiweAuth } from "@/shared/context/siwe-auth-context";

const links = [
  { href: "/deposit", label: "Deposit" },
  { href: "/swap", label: "Swap" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/agents", label: "Agents" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isAuthenticated, signIn, isSigning } = useSiweAuth();
  const [error, setError] = useState<string | null>(null);
  const [startFlow, setStartFlow] = useState(false);
  const [autoSignAttempted, setAutoSignAttempted] = useState(false);

  const onGetStarted = async () => {
    setError(null);
    setStartFlow(true);
    setAutoSignAttempted(false);

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!isAuthenticated) {
      try {
        await signIn();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
        setStartFlow(false);
        setAutoSignAttempted(false);
      }
      return;
    }

    setStartFlow(false);
    router.push("/deposit");
  };

  useEffect(() => {
    if (!startFlow) return;

    if (isAuthenticated) {
      setStartFlow(false);
      setAutoSignAttempted(false);
      router.push("/deposit");
      return;
    }

    if (isConnected && !isSigning && !autoSignAttempted) {
      setAutoSignAttempted(true);
      void signIn().catch((err) => {
        setError(err instanceof Error ? err.message : "Authentication failed");
        setStartFlow(false);
        setAutoSignAttempted(false);
      });
    }
  }, [autoSignAttempted, isAuthenticated, isConnected, isSigning, router, signIn, startFlow]);

  return (
    <header className="overflow-x-hidden  border-zinc-800 bg-zinc-950/95 backdrop-blur font-urbanist ">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
         
          <Link href="/" className="text-sm font-semibold text-zinc-100">
            <Image
                            src="/ubon-removebg-preview.svg"
                            alt="Slash Market logo"
                            width={100}
                            height={70}
                            priority
                            className="mx-auto "
                          />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition ${
                    active ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <ConnectButton chainStatus="icon" accountStatus="address" />
          ) : (
            <Button variant="primary" onClick={onGetStarted} loading={isSigning || (startFlow && !isAuthenticated)}>
              Get Started
            </Button>
          )}
          {error ? <span className="text-xs text-red-400">{error}</span> : null}
        </div>
      </div>
    </header>
  );
}
