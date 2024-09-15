import { renderHook } from "@testing-library/react";
import { StaticQuery, useStaticQuery } from "gatsby";

import { useSiteMetadata } from "@/hooks";
import * as mocks from "@/mocks";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("useSiteMetadata", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("should return site metadata", () => {
    const { result } = renderHook(() => useSiteMetadata());
    expect(result.current).toEqual({
      ...mocks.siteMetadata.site.siteMetadata,
    });
  });

  test("should return an empty object if no site metadata is found", () => {
    const props = {
      ...mocks.siteMetadata,
      site: {
        ...mocks.siteMetadata.site,
        siteMetadata: {},
      },
    };

    mockedStaticQuery.mockImplementationOnce(({ render }) => render(props));
    mockedUseStaticQuery.mockReturnValue(props);

    const { result } = renderHook(() => useSiteMetadata());
    expect(result.current).toEqual({});
  });
});
