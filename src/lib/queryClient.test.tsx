import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { ApiResponse } from './apiTypes';
import { queryClient } from './queryClient';
import { useQuery, useMutation } from '../hooks/useQuery';

const ok = <T,>(data: T): ApiResponse<T> => ({ success: true, data });
const fail = (message: string): ApiResponse<never> => ({ success: false, error: { message } });

beforeEach(() => {
  queryClient.clear();
});

describe('useQuery', () => {
  it('resolves data from the fetcher and clears loading', async () => {
    const { result } = renderHook(() =>
      useQuery({ key: 'menu', fetcher: () => Promise.resolve(ok(['Plov'])) }),
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(['Plov']);
    expect(result.current.error).toBeNull();
  });

  it('surfaces an error when the response is unsuccessful', async () => {
    const { result } = renderHook(() =>
      useQuery({ key: 'menu', fetcher: () => Promise.resolve(fail('boom')) }),
    );

    await waitFor(() => expect(result.current.error).toBe('boom'));
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('de-duplicates concurrent fetches for the same key', async () => {
    const fetcher = vi.fn(() => Promise.resolve(ok('x')));

    renderHook(() => useQuery({ key: 'shared', fetcher }));
    renderHook(() => useQuery({ key: 'shared', fetcher }));

    await waitFor(() => expect(fetcher).toHaveBeenCalled());
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('does not fetch while disabled', async () => {
    const fetcher = vi.fn(() => Promise.resolve(ok('x')));
    const { result } = renderHook(() => useQuery({ key: 'gated', fetcher, enabled: false }));

    await act(async () => {
      await Promise.resolve();
    });
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('refetch forces a new fetch and updates data', async () => {
    let n = 0;
    const fetcher = () => Promise.resolve(ok(++n));
    const { result } = renderHook(() => useQuery({ key: 'counter', fetcher }));

    await waitFor(() => expect(result.current.data).toBe(1));
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.data).toBe(2);
  });
});

describe('useMutation + invalidation', () => {
  it('invalidates a key so a mounted query refetches with fresh data', async () => {
    let value = 'old';
    const query = renderHook(() => useQuery({ key: 'item', fetcher: () => Promise.resolve(ok(value)) }));
    await waitFor(() => expect(query.result.current.data).toBe('old'));

    const mutation = renderHook(() =>
      useMutation(
        async () => {
          value = 'new';
          return ok(true);
        },
        { invalidates: ['item'] },
      ),
    );

    await act(async () => {
      await mutation.result.current.mutate(undefined);
    });

    await waitFor(() => expect(query.result.current.data).toBe('new'));
  });

  it('reports mutation errors without invalidating', async () => {
    const { result } = renderHook(() =>
      useMutation(async () => fail('nope'), { invalidates: ['item'] }),
    );

    await act(async () => {
      const res = await result.current.mutate(undefined);
      expect(res.success).toBe(false);
    });
    expect(result.current.error).toBe('nope');
  });
});
