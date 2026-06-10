import { AuthToken, QinglongClientOptions } from './types';
import { buildUrl } from './http';

interface CachedToken {
  token: string;
  expiration: number;
}

export class TokenManager {
  private cached: CachedToken | null = null;
  private refreshPromise: Promise<string> | null = null;
  private readonly refreshBuffer: number;

  constructor(
    private readonly options: QinglongClientOptions,
    private readonly fetchFn: typeof fetch,
  ) {
    this.refreshBuffer = options.tokenRefreshBuffer ?? 300;
  }

  async getToken(): Promise<string> {
    const now = Math.round(Date.now() / 1000);
    if (this.cached && this.cached.expiration - this.refreshBuffer > now) {
      return this.cached.token;
    }

    if (!this.refreshPromise) {
      this.refreshPromise = this.fetchToken().finally(() => {
        this.refreshPromise = null;
      });
    }

    return this.refreshPromise;
  }

  private async fetchToken(): Promise<string> {
    const url = buildUrl(this.options.baseUrl, '/auth/token', {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
    });

    const response = await this.fetchFn(url);
    const json = (await response.json()) as {
      code: number;
      data?: AuthToken;
      message?: string;
    };

    if (json.code !== 200 || !json.data?.token) {
      throw new Error(json.message ?? 'Failed to obtain auth token');
    }

    this.cached = {
      token: json.data.token,
      expiration: json.data.expiration,
    };

    return this.cached.token;
  }
}
