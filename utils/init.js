const welcome = require("cli-welcome");
const pkg = require("./../package.json");
const unhandled = require("cli-handle-unhandled");
const chalk = require("chalk");
const figlet = require("figlet");

module.exports = ({ clear = true }) => {
  unhandled();
  welcome({
    title: `is-a-dev`,
    tagLine: `CLI`,
    description: pkg.description,
    version: pkg.version,
    bgColor: "#36BB09",
    color: "#000000",
    bold: true,
    clear,
  });
};
