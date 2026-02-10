import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 placeholder:text-[var(--color-text-tertiary)] ${className}`}
        style={{
          background: "var(--color-bg)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
          // Focus ring color
          "--tw-ring-color": "var(--color-brand)",
          ...style,
        } as React.CSSProperties}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
