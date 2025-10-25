import type { components, operations, paths } from "@/lib/api/types";

export type ApiResponse<T> = T extends { responses: infer R }
  ? R extends { 200: { content: { "application/json": infer U } } }
    ? U
    : R extends { 202: { content: { "application/json": infer V } } }
      ? V
      : R extends { 204: unknown }
        ? void
        : unknown
  : unknown;

export type ApiRequestBody<T> = T extends { requestBody: infer R }
  ? R extends { content: { "application/json": infer U } }
    ? U
    : never
  : never;

export type ApiQueryParams<TSpec> = TSpec extends { parameters: infer P }
  ? P extends { query: infer Q }
    ? Q
    : Record<string, never>
  : Record<string, never>;

export type ApiPathParams<TSpec> = TSpec extends { parameters: infer P }
  ? P extends { path: infer PathParams }
    ? PathParams
    : Record<string, never>
  : Record<string, never>;

export type EndpointOperation<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath][TMethod];

export type ProblemDetail = components["schemas"]["ProblemDetail"];
export type ValidationError = components["schemas"]["ValidationError"];

export type AuthLoginResponse = ApiResponse<operations["login"]>;
export type AuthLoginRequest = ApiRequestBody<operations["login"]>;
