import Image from "next/image";
import { callList, leadKaro } from "@/content/caseStudies";

const { search, sheet, excel, postcodes, fileName } = callList.screenshots;

const columns = [
  { shots: [search, excel, postcodes], speed: "marquee-y-slow", hideOnMobile: false },
  { shots: [sheet, fileName, search], speed: "marquee-y-reverse", hideOnMobile: false },
  { shots: [excel, postcodes, sheet], speed: "marquee-y-fast", hideOnMobile: true },
  { shots: [fileName, sheet, excel], speed: "marquee-y-reverse-slow", hideOnMobile: true },
];

function Cards({ shots }: { shots: (typeof columns)[number]["shots"] }) {
  return (
    <>
      {shots.map((shot) => (
        <div key={shot.src} className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-lift">
          <Image src={shot.src} width={shot.width} height={shot.height} alt="" sizes="(min-width: 1024px) 26vw, 50vw" loading="eager" className="h-auto w-full" />
        </div>
      ))}
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-accent-strong/60 to-midnight-800 p-6">
        <p className="eyebrow text-accent">{leadKaro.tag}</p>
        <p className="mt-3 font-display text-2xl font-bold text-white">{leadKaro.name}</p>
      </div>
    </>
  );
}

/** Real project screenshots drifting behind the page. Decorative, so hidden from assistive technology. */
export function WorkBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -inset-x-[15%] -inset-y-1/4 grid -rotate-6 grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {columns.map(({ shots, speed, hideOnMobile }) => (
          <div key={speed} className={hideOnMobile ? "hidden lg:block" : undefined}>
            <div className={`marquee-y flex flex-col ${speed}`}>
              <div className="flex flex-col gap-4 pb-4 lg:gap-6 lg:pb-6">
                <Cards shots={shots} />
              </div>
              <div className="flex flex-col gap-4 pb-4 lg:gap-6 lg:pb-6">
                <Cards shots={shots} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-midnight-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-950/70 via-midnight-950/20 to-midnight-950/60" />
      <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-3xl" />
    </div>
  );
}
