const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: "[local]__[path][name]__[hash:base64:10]"
            }
          },
          "postcss-loader"
        ]
      },
    ],
  },
  resolve: {
    extensions: [ ".ts", ".tsx", ".js", ".css" ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
  },
};
