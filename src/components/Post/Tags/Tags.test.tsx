import React from "react";

import { Tags } from "@/components/Post/Tags";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Tags", () => {
  test("renders correctly", () => {
    const props = {
      tags: mocks.markdownRemark.frontmatter.tags,
      tagSlugs: mocks.markdownRemark.fields.tagsSlugs,
    };

    const tree = testUtils
      .createSnapshotsRenderer(<Tags {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
