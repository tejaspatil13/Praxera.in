"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Alternative = { transcript: string };
type ResultList = ArrayLike<ArrayLike<Alternative>>;

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type RecognitionClass = new () => Recognition;

function recognitionClass() {
  const w = window as unknown as { SpeechRecognition?: RecognitionClass; webkitSpeechRecognition?: RecognitionClass };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const subscribe = () => () => {};
const join = (a: string, b: string) => [a.trim(), b.trim()].filter(Boolean).join(" ");

/** Android Chrome repeats earlier words in each result, so a result that restates the text replaces it. */
function transcript(results: ResultList) {
  let text = "";
  for (let i = 0; i < results.length; i++) {
    const part = results[i][0].transcript;
    text = part.trim().startsWith(text.trim()) ? part : text + part;
  }
  return text;
}

/**
 * Voice typing with the browser's own speech recognition, so it needs no API key.
 * Each session ends on a pause, so it restarts until the person stops or stays silent.
 */
export function useVoice(lang: string) {
  const supported = useSyncExternalStore(subscribe, () => !!recognitionClass(), () => false);
  const [active, setActive] = useState<string | null>(null);
  const [error, setError] = useState("");
  const current = useRef<Recognition | null>(null);
  const keepGoing = useRef(false);

  const stop = useCallback(() => {
    keepGoing.current = false;
    current.current?.stop();
    setActive(null);
  }, []);

  useEffect(
    () => () => {
      keepGoing.current = false;
      current.current?.abort();
    },
    [],
  );

  const start = useCallback(
    (field: string, value: string, write: (text: string) => void) => {
      const Recognition = recognitionClass();
      if (!Recognition) return;
      current.current?.abort();
      setError("");
      setActive(field);
      keepGoing.current = true;
      let base = value;

      const session = () => {
        const rec = new Recognition();
        let heard = "";
        rec.lang = lang;
        rec.continuous = false;
        rec.interimResults = true;
        rec.onresult = (e) => {
          heard = transcript(e.results);
          write(join(base, heard));
        };
        rec.onerror = (e) => {
          keepGoing.current = false;
          if (e.error === "not-allowed" || e.error === "service-not-allowed") {
            setError("Please allow microphone access in your browser, then tap the mic again.");
          } else if (e.error !== "no-speech" && e.error !== "aborted") {
            setError("Voice typing stopped. Please tap the mic to try again, or type your answer.");
          }
        };
        rec.onend = () => {
          if (current.current !== rec) return;
          base = join(base, heard);
          if (keepGoing.current) session();
          else setActive(null);
        };
        current.current = rec;
        try {
          rec.start();
        } catch {
          keepGoing.current = false;
          setActive(null);
        }
      };
      session();
    },
    [lang],
  );

  return { supported, active, error, start, stop };
}
