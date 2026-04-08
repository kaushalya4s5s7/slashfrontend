"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  const style =
    variant === "primary"
      ? "bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
      : "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800";

  return (
    <button className={`${base} ${style} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? "Processing..." : children}
    </button>
  );
}
