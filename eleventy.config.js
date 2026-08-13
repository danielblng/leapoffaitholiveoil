const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({ html: false, linkify: true });
const DATA_DIR = path.join(__dirname, "src", "_data");

let content = {};
function loadContent() {
  content = {};
  for (const file of fs.readdirSync(DATA_DIR)) {
    if (file.endsWith(".json")) {
      const key = path.basename(file, ".json");
      content[key] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
    }
  }
}
function get(obj, dotPath) {
  return dotPath.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", loadContent);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");

  eleventyConfig.addTransform("cms-inject", function (html, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return html;
    const hadDoctype = /^\s*<!doctype/i.test(html);
    const root = parse(html, { comment: true });

    root.querySelectorAll("[data-cms-text]").forEach((el) => {
      const v = get(content, el.getAttribute("data-cms-text"));
      if (v != null) el.set_content(escapeHtml(v));
    });
    root.querySelectorAll("[data-cms-html]").forEach((el) => {
      const v = get(content, el.getAttribute("data-cms-html"));
      if (v != null) el.set_content(md.render(String(v)));
    });
    root.querySelectorAll("[data-cms-src]").forEach((el) => {
      const v = get(content, el.getAttribute("data-cms-src"));
      if (v != null) el.setAttribute("src", String(v));
    });
    root.querySelectorAll("[data-cms-alt]").forEach((el) => {
      const v = get(content, el.getAttribute("data-cms-alt"));
      if (v != null) el.setAttribute("alt", String(v));
    });
    root.querySelectorAll("[data-cms-href]").forEach((el) => {
      const v = get(content, el.getAttribute("data-cms-href"));
      if (v != null) el.setAttribute("href", String(v));
    });

    let out = root.toString();
    if (hadDoctype && !/^\s*<!doctype/i.test(out)) out = "<!DOCTYPE html>\n" + out;
    return out;
  });

  return {
    dir: { input: "src", output: "dist" },
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
  };
};
