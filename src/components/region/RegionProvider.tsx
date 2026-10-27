"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { regions, type Region, type RegionId } from "@/content/pricing";

type Source = "default" | "detected" | "manual";

type RegionContextValue = {
  region: Region;
  /** ISO country code reported by the host, when available. */
  country: string | null;
  source: Source;
  setRegion: (id: RegionId) => void;
};

const STORAGE_KEY = "praxera.region";
const RegionContext = createContext<RegionContextValue | null>(null);

function readStored(): RegionId | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && v in regions ? (v as RegionId) : null;
  } catch {
    return null;
  }
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = useState<RegionId>("INTL");
  const [country, setCountry] = useState<string | null>(null);
  const [source, setSource] = useState<Source>("default");

  useEffect(() => {
    const stored = readStored();
    let cancelled = false;

    // Country comes from the hosting platform's edge header — no third-party lookup.
    fetch("/api/region", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { country: string | null; region: RegionId } | null) => {
        if (cancelled || !data) return;
        setCountry(data.country);
        if (!stored && data.country) {
          setRegionId(data.region);
          setSource("detected");
        }
      })
      .catch(() => {});

    if (stored) {
      // Restoring a saved preference after hydration; there is no external store to sync from.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegionId(stored);
      setSource("manual");
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const setRegion = useCallback((id: RegionId) => {
    setRegionId(id);
    setSource("manual");
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Storage unavailable (private mode) — the choice still applies for this visit.
    }
  }, []);

  const value = useMemo(
    () => ({ region: regions[regionId], country, source, setRegion }),
    [regionId, country, source, setRegion],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used inside RegionProvider");
  return ctx;
}
