// ─── PWA Update Handler ──────────────────────────────────────────────────────

import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWAUpdate() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('✅ Service Worker registered:', r);
      
      // Check for updates every hour
      if (r) {
        setInterval(() => {
          console.log('🔄 Checking for updates...');
          r.update();
        }, 60 * 60 * 1000); // 1 hour
      }
    },
    onRegisterError(error) {
      console.error('❌ Service Worker registration error:', error);
    },
    immediate: true,
  });

  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const updateApp = () => {
    updateServiceWorker(true);
  };

  return {
    offlineReady,
    needRefresh,
    closePrompt,
    updateApp,
  };
}
