import React from "react";

import { StaticQuery, useStaticQuery } from "gatsby";

import { Post } from "@/components/Post";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("Post", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const props = { post: mocks.markdownRemark };
    const tree = testUtils
      .createSnapshotsRenderer(<Post {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
