import { QinglongApiError, QinglongResponse, RequestOptions } from './types';

export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

export function buildUrl(
  baseUrl: string,
  path: string,
  query?: RequestOptions['query'],
): string {
  const url = new URL(`${normalizeBaseUrl(baseUrl)}/open${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function request<T>(
  fetchFn: typeof fetch,
  baseUrl: string,
  options: RequestOptions,
  getToken?: () => Promise<string>,
): Promise<T> {
  const { method = 'GET', path, query, body, auth = true, headers = {} } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
  };

  if (auth && getToken) {
    reqHeaders['Authorization'] = `Bearer ${await getToken()}`;
  }

  const response = await fetchFn(buildUrl(baseUrl, path, query), {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: QinglongResponse<T>;
  try {
    json = (await response.json()) as QinglongResponse<T>;
  } catch {
    throw new QinglongApiError({
      code: response.status,
      message: `HTTP ${response.status}: ${response.statusText}`,
    });
  }

  if (json.code !== 200) {
    throw new QinglongApiError(json);
  }

  return json.data as T;
}

async function buildHeaders(
  auth: boolean,
  getToken: (() => Promise<string>) | undefined,
  extra: Record<string, string>,
  contentType?: string,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { ...extra };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (auth && getToken) {
    headers['Authorization'] = `Bearer ${await getToken()}`;
  }
  return headers;
}

/** 下载二进制响应（如下载脚本/日志文件） */
export async function requestBlob(
  fetchFn: typeof fetch,
  baseUrl: string,
  options: RequestOptions,
  getToken?: () => Promise<string>,
): Promise<Blob> {
  const { method = 'GET', path, query, body, auth = true, headers = {} } = options;
  const reqHeaders = await buildHeaders(auth, getToken, headers);

  const response = await fetchFn(buildUrl(baseUrl, path, query), {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new QinglongApiError({
      code: response.status,
      message: `HTTP ${response.status}: ${response.statusText}`,
    });
  }

  return response.blob();
}

/** 获取流式文本响应（如 command-run、system/log） */
export async function requestText(
  fetchFn: typeof fetch,
  baseUrl: string,
  options: RequestOptions,
  getToken?: () => Promise<string>,
): Promise<string> {
  const { method = 'GET', path, query, body, auth = true, headers = {} } = options;
  const reqHeaders = await buildHeaders(auth, getToken, headers);

  const response = await fetchFn(buildUrl(baseUrl, path, query), {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new QinglongApiError({
      code: response.status,
      message: `HTTP ${response.status}: ${response.statusText}`,
    });
  }

  return response.text();
}

/** Multipart 表单上传 */
export async function requestMultipart<T>(
  fetchFn: typeof fetch,
  baseUrl: string,
  options: Omit<RequestOptions, 'body'> & { formData: FormData },
  getToken?: () => Promise<string>,
): Promise<T> {
  const { method = 'POST', path, query, formData, auth = true } = options;
  const reqHeaders = await buildHeaders(auth, getToken, {});

  const response = await fetchFn(buildUrl(baseUrl, path, query), {
    method,
    headers: reqHeaders,
    body: formData,
  });

  const json = (await response.json()) as QinglongResponse<T>;
  if (json.code !== 200) {
    throw new QinglongApiError(json);
  }
  return json.data as T;
}
