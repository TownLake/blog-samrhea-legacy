import { getMeta } from "@/utils/test-utils";

describe("testUtils.getMeta", () => {
  test("successful getting value by key", () => {
    const getElementsByTagNameSpy = jest.spyOn(
      document,
      "getElementsByTagName",
    );

    const title = {
      name: "title",
      content: "any title",
    };

    const description = {
      name: "description",
      content: "any description",
    };

    getElementsByTagNameSpy.mockReturnValue([
      {
        getAttribute: jest.fn((key: keyof typeof title) => title[key]),
      },
      {
        getAttribute: jest.fn(
          (key: keyof typeof description) => description[key],
        ),
      },
    ] as unknown as HTMLCollectionOf<HTMLElement>);

    expect(getMeta("title")).toBe("any title");
    expect(getMeta("description")).toBe("any description");
    expect(getMeta("og:image")).toBe("");
  });
});
