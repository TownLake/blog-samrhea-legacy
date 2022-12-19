import React from "react";

import { fireEvent } from "@testing-library/dom";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { testUtils } from "@/utils";

describe("ThemeSwitcher", () => {
  test("renders correctly", () => {
    const tree = testUtils.createSnapshotsRenderer(<ThemeSwitcher />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("dark theme is set correctly", () => {
    window.localStorage.setItem(
      "diesel:theme-atom",
      JSON.stringify({ mode: "dark" }),
    );

    const { getByTitle } = testUtils.renderWithCoilProvider(<ThemeSwitcher />);

    window.localStorage.removeItem("diesel:theme-atom");

    expect(getByTitle("dark")).not.toBeNull();
  });

  test("light theme is set correctly", () => {
    const { getByTitle } = testUtils.renderWithCoilProvider(<ThemeSwitcher />);

    expect(getByTitle("light")).not.toBeNull();
  });

  test("theme switching works correctly", () => {
    const { getByTitle, getByRole } = testUtils.renderWithCoilProvider(
      <ThemeSwitcher />,
    );

    expect(getByTitle("light")).not.toBeNull();

    const button = getByRole("button");

    fireEvent.click(button);

    expect(getByTitle("dark")).not.toBeNull();
  });
});
