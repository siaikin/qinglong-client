import type { ClientConnectionConfig } from './types';

const STORAGE_KEY = 'qinglong-client-test-config';
export const PROXY_TARGET_COOKIE = 'ql-proxy-target';

const DEFAULT_CONFIG: ClientConnectionConfig = {
  baseUrl: 'http://localhost:5700',
  clientId: '',
  clientSecret: '',
};

export function syncProxyTargetCookie(baseUrl: string): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(baseUrl.trim().replace(/\/$/, ''));
  document.cookie = `${PROXY_TARGET_COOKIE}=${value}; path=/; SameSite=Lax`;
}

export function resolveEffectiveBaseUrl(config: ClientConnectionConfig): string {
  const trimmed = config.baseUrl.trim().replace(/\/$/, '');
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    syncProxyTargetCookie(trimmed);
    return `${window.location.origin}/qinglong-proxy`.replace(/\/$/, '');
  }
  return trimmed;
}

export function isDevProxyEnabled(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function loadConnectionConfig(): ClientConnectionConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<ClientConnectionConfig>;
    return {
      baseUrl: parsed.baseUrl ?? DEFAULT_CONFIG.baseUrl,
      clientId: parsed.clientId ?? DEFAULT_CONFIG.clientId,
      clientSecret: parsed.clientSecret ?? DEFAULT_CONFIG.clientSecret,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConnectionConfig(config: ClientConnectionConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  if (process.env.NODE_ENV === 'development') {
    syncProxyTargetCookie(config.baseUrl);
  }
}
