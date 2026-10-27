import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="on-dark relative overflow-hidden bg-midnight-900 py-28 text-white sm:py-36">
      <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
      <div className="container-page relative max-w-2xl text-center">
        <p className="eyebrow text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">This page does not exist.</h1>
        <p className="mt-5 text-lg text-slate-300">The link may be out of date. These are good places to continue:</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/services" variant="ghost">
            Services
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
