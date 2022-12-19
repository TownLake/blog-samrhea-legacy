import React from "react";

import { StaticQuery, useStaticQuery } from "gatsby";

import { Sidebar } from "@/components/Sidebar";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("Sidebar", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const props = { isIndex: true };
    const tree = testUtils
      .createSnapshotsRenderer(<Sidebar {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
