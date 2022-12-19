import React, { ReactElement } from "react";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";

import { CoilProvider } from "@alxshelepenok/diesel";
import { render, RenderOptions } from "@testing-library/react";

interface Props {
  children: React.ReactNode;
}

const WithCoilProvider: React.FC<Props> = ({ children }) => (
  <CoilProvider>{children}</CoilProvider>
);

const renderWithCoilProvider = (
  ui: React.ReactElement,
  options?: RenderOptions,
) => render(ui, { wrapper: WithCoilProvider, ...options });

export const createSnapshotsRenderer = (
  nextElement: ReactElement,
  options?: TestRendererOptions,
): ReactTestRenderer =>
  renderer.create(<CoilProvider>{nextElement}</CoilProvider>, options);

export default renderWithCoilProvider;
