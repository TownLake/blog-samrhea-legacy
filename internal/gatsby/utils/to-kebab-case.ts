const toKebabCase = (str: string = ""): string =>
  str
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("-")
    .split("_")
    .join("-");

export default toKebabCase;
