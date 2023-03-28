// module.exports = {
//   target: 'node',
//   mode: 'none',
//   module: {
//     rules: [
//       { test: /\.js$/, use: 'node-loader', exclude: /node_modules/ },
//       // {
//       //   test: /\.ts?$/,
//       //   use: 'ts-loader',
//       //   exclude: /node_modules/,
//       // },
//     ],
//   },

//   // resolve: { extensions: ['.mjs', '.json', '.ts'] },
//   resolve: {
//     extensions: ['.js', '.jsx', '.ts', '.tsx'],
//   },
// };
const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  resolve: {
    extensions: [".ts", "tsx", ".js"],
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, ".webpack"),
          ],
        ],
      },
    ],
  },
};
