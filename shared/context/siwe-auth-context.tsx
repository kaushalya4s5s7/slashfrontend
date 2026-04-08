"use client";

import { createContext, useContext, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";

type SiweSession = {
  address: `0x${string}`;
  issuedAt: string;
  nonce: string;
};

type SiweContextValue = {
  isAuthenticated: boolean;
  session: SiweSession | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  isSigning: boolean;
};

const SiweAuthContext = createContext<SiweContextValue | null>(null);
const STORAGE_KEY = "slashmarket.siwe.session";

function createNonce() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function SiweAuthProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { signMessageAsync, isPending } = useSignMessage();
  const [session, setSession] = useState<SiweSession | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SiweSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const signIn = async () => {
    if (!address) throw new Error("Connect wallet first");

    const nonce = createNonce();
    const issuedAt = new Date().toISOString();
    const message = [
      "SlashMarket wants you to sign in with your Ethereum account:",
      address,
      "",
      "Sign in with Etherlink (SIWE style)",
      "",
      `URI: ${window.location.origin}`,
      "Version: 1",
      `Chain ID: 127823`,
      `Nonce: ${nonce}`,
      `Issued At: ${issuedAt}`,
    ].join("\n");

    const signature = await signMessageAsync({ message });
    const recovered = await recoverMessageAddress({ message, signature });

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      throw new Error("Signature verification failed");
    }

    const next = { address, nonce, issuedAt } satisfies SiweSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const value: SiweContextValue = {
    isAuthenticated: Boolean(session && address && session.address.toLowerCase() === address.toLowerCase()),
    session,
    signIn,
    signOut,
    isSigning: isPending,
  };

  return <SiweAuthContext.Provider value={value}>{children}</SiweAuthContext.Provider>;
}

export function useSiweAuth() {
  const ctx = useContext(SiweAuthContext);
  if (!ctx) throw new Error("useSiweAuth must be used inside SiweAuthProvider");
  return ctx;
}
