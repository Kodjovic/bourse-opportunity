import Link from "next/link";

export interface BreadcrumbStep {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  steps: BreadcrumbStep[];
}

export function Breadcrumb({ steps }: BreadcrumbProps) {
  return (
    <nav className="text-xs text-zinc-400 flex flex-wrap gap-1.5 items-center mb-6" aria-label="Fil d'Ariane">
      <Link href="/" className="hover:text-emerald-500 transition-colors">
        Accueil
      </Link>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div key={`${step.label}-${idx}`} className="flex items-center gap-1.5">
            <span className="text-zinc-300">/</span>
            {step.href && !isLast ? (
              <Link href={step.href} className="hover:text-emerald-500 transition-colors">
                {step.label}
              </Link>
            ) : (
              <span className="text-zinc-600 font-medium truncate max-w-[180px] sm:max-w-[300px]">
                {step.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
