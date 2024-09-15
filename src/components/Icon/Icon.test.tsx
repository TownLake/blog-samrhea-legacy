import React from "react";

import { Icon } from "@/components/Icon";
import { ICONS } from "@/constants";
import { getIcon, testUtils } from "@/utils";

describe("Icon", () => {
  test("renders correctly", () => {
    const [twitter] = Object.keys(ICONS) as Array<keyof typeof ICONS>;
    const props = { name: twitter, icon: getIcon(twitter) };
    const tree = testUtils
      .createSnapshotsRenderer(<Icon {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom size", () => {
    const [twitter] = Object.keys(ICONS) as Array<keyof typeof ICONS>;
    const props = { name: twitter, icon: getIcon(twitter), size: 32 };
    const tree = testUtils
      .createSnapshotsRenderer(<Icon {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom color", () => {
    const [twitter] = Object.keys(ICONS) as Array<keyof typeof ICONS>;
    const props = { name: twitter, icon: getIcon(twitter), color: "red" };
    const tree = testUtils
      .createSnapshotsRenderer(<Icon {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom size and color", () => {
    const [twitter] = Object.keys(ICONS) as Array<keyof typeof ICONS>;
    const props = {
      name: twitter,
      icon: getIcon(twitter),
      size: 32,
      color: "red",
    };
    const tree = testUtils
      .createSnapshotsRenderer(<Icon {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
