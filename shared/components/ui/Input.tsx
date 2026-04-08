type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  suffix?: string;
};

export function Input({ label, suffix, className = "", ...props }: InputProps) {
  return (
    <label className="block w-full">
      {label ? <span className="mb-1 block text-xs text-zinc-400">{label}</span> : null}
      <div className="relative">
        <input
          className={`w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-white-500/20 transition placeholder:text-zinc-500 focus:ring-2 ${className}`}
          {...props}
        />
        {suffix ? <span className="pointer-events-none absolute right-3 top-2 text-xs text-zinc-400">{suffix}</span> : null}
      </div>
    </label>
  );
}
