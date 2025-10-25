import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import LoginPage from "../page";
import { ApiError } from "@/lib/http/client";

const mockMutateAsync = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockReplace = jest.fn();

jest.mock("@/lib/queries/auth", () => ({
  useLoginMutation: () => ({
    mutateAsync: mockMutateAsync,
    status: "idle",
  }),
  authKeys: {
    currentUser: () => ["auth", "currentUser"],
  },
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockInvalidateQueries.mockReset();
    mockReplace.mockReset();
  });

  // ログインフォーム送信で認証が成功し、ダッシュボードへ遷移することを検証
  it("submits credentials and redirects on success", async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "secret" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "サインイン" }).closest("form")!);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ email: "john@example.com", password: "secret" });
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["auth", "currentUser"] });
    expect(mockReplace).toHaveBeenCalledWith("/app");
  });

  // 認証エラー時にエラーメッセージを表示することを検証
  it("shows error message when credentials are invalid", async () => {
    mockMutateAsync.mockRejectedValue(new ApiError(401, null));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "wrong" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "サインイン" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("メールアドレスまたはパスワードが正しくありません。")).toBeInTheDocument();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
