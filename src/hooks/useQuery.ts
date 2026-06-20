// ─── useQuery / useMutation ─────────────────────────────────────────────────
//
// React bindings over the shared `queryClient`. These replace the per-page
// fetch hooks (each with its own loading/error/refetch). A query subscribes to a
// key; a mutation runs a write and invalidates keys so mounted queries refetch.

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { ApiResponse } from '../lib/apiTypes';
import { Fetcher, queryClient } from '../lib/queryClient';

export interface UseQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Subscribe to `key` and fetch via `fetcher`. De-duplicated and cached across
 * every component using the same key. `enabled: false` defers fetching (e.g.
 * until the organization is loaded).
 */
export function useQuery<T>(opts: {
  key: string;
  fetcher: Fetcher<T>;
  enabled?: boolean;
}): UseQueryResult<T> {
  const { key, fetcher, enabled = true } = opts;

  const snapshot = useSyncExternalStore(
    (cb) => queryClient.subscribe(key, cb),
    () => queryClient.getSnapshot<T>(key),
    () => queryClient.getSnapshot<T>(key),
  );

  useEffect(() => {
    if (enabled) queryClient.fetch(key, fetcher);
    // fetcher identity is intentionally not a dependency — the key owns identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const refetch = useCallback(
    () => queryClient.fetch(key, fetcher, { force: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  // Treat "enabled, nothing yet" as loading so consumers don't flash empty.
  const pending = enabled && snapshot.data === undefined && snapshot.error === null;

  return {
    data: snapshot.data,
    loading: snapshot.loading || pending,
    error: snapshot.error,
    refetch,
  };
}

export interface UseMutationResult<TVars, TData> {
  mutate: (vars: TVars) => Promise<ApiResponse<TData>>;
  loading: boolean;
  error: string | null;
}

/**
 * Run a write, then invalidate keys so dependent queries refetch from one place.
 * `invalidates` may be exact keys or predicates over keys.
 */
export function useMutation<TVars, TData>(
  fn: (vars: TVars) => Promise<ApiResponse<TData>>,
  opts: {
    invalidates?: Array<string | ((key: string) => boolean)>;
    onSuccess?: (data: TData | undefined, vars: TVars) => void;
  } = {},
): UseMutationResult<TVars, TData> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (vars: TVars): Promise<ApiResponse<TData>> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fn(vars);
        if (res.success) {
          (opts.invalidates ?? []).forEach((m) => queryClient.invalidate(m));
          opts.onSuccess?.(res.data, vars);
        } else {
          setError(res.error?.message ?? 'Xatolik yuz berdi');
        }
        return res;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Xatolik yuz berdi');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    // fn/opts captured per render; mutate identity is recreated only as needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { mutate, loading, error };
}
