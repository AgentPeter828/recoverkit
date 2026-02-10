import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl border ${className}`}
        style={{
          background: "var(--color-bg)",
          borderColor: "var(--color-border)",
          ...style,
        }}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
