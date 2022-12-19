import React from "react";

import { Contacts } from "@/components/Sidebar/Contacts";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Contacts", () => {
  test("renders correctly", () => {
    const props = { contacts: mocks.contacts };
    const tree = testUtils
      .createSnapshotsRenderer(<Contacts {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
