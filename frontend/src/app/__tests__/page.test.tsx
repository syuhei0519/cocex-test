import { render, screen } from "@testing-library/react";

import Home from "../page";

describe("Home page", () => {
  it("renders hero heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "収支の見える化を、チームで進める家計管理アプリ" }),
    ).toBeInTheDocument();
  });
});
