import { render, screen, fireEvent } from "@testing-library/react";
import WaterTracker from "./WaterTracker";

describe("WaterTracker component", () => {
  test("renders total ml correctly", () => {
    render(<WaterTracker glasses={2} glassSize={500} />);

    // Check calculated ml text
    expect(screen.getByText("1000 ml")).toBeInTheDocument();
  });

  test("calls onAdd when Add button clicked", () => {
    const handleAdd = jest.fn();
    render(<WaterTracker onAdd={handleAdd} />);

    fireEvent.click(screen.getByRole("button", { name: /add glass/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
