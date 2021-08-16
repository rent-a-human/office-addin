/* eslint-disable no-undef */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const urlDev = "https://localhost:3000/";
const urlProd = "https://apipru.mifirma.co:6780"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const buildType = dev ? "dev" : "prod";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      app: "./src/app/app.js",
      taskpane: "./src/taskpane/taskpane.js",
      commands: "./src/commands/commands.js",
      fallbackauthdialog: "./src/helpers/fallbackauthdialog.js",
    },
    output: {
      path: path.resolve(process.cwd(), "dist"),
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|ico|jpg|jpeg|gif|svg)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      }),
      new HtmlWebpackPlugin({
        filename: "fallbackauthdialog.html",
        template: "./src/helpers/fallbackauthdialog.html",
        chunks: ["polyfill", "fallbackauthdialog"],
      }),
      new HtmlWebpackPlugin({
        filename: "documentos.html",
        template: "./src/app/documentos.html",
        chunks: ["polyfill", "app"]
      }),
      new HtmlWebpackPlugin({
        filename: "app.html",
        template: "./src/app/app.html",
        chunks: ["polyfill", "app"]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            to: "app.css",
            from: "./src/app/app.css"
          },
          {
            from: "./src/taskpane/taskpane.css",
            to: "taskpane.css",
          },
          {
            from: "manifest*.xml",
            to: "[name]." + buildType + ".[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [{ 
          from: './src/app/lib/favicon',
          to: 'assets/img/favicon' 
        }]
      }),
      new CopyWebpackPlugin({
        patterns: [{ 
          from: './assets/img',
          to: 'assets/img' 
        }]
      }),
      new CopyWebpackPlugin({
        patterns: [{ 
          from: './src/app/lib/fonts',
          to: 'assets/fonts' 
        }]
      }),
      new CopyWebpackPlugin({
        patterns: [{ 
          from: './src/app/lib/fonts',
          to: 'assets' 
        }]
      }),
    ],
  };

  return config;
};
