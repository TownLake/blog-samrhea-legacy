import React from "react";

import {
  render as reactTestingLibraryRender,
  screen,
} from "@testing-library/react";

import { Button } from "@/components/Button";
import { createSnapshotsRenderer } from "@/utils/test-utils";

describe("Button", () => {
  test("renders correctly", () => {
    const props = { title: "Button", to: "/" };
    const tree = createSnapshotsRenderer(<Button {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with external link", () => {
    const props = { title: "Button", to: "https://example.com" };
    const tree = createSnapshotsRenderer(<Button {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom class name", () => {
    const props = { title: "Button", to: "/", className: "custom-class-name" };
    const tree = createSnapshotsRenderer(<Button {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("the title is rendered correctly and exists", () => {
    const props = { title: "Text", to: "/" };
    reactTestingLibraryRender(<Button {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
  });
});
