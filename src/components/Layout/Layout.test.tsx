import React from "react";

import { Layout } from "@/components/Layout";
import { testUtils } from "@/utils";

describe("Layout", () => {
  const LayoutWithChildren = () => <Layout>test</Layout>;

  test("renders correctly", () => {
    const tree = testUtils
      .createSnapshotsRenderer(<LayoutWithChildren />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("dark theme is set correctly", () => {
    window.localStorage.setItem(
      "diesel:theme-atom",
      JSON.stringify({ mode: "dark" }),
    );

    testUtils.renderWithCoilProvider(<LayoutWithChildren />);

    window.localStorage.removeItem("diesel:theme-atom");

    expect(document.documentElement.className).toBe("dark");
  });

  test("light theme is set correctly", () => {
    testUtils.renderWithCoilProvider(<LayoutWithChildren />);

    expect(document.documentElement.className).toBe("light");
  });
});
