export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold text-zinc-100">{title}</h1>
      <p className="text-sm text-zinc-400">{subtitle}</p>
    </header>
  );
}
