import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";

type Props = {
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

export function CtaBanner({ title, body, primary, secondary }: Props) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="on-dark relative overflow-hidden rounded-3xl bg-midnight-900 px-6 py-14 text-white sm:px-14 sm:py-16">
          <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">{title}</h2>
              {body && <p className="mt-4 text-lg leading-relaxed text-slate-300">{body}</p>}
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={primary.href} size="lg">
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="ghost" size="lg">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
