module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      // "@babel/preset-env",
      "@babel/preset-typescript",
    ],
    plugins: [["inline-import", { extensions: [".sql"] }]],
  };
};
