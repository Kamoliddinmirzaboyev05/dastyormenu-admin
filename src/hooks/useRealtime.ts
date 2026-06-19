import { useEffect, useRef } from 'react';
import { Order } from '../lib/types';

interface UseRealtimeOrdersOptions {
  onInsert?: (order: Order) => void;
  onUpdate?: (order: Order) => void;
  onDelete?: (id: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dastyorapi.webportfolio.uz';

function wsUrl(token: string): string {
  // https://host -> wss://host/ws/orders/?token=...   (http -> ws for local dev)
  const base = API_BASE_URL.replace(/^http/, 'ws').replace(/\/$/, '');
  return `${base}/ws/orders/?token=${encodeURIComponent(token)}`;
}

/**
 * Live kitchen feed over the backend Channels WebSocket (`ws/orders/`).
 * Falls back silently when there is no auth token. Auto-reconnects with
 * backoff and pings every 25s to keep the socket alive through proxies.
 */
export function useRealtimeOrders({ onInsert, onUpdate, onDelete }: UseRealtimeOrdersOptions) {
  // Keep latest callbacks without re-opening the socket on every render.
  const cbRef = useRef({ onInsert, onUpdate, onDelete });
  cbRef.current = { onInsert, onUpdate, onDelete };

  useEffect(() => {
    const token = localStorage.getItem('dastyor_token');
    if (!token) return;

    let ws: WebSocket | null = null;
    let pingTimer: ReturnType<typeof setInterval> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;
    let closedByUs = false;

    const connect = () => {
      ws = new WebSocket(wsUrl(token));

      ws.onopen = () => {
        attempts = 0;
        pingTimer = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        let data: Record<string, unknown>;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (data.type === 'pong') return;

        // Initial snapshot of active orders on connect -> just refresh.
        if (data.type === 'active_orders') {
          cbRef.current.onUpdate?.({} as Order);
          return;
        }

        if (data.type === 'order_update') {
          if (data.action === 'new_order') {
            const partial = {
              id: String(data.order_id ?? ''),
              status: data.status,
              total_amount: data.total_amount,
              table: data.table_number != null
                ? ({ table_number: data.table_number } as Order['table'])
                : undefined,
            } as Order;
            cbRef.current.onInsert?.(partial);
          } else {
            cbRef.current.onUpdate?.({ id: String(data.order_id ?? '') } as Order);
          }
        }
      };

      ws.onclose = () => {
        if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
        if (closedByUs) return;
        // Exponential backoff capped at 15s.
        const delay = Math.min(1000 * 2 ** attempts, 15000);
        attempts += 1;
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      closedByUs = true;
      if (pingTimer) clearInterval(pingTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  // onDelete is part of the public API but the backend has no delete event yet.
  void onDelete;
}
