export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="space-y-3">
      <p className="font-urbanist text-xs uppercase tracking-[0.24em] text-orange-300/90">SlashMarket</p>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">{title}</h1>
        <p className="font-urbanist max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">{subtitle}</p>
      </div>
    </header>
  );
}
