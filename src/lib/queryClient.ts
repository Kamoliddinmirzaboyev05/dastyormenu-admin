// ─── Query Client ───────────────────────────────────────────────────────────
//
// One deep module behind the page hooks. Before, every hook re-implemented the
// same shallow plumbing: a loading flag, an error string, a try/catch, a manual
// refetch, and no protection against two components firing the same request or a
// realtime event racing an in-flight fetch.
//
// This client states that plumbing once. Callers cross a small interface —
// `subscribe`, `fetch`, `invalidate` (and the `useQuery`/`useMutation` hooks
// built on top) — and the implementation owns caching, in-flight de-duplication,
// and invalidation-driven refetch. Keys are plain strings; a mutation invalidates
// keys and every mounted query on those keys refetches from one place.
//
// Fetchers return the app's `ApiResponse<T>` envelope (never throw for HTTP
// errors); the client unwraps `success`/`error` into the snapshot.

import { ApiResponse } from './apiTypes';

export type Fetcher<T> = () => Promise<ApiResponse<T>>;

export interface QuerySnapshot<T> {
  data: T | undefined;
  error: string | null;
  loading: boolean;
}

type Listener = () => void;

interface Entry<T> {
  snapshot: QuerySnapshot<T>;
  listeners: Set<Listener>;
  inFlight: Promise<void> | null;
  lastFetcher: Fetcher<T> | null;
}

const FALLBACK_ERROR = 'Xatolik yuz berdi';

class QueryClient {
  private cache = new Map<string, Entry<unknown>>();

  private getEntry<T>(key: string): Entry<T> {
    let entry = this.cache.get(key) as Entry<T> | undefined;
    if (!entry) {
      entry = {
        snapshot: { data: undefined, error: null, loading: false },
        listeners: new Set(),
        inFlight: null,
        lastFetcher: null,
      };
      this.cache.set(key, entry as Entry<unknown>);
    }
    return entry;
  }

  /** Commit a new snapshot (new object reference) and notify subscribers. */
  private commit<T>(entry: Entry<T>, patch: Partial<QuerySnapshot<T>>): void {
    entry.snapshot = { ...entry.snapshot, ...patch };
    entry.listeners.forEach((l) => l());
  }

  /** Current snapshot for a key — stable reference between commits (for useSyncExternalStore). */
  getSnapshot<T>(key: string): QuerySnapshot<T> {
    return this.getEntry<T>(key).snapshot;
  }

  subscribe(key: string, listener: Listener): () => void {
    const entry = this.getEntry(key);
    entry.listeners.add(listener);
    return () => {
      entry.listeners.delete(listener);
    };
  }

  /**
   * Run `fetcher` for `key`, unless an identical request is already in flight
   * (de-duplicated) or fresh data is cached and `force` is not set.
   */
  fetch<T>(key: string, fetcher: Fetcher<T>, opts: { force?: boolean } = {}): Promise<void> {
    const entry = this.getEntry<T>(key);
    entry.lastFetcher = fetcher;

    if (entry.inFlight && !opts.force) return entry.inFlight;
    if (entry.snapshot.data !== undefined && !opts.force) return Promise.resolve();

    this.commit(entry, { loading: true, error: null });

    const run = (async () => {
      try {
        const res = await fetcher();
        if (res.success) {
          this.commit(entry, { data: res.data, error: null, loading: false });
        } else {
          this.commit(entry, { error: res.error?.message ?? FALLBACK_ERROR, loading: false });
        }
      } catch (e) {
        this.commit(entry, { error: e instanceof Error ? e.message : FALLBACK_ERROR, loading: false });
      } finally {
        entry.inFlight = null;
      }
    })();

    entry.inFlight = run;
    return run;
  }

  /**
   * Drop cached data for matching keys and refetch any that are mounted
   * (have listeners) using their last fetcher. `match` is an exact key or a
   * predicate over keys.
   */
  invalidate(match: string | ((key: string) => boolean)): void {
    const predicate = typeof match === 'string' ? (k: string) => k === match : match;
    for (const [key, entry] of this.cache) {
      if (!predicate(key)) continue;
      entry.snapshot = { ...entry.snapshot, data: undefined };
      if (entry.listeners.size > 0 && entry.lastFetcher) {
        this.fetch(key, entry.lastFetcher, { force: true });
      } else {
        entry.listeners.forEach((l) => l());
      }
    }
  }

  /** Test/teardown helper: forget everything. */
  clear(): void {
    this.cache.clear();
  }
}

export const queryClient = new QueryClient();
