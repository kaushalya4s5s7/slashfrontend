import { Mode } from "@/shared/types/contracts";

export function Badge({ mode }: { mode: Mode }) {
  const isDelegation = mode === "DELEGATION";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        isDelegation ? "bg-cyan-500/15 text-cyan-300" : "bg-purple-500/15 text-purple-300"
      }`}
    >
      {mode}
    </span>
  );
}
