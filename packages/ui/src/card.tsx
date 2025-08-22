import { type JSX } from "react";

interface CardProps {
  className?: string;
  title?: string;
  children: React.ReactNode;
  href?: string;
  variant?: "default" | "feature";
}

export function Card({
  className = "",
  title,
  children,
  href,
  variant = "default",
}: CardProps): JSX.Element {
  const baseClasses = "block rounded-lg transition-all duration-300";
  
  const variantClasses = {
    default: "bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-500/40 p-6",
    feature: "bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-500/40 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 p-6"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {title && (
          <h2 className="text-cyan-400 text-xl font-semibold mb-2">
            {title} <span>-&gt;</span>
          </h2>
        )}
        <div className="text-gray-300">{children}</div>
      </a>
    );
  }

  return (
    <div className={classes}>
      {title && (
        <h2 className="text-cyan-400 text-xl font-semibold mb-2">{title}</h2>
      )}
      <div className="text-gray-300">{children}</div>
    </div>
  );
}
