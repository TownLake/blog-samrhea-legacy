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
});
