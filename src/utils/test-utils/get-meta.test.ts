import { testUtils } from "@/utils";

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

    expect(testUtils.getMeta("title")).toBe("any title");
    expect(testUtils.getMeta("description")).toBe("any description");
    expect(testUtils.getMeta("og:image")).toBe("");
  });
});
