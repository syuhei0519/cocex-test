import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { AppShell } from "../AppShell";

const mockMutateAsync = jest.fn();
const mockRemoveQueries = jest.fn();
const mockReplace = jest.fn();

jest.mock("@/components/auth/AuthGuard", () => ({
  useCurrentUser: () => ({
    name: "佐藤 花子",
  }),
}));

jest.mock("@/lib/queries/auth", () => ({
  useLogoutMutation: () => ({
    mutateAsync: mockMutateAsync,
    status: "idle",
  }),
  authKeys: {
    all: ["auth"],
  },
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      removeQueries: mockRemoveQueries,
    }),
  };
});

jest.mock("next/navigation", () => ({
  usePathname: () => "/app",
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe("AppShell", () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockRemoveQueries.mockReset();
    mockReplace.mockReset();
  });

  // ログアウトボタン押下でログアウト処理とリダイレクトが実行されることを検証
  it("executes logout flow and redirects to login", async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    render(
      <AppShell>
        <div>content</div>
      </AppShell>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "ログアウト" })[0]);

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
    expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["auth"] });
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  // ログアウト処理が失敗した際にエラーメッセージを表示することを検証
  it("shows error message when logout fails", async () => {
    mockMutateAsync.mockRejectedValue(new Error("network error"));

    render(
      <AppShell>
        <div>content</div>
      </AppShell>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "ログアウト" })[0]);

    await waitFor(() => {
      expect(
        screen.getAllByText("ログアウトに失敗しました。時間をおいて再度お試しください。"),
      ).not.toHaveLength(0);
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
