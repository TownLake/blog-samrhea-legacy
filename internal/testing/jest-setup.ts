import { localStorageMock, matchMediaMock } from "@/mocks";

Object.defineProperty(window, "localStorage", {
  value: localStorageMock(),
});

Object.defineProperty(window, "matchMedia", {
  value: matchMediaMock(),
});

jest.mock("gatsby", () => jest.requireActual("./__mocks__/gatsby").default);
