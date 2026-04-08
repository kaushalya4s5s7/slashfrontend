"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SignInWithEtherlink } from "@/shared/components/SignInWithEtherlink";

const links = [
  { href: "/deposit", label: "Deposit" },
  { href: "/split", label: "Split" },
  { href: "/swap", label: "Swap" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/agents", label: "Agents" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-zinc-100">
            SlashMarket
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
          <SignInWithEtherlink />
          <ConnectButton chainStatus="icon" accountStatus="address" />
        </div>
      </div>
    </header>
  );
}
