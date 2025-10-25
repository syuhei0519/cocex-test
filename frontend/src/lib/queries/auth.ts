import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";

import type {
  ApiRequestBody,
  ApiResponse,
  EndpointOperation,
} from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/client";

type LoginOperation = EndpointOperation<"/auth/login", "post">;
type CurrentUserOperation = EndpointOperation<"/auth/me", "get">;

export type LoginRequest = ApiRequestBody<LoginOperation>;
export type LoginResponse = ApiResponse<LoginOperation>;
export type CurrentUserResponse = ApiResponse<CurrentUserOperation>;

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

export const useLoginMutation = () =>
  useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (variables) =>
      apiClient("/auth/login", { method: "post", body: variables }) as Promise<LoginResponse>,
  });

export const fetchCurrentUser = async () =>
  apiClient("/auth/me", { method: "get" }) as Promise<CurrentUserResponse>;

export const useCurrentUserQuery = (options?: UseQueryOptions<CurrentUserResponse, unknown>) =>
  useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: fetchCurrentUser,
    ...options,
  });
