import React from "react";

import { StaticQuery, useStaticQuery } from "gatsby";

import { Comments } from "@/components/Post/Comments";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("Comments", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );

    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const props = {
      postTitle: mocks.markdownRemark.frontmatter.title,
      postSlug: mocks.markdownRemark.fields.slug,
    };

    const tree = testUtils
      .createSnapshotsRenderer(<Comments {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
