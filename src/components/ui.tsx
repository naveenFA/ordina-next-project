export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-indigo-600">
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50/60 to-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {eyebrow ? (
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        {title ? (
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-lg text-zinc-600">{description}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700"
      : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50";

  return (
    <a
      href={href}
      className={`inline-flex rounded-full px-5 py-2.5 text-sm font-medium transition ${styles}`}
    >
      {children}
    </a>
  );
}
