import React from "react";

import { StaticQuery } from "gatsby";

import { Author } from "@/components/Sidebar/Author";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

const mockedStaticQuery = StaticQuery as jest.Mock;

describe("Author", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(() => null);
  });

  test("renders correctly", () => {
    const props = { isIndex: false, author: mocks.author };
    const tree = testUtils
      .createSnapshotsRenderer(<Author {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
