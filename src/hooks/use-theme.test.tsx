import React from "react";

import { CoilProvider } from "@alxshelepenok/diesel";
import { act, renderHook } from "@testing-library/react";

import { useTheme } from "@/hooks";

describe("useTheme", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CoilProvider>{children}</CoilProvider>
  );

  test("should be defined", () => {
    expect(useTheme).toBeDefined();
  });

  test("should return theme and toggle function", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeDefined();
  });

  test("should toggle theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current[0].mode).toBe("light");

    act(() => {
      result.current[1]();
    });

    expect(result.current[0].mode).toBe("dark");
  });
});
