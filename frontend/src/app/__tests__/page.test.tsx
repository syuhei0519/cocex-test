import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home page", () => {
  it("renders hero heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /get started/i }),
    ).toBeInTheDocument();
  });
});
