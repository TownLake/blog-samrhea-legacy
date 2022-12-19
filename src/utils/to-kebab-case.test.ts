import { toKebabCase } from "@/utils";

describe("toKebabCase", () => {
  test("successful conversion to kebab case", () => {
    expect(toKebabCase()).toBe("");
    expect(toKebabCase("lorEm")).toBe("lor-em");
    expect(toKebabCase("LOREM")).toBe("lorem");
    expect(toKebabCase("LOR-EM")).toBe("lor-em");
    expect(toKebabCase("lorem-ipsum")).toBe("lorem-ipsum");
    expect(toKebabCase("lorem ipsum")).toBe("lorem-ipsum");
    expect(toKebabCase("lorem_ipsum")).toBe("lorem-ipsum");
    expect(toKebabCase("lorem #ipsum")).toBe("lorem-ipsum");
    expect(toKebabCase("Lorem Ipsum Dolor")).toBe("lorem-ipsum-dolor");
  });
});
