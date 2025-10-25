import type {
  ApiPathParams,
  ApiQueryParams,
  ApiRequestBody,
  ApiResponse,
  EndpointOperation,
} from "@/lib/api/endpoints";
import type { paths } from "@/lib/api/types";

const defaultBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

type RequestOptions<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = Omit<
  RequestInit,
  "method" | "body"
> & {
  method: TMethod;
  headers?: Record<string, string>;
  pathParams?: Partial<ApiPathParams<EndpointOperation<TPath, TMethod>>>;
  query?: Partial<ApiQueryParams<EndpointOperation<TPath, TMethod>>>;
  body?: ApiRequestBody<EndpointOperation<TPath, TMethod>>;
};

export type ApiFetcher = <TPath extends keyof paths, TMethod extends keyof paths[TPath]>(
  path: TPath,
  options: RequestOptions<TPath, TMethod>,
) => Promise<ApiResponse<EndpointOperation<TPath, TMethod>>>;

/**
 * createFetchClient wraps fetch with JSON handling and base URL management.
 */
export const createFetchClient = (config?: { baseUrl?: string }): ApiFetcher => {
  const baseUrl = config?.baseUrl ?? defaultBaseUrl;

  return async (path, options) => {
    const { pathParams, query, body, headers, ...rest } = options;
    let resolvedPath = String(path);

    if (pathParams) {
      Object.entries(pathParams).forEach(([key, value]) => {
        if (value === undefined) return;
        resolvedPath = resolvedPath.replace(`{${key}}`, encodeURIComponent(String(value)));
      });
    }

    const url = new URL(`${baseUrl}${resolvedPath}`);

    if (query) {
      Object.entries(query)
        .filter(([, value]) => value !== undefined && value !== null)
        .forEach(([key, value]) => url.searchParams.append(key, String(value)));
    }

    const requestInit: RequestInit = {
      ...rest,
      credentials: rest.credentials ?? "include",
      method: String(options.method).toUpperCase(),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined && options.method !== "get" ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, requestInit);

    if (!response.ok) {
      const errorBody = await safeParseJson(response);
      throw new ApiError(response.status, errorBody);
    }

    if (response.status === 204) {
      return undefined as ApiResponse<EndpointOperation<TPath, TMethod>>;
    }

    const data = await safeParseJson(response);
    return data as ApiResponse<EndpointOperation<TPath, TMethod>>;
  };
};

const safeParseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new ApiError(response.status, `Invalid JSON response: ${text}`, {
      cause: error,
    });
  }
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly payload: unknown;

  constructor(status: number, payload: unknown, options?: ErrorOptions) {
    super(`API request failed with status ${status}`, options);
    this.status = status;
    this.payload = payload;
  }
}

export const apiClient = createFetchClient();
