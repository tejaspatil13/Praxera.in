"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Mail, FileSpreadsheet, Inbox, Database, Sparkles, ShieldCheck, GitMerge, FileOutput, Users, BellRing } from "lucide-react";

/**
 * Illustrative diagram of a business workflow: information from everyday tools
 * passes through validation, matching and AI processing, and leaves as a useful output.
 * It depicts the kind of system Praxera builds; it is not a product screenshot.
 */

const sources = [
  { label: "Email inbox", icon: Mail },
  { label: "Web forms", icon: Inbox },
  { label: "Spreadsheets", icon: FileSpreadsheet },
  { label: "CRM / API", icon: Database },
];

const stages = [
  { label: "Validate", detail: "Clean and check inputs", icon: ShieldCheck },
  { label: "Match & enrich", detail: "Join records across tools", icon: GitMerge },
  { label: "AI extract & classify", detail: "Human review built in", icon: Sparkles },
];

const outputs = [
  { label: "Excel report", icon: FileOutput },
  { label: "CRM updated", icon: Users },
  { label: "Team notified", icon: BellRing },
];

// Desktop geometry (SVG user units)
const W = 600;
const H = 420;
const srcY = [52, 142, 232, 322];
const outY = [102, 192, 282];
const SRC_X2 = 170;
const CORE_X1 = 214;
const CORE_X2 = 386;
const OUT_X1 = 430;
const CORE_MID = H / 2;

const inPaths = srcY.map((y) => {
  const y0 = y + 23;
  return `M${SRC_X2},${y0} C${SRC_X2 + 30},${y0} ${CORE_X1 - 30},${CORE_MID} ${CORE_X1},${CORE_MID}`;
});
const outPaths = outY.map((y) => {
  const y1 = y + 23;
  return `M${CORE_X2},${CORE_MID} C${CORE_X2 + 30},${CORE_MID} ${OUT_X1 - 30},${y1} ${OUT_X1},${y1}`;
});

function useActiveStage(reduce: boolean | null) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % stages.length), 1600);
    return () => clearInterval(t);
  }, [reduce]);
  return reduce ? -1 : active;
}

function Node({ x, y, w, label, Icon, delay }: { x: number; y: number; w: number; label: string; Icon: typeof Mail; delay: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <rect x={x} y={y} width={w} height={46} rx={11} fill="#101e3a" stroke="rgb(255 255 255 / 0.1)" />
      <foreignObject x={x + 12} y={y + 13} width={20} height={20}>
        <Icon className="h-5 w-5 text-slate-300" aria-hidden />
      </foreignObject>
      <text x={x + 40} y={y + 28} fill="#e6ebf3" fontSize="13" fontWeight={500}>
        {label}
      </text>
    </motion.g>
  );
}

