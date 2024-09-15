import React from "react";

import {
  render as reactTestingLibraryRender,
  screen,
} from "@testing-library/react";

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

  test("buttons is rendered correctly and exists", () => {
    const props = {
      tags: mocks.markdownRemark.frontmatter.tags,
      tagSlugs: mocks.markdownRemark.fields.tagsSlugs,
    };

    reactTestingLibraryRender(<Tags {...props} />);

    props.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });
});
