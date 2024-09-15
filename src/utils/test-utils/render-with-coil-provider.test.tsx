import React from "react";

import { createSnapshotsRenderer } from "@/utils/test-utils";

describe("createSnapshotsRenderer", () => {
  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<div />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
