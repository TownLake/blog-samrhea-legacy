import React from "react";

import { Meta } from "@/components/Post/Meta";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Meta", () => {
  test("renders correctly", () => {
    const props = {
      date: mocks.markdownRemark.frontmatter.date,
    };

    const tree = testUtils
      .createSnapshotsRenderer(<Meta {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
