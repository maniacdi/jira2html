import { describe, expect, test } from "vitest";
import { convertJiraMarkupToHTML } from "../src";

describe("convertJiraMarkupToHTML", () => {
  test("should convert links correctly", () => {
    const text = "This is a [link|https://example.com].";
    const expectedHTML =
      "This is a <a href='https://example.com' target='_blank' style=\"color: #0959aa; text-decoration: underline;\">link</a>.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert http links correctly", () => {
    const text = "This is a https://example.com";
    const expectedHTML =
      "This is a <a href='https://example.com' target='_blank' style=\"color: #0959aa; text-decoration: underline;\">https://example.com</a><br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert [^name.format] links correctly", () => {
    const text = "This is a [^name.format]";
    const expectedHTML =
      "This is a <a href='name.format' target='_blank' style=\"color: #0959aa; text-decoration: underline;\">name.format</a><br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should remove all title tags", () => {
    const input = "h1. Title\nSome text\nh2. Subtitle";
    const expectedOutput = "Title<br>Some text<br>Subtitle<br>";

    expect(convertJiraMarkupToHTML(input)).toBe(expectedOutput);
  });

  test("not remove all title tags", () => {
    const input = "<h1>Title</h1>";
    const expectedOutput = "<h1>Title</h1><br>";

    expect(convertJiraMarkupToHTML(input)).toBe(expectedOutput);
  });

  test("should remove all title tags even when multiple present", () => {
    const input = "h1. Title\nh2. Subtitle\nh3. Another subtitle";
    const expectedOutput = "Title<br>Subtitle<br>Another subtitle<br>";

    expect(convertJiraMarkupToHTML(input)).toBe(expectedOutput);
  });

  test("should convert line breaks correctly", () => {
    const text = "This is a line\\\\break.";
    const expectedHTML = "This is a line<br/>break.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert bold text correctly", () => {
    const text = "This is *bold* text.";
    const expectedHTML = "This is <b>bold</b> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert underlined text correctly", () => {
    const text = "This is +underlined+ text.";
    const expectedHTML = "This is <u>underlined</u> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert monospaced text correctly", () => {
    const text = "This is {{monospaced}} text.";
    const expectedHTML = "This is <code>monospaced</code> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert italic text correctly", () => {
    const text = "This is _italic_ text.";
    const expectedHTML = "This is <em>italic</em> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert citation text correctly", () => {
    const text = "This is ??citation?? text.";
    const expectedHTML = "This is <cite>citation</cite> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert superscript text correctly", () => {
    const text = "This is ^superscript^ text.";
    const expectedHTML = "This is <sup>superscript</sup> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert subscript text correctly", () => {
    const text = "This is ~subscript~ text.";
    const expectedHTML = "This is <sub>subscript</sub> text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert blockquote text correctly", () => {
    const text = "bq.This is blockquote text.\n";
    const expectedHTML =
      '<blockquote style="padding-left: 10px; margin-left: 10px; border-left: 2px solid #dfe1e6; margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0;">This is blockquote text.</blockquote><br><br>';

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert blockquote 2 text correctly", () => {
    const text = "{quote}This is blockquote text.{quote}";
    const expectedHTML =
      '<blockquote style="padding-left: 10px; margin-left: 10px; border-left: 2px solid #dfe1e6; margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0;">This is blockquote text.</blockquote><br><br>';

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert text color change correctly", () => {
    const text = "{color:red}This is red text.{color}";
    const expectedHTML = '<span style="color: red;">This is red text.</span><br><br>';

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle horizontal ruler correctly", () => {
    const text = "----";
    const expectedHTML = "<hr/><br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle em dash correctly", () => {
    const text = "---";
    const expectedHTML = "&mdash;<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle en dash correctly", () => {
    const text = "--";
    const expectedHTML = "&ndash;<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should return an empty string for null input", () => {
    expect(convertJiraMarkupToHTML(null)).toBe("");
  });

  test("should return an empty string for undefined input", () => {
    expect(convertJiraMarkupToHTML(undefined)).toBe("");
  });

  test("should convert username text correctly", () => {
    const text = "This is [~test] text.";
    const expectedHTML = "This is @test text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert panel correctly", () => {
    const text = "{panel:title=Mi título} Un texto con un título {panel}";
    const expectedHTML = `<div class="code" style="border-collapse: collapse; border: 1px solid black;"><div class="codeHeader" style="border-bottom: 1px solid black; padding: 4px; text-align: left; background-color: transparent;"><b style="margin-left: 10px;">Mi título</b></div><div style="background-color: transparent; padding-left: 8px;">Un texto con un título</div></div><br><br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert code correctly", () => {
    const text = `{code:title=Bar.java|borderStyle=solid|borderColor=#cccccc|titleBGColor=#f7d6c1|bgColor=#ffffce}
    // Some comments here
    public String getFoo(string str)
    {
    private string hola="hola";
    private int num=234;
        return foo;
    }
    {code}`;
    const expectedHTML = `<div class="code" style="border-collapse: collapse; border: 1px solid #cccccc;"><div class="codeHeader" style="border-bottom: 1px solid #cccccc; padding: 4px; text-align: left; background-color: #f7d6c1;"><b style="margin-left: 10px;">Bar.java</b></div><div style="background-color: #ffffce; padding-left: 8px;"><span class="hljs-comment">// Some comments here </span><br><span class="hljs-keyword">public</span> String <span class="hljs-title function_">getFoo</span><span class="hljs-params">(string str)</span><br>{<br><span class="hljs-keyword">private</span> string hola=<span class="hljs-string">&quot;hola&quot;</span>;<br><span class="hljs-keyword">private</span> <span class="hljs-type">int</span> num=<span class="hljs-number">234</span>;<br><span class="hljs-keyword">return</span> foo;<br>}</div></div><br><br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert code correctly without title", () => {
    const text = `{code}
    curl -v localhost:8080
    {code}`;
    const expectedHTML = `<div class="code" style="border-collapse: collapse; border: 1px solid black;"><div style="background-color: transparent; padding-left: 8px;">curl -v localhost:<span class="hljs-number">8080</span></div></div><br><br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle noformat correctly", () => {
    const text = "{noformat}This is plain text.{noformat}";
    const expectedHTML = "This is plain text.<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle tables correctly", () => {
    const text = `||Título X||
    |A1|A2|
    |B1|B2|`;

    const expectedHTML = `<table style="border-collapse: collapse; border: 1px solid black;"><thead><tr><th style="border-collapse: collapse; border: 1px solid black;">Título X</th></tr></thead><tbody></tbody></table>    |A1|A2|<br>|B1|B2|<br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle tables without title correctly", () => {
    const text = `|A1|A2|
    |B1|B2|`;

    const expectedHTML = `<table style="border-collapse: collapse; border: 1px solid black;"><tbody><tr><td style="border-collapse: collapse; border: 1px solid black;">A1</td><td style="border-collapse: collapse; border: 1px solid black;">A2</td></tr></tbody></table>    |B1|B2|<br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle tables without title correctly 2", () => {
    const text = `|A1|A2|A3|
    |B1| |B3|`;

    const expectedHTML = `<table style="border-collapse: collapse; border: 1px solid black;"><tbody><tr><td style="border-collapse: collapse; border: 1px solid black;">A1</td><td style="border-collapse: collapse; border: 1px solid black;">A2</td><td style="border-collapse: collapse; border: 1px solid black;">A3</td></tr></tbody></table>    |B1| |B3|<br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle tables with multiple rows and columns", () => {
    const text = `||Header 1|| ||Header 3||
    |Row 1 Col 1|Row 1 Col 2| |
    |Row 2 Col 1|Row 2 Col 2|Row 1 Col 3|
    |Row 2 Col 1| |Row 1 Col 3|

    `;
    const expectedHTML = `<table style="border-collapse: collapse; border: 1px solid black;"><thead><tr><th style="border-collapse: collapse; border: 1px solid black;">Header 1</th><th style="border-collapse: collapse; border: 1px solid black;"> </th><th style="border-collapse: collapse; border: 1px solid black;">Header 3</th></tr></thead><tbody></tbody></table>    |Row 1 Col 1|Row 1 Col 2| |<br>|Row 2 Col 1|Row 2 Col 2|Row 1 Col 3|<br>|Row 2 Col 1| |Row 1 Col 3|<br><br><br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should replace emojis correctly", () => {
    const text = "Hello :)";
    const expectedHTML = "Hello 🙂<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert table", () => {
    const text = `<table>
    <p></p></table>`;
    const expectedHTML = "<table><br><p></p></table><br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should remove extra whitespace inside <p> tags", () => {
    const text = '<p dir="auto">  This is a paragraph with extra whitespace.  </p>';
    const expectedHTML = "<div>  This is a paragraph with extra whitespace.  </div><br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should remove line breaks inside <ol> and <ul> tags", () => {
    const text = `
      <ol dir="auto">
        <li>Item 1</li>

        <li>Item 2</li>
      </ol>

      <ul dir="auto">
        <li>Item A</li>
        <li>Item B</li>
      </ul>
    `;
    const expectedHTML =
      "<br><ol ><br><li>Item 1</li><br><br><li>Item 2</li><br></ol><br><br><ul ><br><li>Item A</li><br><li>Item B</li><br></ul><br><br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert nested list correctly", () => {
    const text = "* item 1\n** subitem 1\n** subitem 2\n* item 2";
    const expectedHTML =
      '<ul style="margin-left: 40px;"><li>item 1</li><ul style="margin-left: 40px;"><li>subitem 1</li><li>subitem 2</li></ul><li>item 2</li></ul><br>';

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should convert mixed nested list correctly", () => {
    const text =
      "* item 1\n** subitem 1\n*# subitem 2\n* item 2\n texto normal\n# item 3\n## subitem 3\n#* subitem 4\n# item 4\n* item 5";
    const expectedHTML =
      '<ul style="margin-left: 40px;"><li>item 1</li><ul style="margin-left: 40px;"><li>subitem 1</li></ul><ol><li>subitem 2</li></ol><li>item 2</li></ul>texto normal<br><ol><li>item 3</li><ol><li>subitem 3</li></ol><ul style="margin-left: 40px;"><li>subitem 4</li></ul><li>item 4</li></ol><ul style="margin-left: 40px;"><li>item 5</li></ul><br>';

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should replace mailto links correctly", () => {
    const text = "[mailto:test@example.com]";
    const expectedHTML = `<a href="mailto:test@example.com" style="color: #0959aa; text-decoration: underline;">test@example.com</a><br>`;

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should preserve emails inside angle brackets", () => {
    const text = "Contact: Juan <juan@example.com>";
    const expectedHTML = "Contact: Juan &lt;juan@example.com&gt;<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should handle multiple emails in a single line", () => {
    const text = "From: Alice <alice@example.com>, Bob <bob@example.org>";
    const expectedHTML = "From: Alice &lt;alice@example.com&gt;, Bob &lt;bob@example.org&gt;<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should render email alongside other tags (bold)", () => {
    const text = "Please contact *John Doe* <john@example.com>";
    const expectedHTML = "Please contact <b>John Doe</b> &lt;john@example.com&gt;<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });

  test("should render email alongside a link", () => {
    const text = "Visit [Docs|https://docs.example.com] or email <helpdesk@example.com>";
    const expectedHTML =
      "Visit <a href='https://docs.example.com' target='_blank' style=\"color: #0959aa; text-decoration: underline;\">Docs</a> or email &lt;helpdesk@example.com&gt;<br>";

    expect(convertJiraMarkupToHTML(text)).toBe(expectedHTML);
  });
});
