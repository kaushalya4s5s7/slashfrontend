type Tab = { value: string; label: string };

export function Tabs({
  value,
  onChange,
  tabs,
}: {
  value: string;
  onChange: (next: string) => void;
  tabs: Tab[];
}) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-1">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              active ? "bg-cyan-500 text-zinc-950" : "text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
