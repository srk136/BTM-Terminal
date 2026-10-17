import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Re-runs a local adapter function; the brief spinner only mimics a refresh. No I/O happens.
export function useDemoRead<T>(read: () => T, deps: readonly unknown[]) {
  const [nonce, setNonce] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const readRef = useRef(read);
  readRef.current = read;
  const data = useMemo(() => readRef.current(), [nonce, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
  const refresh = useCallback(() => {
    setRefreshing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setNonce((n) => n + 1); setRefreshing(false); }, 350);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { data, refreshing, refresh };
}

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `BTM Terminal (Synthetic Demo) — ${title}`;
    return () => { document.title = prev; };
  }, [title]);
}
