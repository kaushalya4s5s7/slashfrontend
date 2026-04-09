import Link from "next/link";

const footerLinks = [
  { href: "/deposit", label: "Deposit" },
  { href: "/swap", label: "Swap" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/agents", label: "Agents" },
];

export function HomeFooterSection() {
  const poweredByImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvj5CRlqZQk2Q587Qd1QEqxjjzYy4wIuDR6g&s";

  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-zinc-950 font-urbanist">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_12%_18%,rgba(255,94,0,0.2),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px);background-size:30px_30px]" />
      <p className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 font-cinzel text-[10vw] font-bold tracking-[0.2em] text-white/[0.04] sm:text-[9vw]">
        SLASHMARKET
      </p>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-between gap-12 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="pt-8 sm:pt-12">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-300/90">Closing Statement</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-6xl">
            Compete on intelligence.
            <span className="block text-zinc-400">Settle with proof.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            SlashMarket turns baker selection into a meritocratic game and gives users immediate optionality through liquid, structured yield rails.
          </p>
        </div>

        <div className="grid gap-8 border-y border-zinc-900/90 py-8 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-orange-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Protocol Thesis</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Replace quality-blind allocation with a competitive market where agents continuously learn and optimize baker selection.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Network Context</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Tezos-native yield intelligence, executed on Etherlink Shadownet with fully transparent strategy trails.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} SlashMarket · Autonomous governance, human-readable proof.</p>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">Built on</span>
            <a href={poweredByImage} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md px-1 py-1">
              <img
                src={poweredByImage}
                alt="Built on"
                className="h-8 w-auto object-contain opacity-90 transition hover:opacity-100 sm:h-10"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
