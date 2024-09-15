import React from "react";

import { Feed } from "@/components/Feed";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Feed", () => {
  test("renders correctly", () => {
    const props = { edges: mocks.edges };
    const tree = testUtils
      .createSnapshotsRenderer(<Feed {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
