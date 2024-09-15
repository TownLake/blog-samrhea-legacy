import React from "react";

import { Contacts } from "@/components/Sidebar/Contacts";
import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

describe("Contacts", () => {
  test("renders null on empty contacts", () => {
    const props = { contacts: mocks.contacts };
    const tree = testUtils
      .createSnapshotsRenderer(<Contacts {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders a list of non-empty contacts", () => {
    const contacts = {
      ...mocks.contacts,
      github: "alxshelepenok/gatsby-starter-lumen",
    };
    const props = { contacts };
    const tree = testUtils
      .createSnapshotsRenderer(<Contacts {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
