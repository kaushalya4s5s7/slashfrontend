import Link from "next/link";

const footerLinks = [
  { href: "/deposit", label: "Deposit" },
  { href: "/swap", label: "Swap" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/agents", label: "Agents" },
];

export function HomeFooterSection() {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-black font-urbanist ">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px);background-size:28px_28px]" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-between px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-urbanist ">SlashMarket</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            Yield governance,
            <span className="block text-zinc-400">designed for conviction.</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-zinc-200">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-zinc-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-200">Core Thesis</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Let agents compete for alpha, but force every decision through a verifiable governance rail.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-200">Network</p>
            <p className="mt-3 text-sm text-zinc-400">Etherlink Shadownet · Tezos-native strategy intelligence.</p>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-4 text-xs text-zinc-500">
          © {new Date().getFullYear()} SlashMarket — Autonomous governance, human-readable proof.
        </div>
      </div>
    </section>
  );
}
