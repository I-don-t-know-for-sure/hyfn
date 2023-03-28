const path = require("path");

module.exports = {
  target: 'node',
  mode: 'production',

  // resolve: {
  //   alias: {
     
     
  //     "hyfn-types": path.resolve(__dirname, "../hyfn-types/.dist"),  
     
  // }
  // },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{loader:'ts-loader', options: {
          transpileOnly: true
        }}],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js'],
  },
  // module: {
  //   rules: [
  //     // { test: /\.js$/, use: 'node-loader', exclude: /node_modules/ },
  //     {
  //       test: /\.ts?$/,
  //       use: 'ts-node',
  //       exclude: /node_modules/,
  //     },
  //   ],
  // },

  // resolve: { extensions: ['.mjs', '.json', '.ts'] },
  // resolve: {
  //   extensions: ['.js',],
  // },
};
// const path = require('path');
// const slsw = require('serverless-webpack');
// const nodeExternals = require('webpack-node-externals');

// module.exports = {
//   mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
//   entry: slsw.lib.entries,
//   externals: [nodeExternals()],
//   target: 'node',
//   resolve: {
//     // Add `.ts` and `.tsx` as a resolvable extension.
//     extensions: [".ts", ".tsx", ".js"],
//     // Add support for TypeScripts fully qualified ESM imports.
//     extensionAlias: {
//      ".js": [".js", ".ts"],
//      ".cjs": [".cjs", ".cts"],
//      ".mjs": [".mjs", ".mts"]
//     }
//   },
//   module: {
//     rules: [
//       // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
//       { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
//     ]
//   }
// };
