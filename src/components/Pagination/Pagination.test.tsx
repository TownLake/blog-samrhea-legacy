import React from "react";

import { Pagination } from "@/components/Pagination";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Pagination", () => {
  test("renders correctly", () => {
    const props = { ...mocks.pageContext.pagination };
    const tree = testUtils
      .createSnapshotsRenderer(<Pagination {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
