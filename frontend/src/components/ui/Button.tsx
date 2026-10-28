import { ButtonHTMLAttributes, forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

import { cx } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--accent-hover)]",
  secondary:
    "border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--background-tertiary)]",
  ghost:
    "text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
  danger:
    "bg-[var(--danger)] text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex shrink-0 items-center justify-center font-medium",
        "transition-[background-color,border-color,color,transform,filter] duration-150",
        "active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <LoaderCircle size={size === "sm" ? 13 : 15} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

export default Button;