function DesktopDiagram({ reduce, active }: { reduce: boolean | null; active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="hero-diagram-title">
      <title id="hero-diagram-title">
        Diagram: data from email, web forms, spreadsheets and CRMs is validated, matched and processed with AI, then delivered as an Excel report, a CRM update and a team notification.
      </title>

      {/* connectors */}
      {[...inPaths, ...outPaths].map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth={1.5} />
          <motion.path
            d={d}
            fill="none"
            stroke="#2dd4bf"
            strokeOpacity={0.55}
            strokeWidth={1.5}
            className={reduce ? undefined : "flow-line"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 + i * 0.06, ease: "easeOut" }}
          />
          {!reduce && (
            <circle r={3.2} fill="#2dd4bf">
              <animateMotion dur={`${2.6 + (i % 3) * 0.4}s`} begin={`${1.2 + i * 0.35}s`} repeatCount="indefinite" path={d} />
            </circle>
          )}
        </g>
      ))}

      {sources.map((s, i) => (
        <Node key={s.label} x={18} y={srcY[i]} w={SRC_X2 - 18} label={s.label} Icon={s.icon} delay={0.2 + i * 0.07} />
      ))}
      {outputs.map((o, i) => (
        <Node key={o.label} x={OUT_X1} y={outY[i]} w={W - 18 - OUT_X1} label={o.label} Icon={o.icon} delay={0.9 + i * 0.08} />
      ))}

      {/* core */}
      <motion.g initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} style={{ transformOrigin: "300px 210px" }}>
        {!reduce && (
          <rect x={CORE_X1} y={80} width={CORE_X2 - CORE_X1} height={260} rx={18} fill="none" stroke="#2dd4bf" strokeOpacity={0.35} className="pulse-ring" />
        )}
        <rect x={CORE_X1} y={80} width={CORE_X2 - CORE_X1} height={260} rx={18} fill="#0d1a33" stroke="rgb(45 212 191 / 0.45)" />
        <text x={300} y={108} textAnchor="middle" fill="#2dd4bf" fontSize="10" letterSpacing="2" fontFamily="var(--font-mono)">
          YOUR WORKFLOW
        </text>
        {stages.map((st, i) => {
          const y = 124 + i * 70;
          const on = active === i;
          return (
            <g key={st.label}>
              <rect
                x={CORE_X1 + 12}
                y={y}
                width={CORE_X2 - CORE_X1 - 24}
                height={58}
                rx={10}
                fill={on ? "rgb(45 212 191 / 0.12)" : "rgb(255 255 255 / 0.03)"}
                stroke={on ? "rgb(45 212 191 / 0.6)" : "rgb(255 255 255 / 0.08)"}
                style={{ transition: "fill 400ms, stroke 400ms" }}
              />
              <foreignObject x={CORE_X1 + 22} y={y + 10} width={18} height={18}>
                <st.icon className={`h-[18px] w-[18px] ${on ? "text-accent" : "text-slate-400"}`} aria-hidden />
              </foreignObject>
              <text x={CORE_X1 + 46} y={y + 24} fill="#ffffff" fontSize="12.5" fontWeight={600}>
                {st.label}
              </text>
              <text x={CORE_X1 + 22} y={y + 45} fill="#8d9bb0" fontSize="10.5">
                {st.detail}
              </text>
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}

function Connector({ reduce }: { reduce: boolean | null }) {
  return (
    <div aria-hidden className="flex justify-center py-1">
      <svg width="2" height="28" className="overflow-visible">
        <line x1="1" y1="0" x2="1" y2="28" stroke="#2dd4bf" strokeOpacity="0.6" strokeWidth="1.5" className={reduce ? undefined : "flow-line"} />
      </svg>
    </div>
  );
}

function MobileDiagram({ reduce, active }: { reduce: boolean | null; active: number }) {
  return (
    <div role="img" aria-label="Data from email, web forms, spreadsheets and CRMs is validated, matched and processed with AI, then delivered as an Excel report, a CRM update and a team notification.">
      <div aria-hidden className="grid grid-cols-2 gap-2">
        {sources.map((s) => (
          <div key={s.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-midnight-800 px-3 py-2.5 text-[13px] text-slate-200">
            <s.icon className="h-4 w-4 shrink-0 text-slate-400" /> {s.label}
          </div>
        ))}
      </div>
      <Connector reduce={reduce} />
      <div aria-hidden className="rounded-2xl border border-accent/40 bg-[#0d1a33] p-3">
        <p className="eyebrow mb-2 text-center text-[10px] text-accent">Your workflow</p>
        <div className="space-y-2">
          {stages.map((st, i) => (
            <div
              key={st.label}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[13px] font-semibold text-white transition-colors duration-500 ${
                active === i ? "border-accent/60 bg-accent/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <st.icon className={`h-4 w-4 ${active === i ? "text-accent" : "text-slate-400"}`} />
              {st.label}
            </div>
          ))}
        </div>
      </div>
      <Connector reduce={reduce} />
      <div aria-hidden className="grid grid-cols-3 gap-2">
        {outputs.map((o) => (
          <div key={o.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-midnight-800 px-2 py-2.5 text-center text-[12px] text-slate-200">
            <o.icon className="h-4 w-4 text-accent" /> {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroWorkflow() {
  const reduce = useReducedMotion();
  const active = useActiveStage(reduce);
  return (
    <figure className="relative">
      <div className="hidden sm:block">
        <DesktopDiagram reduce={reduce} active={active} />
      </div>
      <div className="sm:hidden">
        <MobileDiagram reduce={reduce} active={active} />
      </div>
      <figcaption className="mt-4 text-center text-xs text-slate-400">
        Illustration of a typical automated workflow
      </figcaption>
    </figure>
  );
}
