import hljs from "highlight.js/lib/core";
import actionscript from "highlight.js/lib/languages/actionscript";
import ada from "highlight.js/lib/languages/ada";
import applescript from "highlight.js/lib/languages/applescript";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import erlang from "highlight.js/lib/languages/erlang";
import go from "highlight.js/lib/languages/go";
import groovy from "highlight.js/lib/languages/groovy";
import haskell from "highlight.js/lib/languages/haskell";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import lua from "highlight.js/lib/languages/lua";
import objectivec from "highlight.js/lib/languages/objectivec";
import perl from "highlight.js/lib/languages/perl";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import r from "highlight.js/lib/languages/r";
import ruby from "highlight.js/lib/languages/ruby";
import scala from "highlight.js/lib/languages/scala";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import katex from "katex";

import { EMOJI_MAP } from "./emojiMap";

hljs.registerLanguage("actionscript", actionscript);
hljs.registerLanguage("ada", ada);
hljs.registerLanguage("applescript", applescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("css", css);
hljs.registerLanguage("erlang", erlang);
hljs.registerLanguage("go", go);
hljs.registerLanguage("groovy", groovy);
hljs.registerLanguage("haskell", haskell);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("objectivec", objectivec);
hljs.registerLanguage("perl", perl);
hljs.registerLanguage("php", php);
hljs.registerLanguage("python", python);
hljs.registerLanguage("r", r);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("scala", scala);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

export function convertJiraMarkupToHTML(text?: string | null): string {
  let result = text;

  if (result) {
    // Escape raw < and > around emails/names so they aren't treated as html tags
    result = result.replace(/<([a-zA-Z0-9._%+-:]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,10})>/g, "&lt;$1&gt;");

    // Add emojis
    const emojiRegex = new RegExp(
      `(?<!\\S;)(?:${Object.keys(EMOJI_MAP)
        .map((emoji) => emoji.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})(?!\\S)`,
      "g",
    );

    result = result.replace(emojiRegex, (match) => {
      const emoji = match.trim();
      return `${EMOJI_MAP[emoji]} `;
    });

    // Remove all title tags
    result = result.replace(/(^|\s|\n)h([1-6])\.?\s*/gi, "$1");

    // Add line break
    result = result.replace(/\\\\/g, "<br/>");

    // Add strong tags for bold text
    result = result.replace(
      /(^|\s|\n)(\*)(.*?[^*|\s])\*(?=\s|\n|$)(?<!<p[^>]*>.*)(?!.*<\/p>)/g,
      (match, p1, p2, p3) => p1 + "<b>" + p3 + "</b>",
    );

    // Add underlined tags
    result = result.replace(
      /(^|\s|\n)(\+)(.*?[^+|\s])\+(?=\s|\n|$)(?<!<p[^>]*>.*)(?!.*<\/p>)/g,
      (match, p1, p2, p3) => p1 + "<u>" + p3 + "</u>",
    );

    // Add emphasis tags for italic text
    result = result.replace(
      /(^|\s|\n)(_)(.*?[^_|\s])_(?=\s|\n|$)(?<!<p[^>]*>.*)(?!.*<\/p>)/g,
      (match, p1, p2, p3) => p1 + "<em>" + p3 + "</em>",
    );

    // Add superscript tags
    result = result.replace(
      /(^|\s|\n)(\^)(.*?[^^])\^(?=\s|\n|$)(?<!<p[^>]*>.*)(?!.*<\/p>)/g,
      (match, p1, p2, p3) => p1 + "<sup>" + p3 + "</sup>",
    );

    // Add subscript tags
    result = result.replace(
      /(^|\s|\n)(~)(.*?[^~])~(?=\s|\n|$)(?<!<p[^>]*>.*)(?!.*<\/p>)/g,
      (match, p1, p2, p3) => p1 + "<sub>" + p3 + "</sub>",
    );

    // Add code tags for monospaced text
    result = result.replace(/{{([^{}]+)}}/g, "<code>$1</code>");

    // Add citation tags
    result = result.replace(/\?\?(.*?)\?\?/g, "<cite>$1</cite>");

    // Add deleted tags
    result = result.replace(/-(\{.*?"filename":.*?\}):-?¿IOPS-:/g, "$1");

    // Add text color change tags
    result = result.replace(
      /(?:{color:([^}]*)}|{color:([^}]*)}\n)(.*?)(?:\n{color}|{color})/g,
      `<span style="color: $1;">$3</span><br>`,
    );

    // Handle horizontal ruler
    result = result.replace(/^-{4,}\s*$/gm, "<hr/>");

    // Replace --- with em dash
    result = result.replace(/---/g, "&mdash;");

    // Replace -- with en dash
    result = result.replace(/--/g, "&ndash;");

    // Handle user mentions
    result = result.replace(/\[~(.*?)\]/g, (_, username) => `@${username}`);

    // Handle text without any additional formatting
    result = result.replace(/(?:{noformat}|{noformat}\n)([\s\S]*?)(?:\n{noformat}|{noformat})/g, (_, text) => {
      text = text.replace(/<b>(.*?)<\/b>/g, "*$1*");
      text = text.replace(/<u>(.*?)<\/u>/g, "+$1+");
      text = text.replace(/<em>(.*?)<\/em>/g, "_$1_");
      text = text.replace(/<sup>(.*?)<\/sup>/g, "^$1^");
      text = text.replace(/<sub>(.*?)<\/sub>/g, "~$1~");
      return text.trim();
    });

    // Handle mailto links
    result = result.replace(
      /\[mailto:(.*?)\]/g,
      (_, email) => `<a href="mailto:${email}" style="color: #0959aa; text-decoration: underline;">${email}</a>`,
    );

    // Add anchor tags for standalone http:// or https:// links
    result = result.replace(
      /(^|\s)(https?:\/\/[^\s]+)/g,
      (match, p1, p2) =>
        `${p1}<a href='${p2}' target='_blank' style="color: #0959aa; text-decoration: underline;">${p2}</a>`,
    );

    // Add anchor tags for [text|url] and [url] patterns
    result = result.replace(/\[([^\]|]+)(?:\|((?:https?:\/\/)?[^\]]+))?\]/g, (match, p1, p2) => {
      if (p2 && p2.startsWith("http")) {
        return `<a href='${p2}' target='_blank' style="color: #0959aa; text-decoration: underline;">${p1}</a>`;
      } else if (p1 && p1.startsWith("http")) {
        return `<a href='${p1}' target='_blank' style="color: #0959aa; text-decoration: underline;">${p1}</a>`;
      } else {
        return match;
      }
    });

    // Add anchor tags for file links with [^name.format]
    result = result.replace(
      /\[\^([^\].]+?\.[^\]]+?)\]/g,
      (match, fileName) =>
        `<a href='${fileName}' target='_blank' style="color: #0959aa; text-decoration: underline;">${fileName}</a>`,
    );

    // Handle mathematical formulas
    result = result.replace(/\\\((.*?)\\\)/g, (_, formula) => {
      const rendered = katex.renderToString(formula).replace(/<span class="mord mathnormal">[\s\S]*<\/span>/g, "");
      return `<span class="math-expression" style="display: inline-block;">${rendered}</span>`;
    });

    // Handle panel element
    result = result.replace(/{panel(:[^}]*)?\}([\s\S]*?)\{panel}/g, (_, attributes, content) => {
      const titleMatch = attributes?.match(/title=([^|]*)/);
      const title = titleMatch ? titleMatch[1] : "";
      const borderStyleMatch = attributes?.match(/borderStyle=([^|]*)/);
      const borderStyle = borderStyleMatch ? borderStyleMatch[1] : "solid";
      const borderColorMatch = attributes?.match(/borderColor=([^|]*)/);
      const borderColor = borderColorMatch ? borderColorMatch[1] : "black";
      const titleBGColorMatch = attributes?.match(/titleBGColor=([^|]*)/);
      const titleBGColor = titleBGColorMatch ? titleBGColorMatch[1] : "transparent";
      const bgColorMatch = attributes?.match(/bgColor=([^|]*)/);
      const bgColor = bgColorMatch ? bgColorMatch[1] : "transparent";

      let panel = `<div class="code" style="border-collapse: collapse; border: 1px ${borderStyle} ${borderColor};">`;

      if (attributes && attributes.trim() !== "") {
        panel += `<div class="codeHeader" style="border-bottom: 1px ${borderStyle} ${borderColor}; padding: 4px; text-align: left; background-color: ${titleBGColor};"><b style="margin-left: 10px;">${title}</b></div>`;
      }

      panel += `<div style="background-color: ${bgColor || "transparent"}; padding-left: 8px;">${content.trim()}</div></div><br>`;

      return panel;
    });

    // Handle code element
    result = result.replace(/{code(:[^}]*)?\}([\s\S]*?)\{code}/g, (_, attributes, content) => {
      const titleMatch = attributes?.match(/title=([^|]*)/) ? attributes?.match(/title=([^|]*)/) : "code";
      let language = "java";
      const title = titleMatch ? titleMatch[1] : attributes.replace(":", "");

      if (titleMatch) {
        const titleLanguage = titleMatch ? titleMatch[1].split(".")[1] : attributes.replace(":", "");
        if (hljs.getLanguage(titleLanguage)) {
          language = titleLanguage;
        }
      }

      const borderStyleMatch = attributes?.match(/borderStyle=([^|]*)/);
      const borderStyle = borderStyleMatch ? borderStyleMatch[1] : "solid";
      const borderColorMatch = attributes?.match(/borderColor=([^|]*)/);
      const borderColor = borderColorMatch ? borderColorMatch[1] : "black";
      const titleBGColorMatch = attributes?.match(/titleBGColor=([^|]*)/);
      const titleBGColor = titleBGColorMatch ? titleBGColorMatch[1] : "transparent";
      const bgColorMatch = attributes?.match(/bgColor=([^|]*)/);
      const bgColor = bgColorMatch ? bgColorMatch[1] : "transparent";

      let codePanel = `<div class="code" style="border-collapse: collapse; border: 1px ${borderStyle} ${borderColor};">`;

      if (attributes && attributes.trim() !== "") {
        codePanel += `<div class="codeHeader" style="border-bottom: 1px ${borderStyle} ${borderColor}; padding: 4px; text-align: left; background-color: ${titleBGColor};"><b style="margin-left: 10px;">${title}</b></div>`;
      }

      codePanel += `<div style="background-color: ${bgColor || "transparent"}; padding-left: 8px;">${
        hljs.highlight(content.trim(), { language }).value
      }</div></div><br>`;

      return codePanel;
    });

    // Add block quote tags (bq. syntax)
    result = result.replace(
      /bq\.(.*?)\n/g,
      `<blockquote style="padding-left: 10px; margin-left: 10px; border-left: 2px solid #dfe1e6; margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0;">$1</blockquote><br>`,
    );

    // Add block quote tags ({quote} syntax)
    result = result.replace(
      /(?:{quote}|{quote}\n)(.*?)(?:\n{quote}|{quote})/g,
      (_, content) =>
        `<blockquote style="padding-left: 10px; margin-left: 10px; border-left: 2px solid #dfe1e6; margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0;">${content.trim()}</blockquote><br>`,
    );

    // Handle tables
    const tableRegex =
      /(?:\n|^)(\|\|.*?\|\| *\n(?:\|.*?\| *\n|\|.*?\| *$)*)|(?:\n|^)(\|.*?\| *\n(?:\|.*?\| *\n|\|.*?\| *$)*)/g;
    let match: RegExpExecArray | null;

    while ((match = tableRegex.exec(result)) !== null) {
      const table = match[1] || match[2];
      const lines = table
        .split("\n")
        .map((line) => line.trimEnd())
        .filter((line) => line.trim() !== "");
      let tableHTML = `<table style="border-collapse: collapse; border: 1px solid black;">`;

      if (lines[0].startsWith("||")) {
        const titleLine = lines[0];
        const rowLines = lines.slice(1);
        const titles = titleLine
          .split("||")
          .map((title) => title.replace("|", ""))
          .filter((title) => title !== "");

        tableHTML += `<thead><tr>`;
        for (let i = 0; i < titles.length; i++) {
          tableHTML += `<th style="border-collapse: collapse; border: 1px solid black;">${titles[i]}</th>`;
        }
        tableHTML += `</tr></thead><tbody>`;

        for (let i = 0; i < rowLines.length; i++) {
          const row = rowLines[i].split("|").map((cell) => cell.trim());
          tableHTML += `<tr>`;
          for (let j = 1; j < row.length - 1; j++) {
            tableHTML += `<td style="border-collapse: collapse; border: 1px solid black;">${row[j]}</td>`;
          }
          tableHTML += `</tr>`;
        }

        tableHTML += `</tbody>`;
      } else {
        tableHTML += `<tbody>`;

        for (let i = 0; i < lines.length; i++) {
          const row = lines[i].split("|").map((cell) => cell.trim());
          tableHTML += `<tr>`;
          for (let j = 1; j < row.length - 1; j++) {
            tableHTML += `<td style="border-collapse: collapse; border: 1px solid black;">${row[j]}</td>`;
          }
          tableHTML += `</tr>`;
        }

        tableHTML += `</tbody>`;
      }

      tableHTML += `</table>`;
      result = result.replace(table, tableHTML);
    }

    // Convert newlines to <br>
    result = result.replace(/(\n)/g, "<br>");
    result = result.replace(/<br>{2,}/g, "");

    // Clean up JEDITOR <p dir="auto"> tags
    result = result.replace(/(<p\sdir="auto"[^>]*>[\s\S]*?<\/p>)(\s*)/g, (match, tag, whitespace) => {
      return tag + whitespace.trim();
    });
    result = result.replace(/<p dir="auto"([^>]*)>(.*?)<\/p>/g, "<div>$2</div>");
    result = result.replace(/dir="auto"/g, "");
    result = result.replace(/<div>&nbsp;<\/div>/g, "");

    // Add style to <ul>
    result = result.replace(/<ul>/g, `<ul style="margin-left: 40px;">`);

    // Handle lists
    const lines = result.split("<br>");
    let listHTML = "";
    const listStack: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const listItemMatch = line.match(/^([*#]+) (.*)/);

      if (listItemMatch) {
        const depth = listItemMatch[1].length;
        const content = listItemMatch[2];
        const tag = listItemMatch[1][depth - 1] === "#" ? "ol" : "ul";

        while (listStack.length < depth) {
          listHTML += `<${tag}>`;
          listStack.push(tag);
        }

        while (listStack.length > depth) {
          listHTML += `</${listStack.pop()}>`;
        }

        if (listStack.length === depth && listStack[depth - 1] !== tag) {
          listHTML += `</${listStack.pop()}><${tag}>`;
          listStack.push(tag);
        }

        listHTML += `<li>${content}</li>`;
      } else {
        while (listStack.length > 0) {
          listHTML += `</${listStack.pop()}>`;
        }
        listHTML += line + "<br>";
      }
    }

    while (listStack.length > 0) {
      listHTML += `</${listStack.pop()}><br>`;
    }

    result = listHTML;

    // Add style to <ul> again (after list processing)
    result = result.replace(/<ul>/g, `<ul style="margin-left: 40px;">`);
  } else {
    result = "";
  }

  return result;
}
