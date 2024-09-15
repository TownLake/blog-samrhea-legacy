import React from "react";

import { StaticQuery, useStaticQuery } from "gatsby";

import { Author } from "@/components/Post/Author";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("Author", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );

    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const tree = testUtils.createSnapshotsRenderer(<Author />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
