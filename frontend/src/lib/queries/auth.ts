import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";

import type { ApiRequestBody, ApiResponse, EndpointOperation } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/client";

type LoginOperation = EndpointOperation<"/auth/login", "post">;
type CurrentUserOperation = EndpointOperation<"/auth/me", "get">;
type RegisterOperation = EndpointOperation<"/auth/register", "post">;
type LogoutOperation = EndpointOperation<"/auth/logout", "post">;

export type LoginRequest = ApiRequestBody<LoginOperation>;
export type LoginResponse = ApiResponse<LoginOperation>;
export type CurrentUserResponse = ApiResponse<CurrentUserOperation>;
export type RegisterRequest = ApiRequestBody<RegisterOperation>;
export type RegisterResponse = ApiResponse<RegisterOperation>;

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

export const useLoginMutation = () =>
  useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (variables) =>
      apiClient("/auth/login", { method: "post", body: variables }) as Promise<LoginResponse>,
  });

export const useRegisterMutation = () =>
  useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: (variables) =>
      apiClient("/auth/register", { method: "post", body: variables }) as Promise<RegisterResponse>,
  });

export const fetchCurrentUser = async () =>
  apiClient("/auth/me", { method: "get" }) as Promise<CurrentUserResponse>;

export const useCurrentUserQuery = (options?: UseQueryOptions<CurrentUserResponse, unknown>) =>
  useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: fetchCurrentUser,
    ...options,
  });

export const useLogoutMutation = () =>
  useMutation<void, unknown, void>({
    mutationFn: () => apiClient("/auth/logout", { method: "post" }) as Promise<void>,
  });
