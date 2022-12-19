const config = {
  sourceMaps: true,
  module: {
    type: "commonjs",
  },
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
};

export default config;
