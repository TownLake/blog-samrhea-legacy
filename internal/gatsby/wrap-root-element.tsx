import React from "react";

import { CoilProvider } from "@alxshelepenok/diesel";
import { WrapRootElementBrowserArgs } from "gatsby";

const wrapRootElement = ({
  element,
}: WrapRootElementBrowserArgs): React.ReactElement => (
  <CoilProvider>{element}</CoilProvider>
);

export { wrapRootElement };
