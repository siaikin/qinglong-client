'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  isDevProxyEnabled,
  loadConnectionConfig,
  saveConnectionConfig,
  syncProxyTargetCookie,
} from '@/lib/client-test/storage';
import type { ClientConnectionConfig } from '@/lib/client-test/types';

export function useConnectionConfig() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<ClientConnectionConfig>({
    baseUrl: 'http://localhost:5700',
    clientId: '',
    clientSecret: '',
  });

  useEffect(() => {
    const loaded = loadConnectionConfig();
    setConfig(loaded);
    if (isDevProxyEnabled()) {
      syncProxyTargetCookie(loaded.baseUrl);
    }
    setMounted(true);
  }, []);

  const updateConfig = useCallback((patch: Partial<ClientConnectionConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveConnectionConfig(next);
      return next;
    });
  }, []);

  return { mounted, config, updateConfig };
}
