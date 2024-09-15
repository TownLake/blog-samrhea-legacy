import React from "react";

import { Menu } from "@/components/Sidebar/Menu";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Menu", () => {
  test("renders correctly", () => {
    const props = { menu: mocks.menu };
    const tree = testUtils
      .createSnapshotsRenderer(<Menu {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
