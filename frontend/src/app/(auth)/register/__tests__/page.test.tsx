import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import RegisterPage from "../page";
import { ApiError } from "@/lib/http/client";

const mockMutateAsync = jest.fn();

jest.mock("@/lib/queries/auth", () => ({
  useRegisterMutation: () => ({
    mutateAsync: mockMutateAsync,
    status: "idle",
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
  });

  // 登録フォーム送信で仮登録完了メッセージが表示されることを検証
  it("shows completion message after successful registration", async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("お名前"), {
      target: { value: "山田 太郎" },
    });
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "yamada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "passw0rd!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "登録する" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("仮登録が完了しました")).toBeInTheDocument();
    });
  });

  // 重複メールアドレスで登録した際にエラーメッセージを表示することを検証
  it("shows conflict error when email is already registered", async () => {
    mockMutateAsync.mockRejectedValue(new ApiError(409, null));

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("お名前"), {
      target: { value: "山田 太郎" },
    });
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "duplicate@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "passw0rd!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "登録する" }).closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByText("このメールアドレスはすでに登録済みです。ログインをお試しください。"),
      ).toBeInTheDocument();
    });
  });
});
