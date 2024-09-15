import React from "react";

import { Copyright } from "@/components/Sidebar/Copyright";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Copyright", () => {
  test("renders correctly", () => {
    const props = { copyright: mocks.siteMetadata.site.siteMetadata.copyright };
    const tree = testUtils
      .createSnapshotsRenderer(<Copyright {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with empty string", () => {
    const props = { copyright: "" };
    const tree = testUtils
      .createSnapshotsRenderer(<Copyright {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
