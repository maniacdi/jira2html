# jira2html

Convert Jira Wiki Markup to HTML.

## Installation

```bash
npm install jira2html
```

## Usage

```ts
import { convertJiraMarkupToHTML } from "jira2html";

const html = convertJiraMarkupToHTML("This is *bold* and _italic_ text.");
// → "This is <b>bold</b> and <em>italic</em> text.<br>"
```

## Supported syntax

### Text formatting

| Jira markup         | Output              |
| ------------------- | ------------------- |
| `*bold*`            | **bold**            |
| `_italic_`          | _italic_            |
| `+underline+`       | underline           |
| `^superscript^`     | superscript         |
| `~subscript~`       | subscript           |
| `{{monospace}}`     | `monospace`         |
| `??citation??`      | citation            |
| `\\`                | line break          |
| `--`                | en dash –           |
| `---`               | em dash —           |
| `----`              | horizontal rule     |

### Links

| Jira markup                        | Output                       |
| ---------------------------------- | ---------------------------- |
| `[https://example.com]`            | clickable URL                |
| `[text\|https://example.com]`      | `<a>text</a>`                |
| `[mailto:user@example.com]`        | `<a href="mailto:...">` link |
| `[^file.pdf]`                      | file attachment link         |
| `[~username]`                      | `@username`                  |

### Structure

| Jira markup                   | Output                |
| ----------------------------- | --------------------- |
| `h1.` … `h6.`                 | stripped (plain text) |
| `bq. text`                    | blockquote            |
| `{quote}text{quote}`          | blockquote            |
| `* item` / `# item`           | ul / ol list          |
| `** subitem` / `## subitem`   | nested list           |
| `\|\|Header\|\|` / `\|cell\|` | table                 |

### Blocks

| Jira markup                        | Output                                          |
| ---------------------------------- | ----------------------------------------------- |
| `{code}...{code}`                  | syntax-highlighted code block (Java by default) |
| `{code:title=File.js}...{code}`    | code block with title and language detection    |
| `{panel:title=My panel}...{panel}` | styled panel with optional title                |
| `{noformat}...{noformat}`          | plain preformatted text                         |
| `{color:red}text{color}`           | colored text                                    |

### Other

- **Emojis**: `:)` `:(` `:D` `;)` `(y)` `(n)` `(!)` `(/)` `(x)` and more — converted to Unicode emoji
- **Math**: `\(formula\)` rendered via KaTeX
- **Emails in angle brackets**: `<user@example.com>` safely escaped to avoid being parsed as HTML tags
- **JEDITOR cleanup**: `<p dir="auto">` tags and `dir="auto"` attributes are normalized

## Supported languages for code blocks

`actionscript` `ada` `applescript` `bash` `c` `c++` `c#` `css` `erlang` `go` `groovy` `haskell` `java` `javascript` `json` `lua` `objective-c` `perl` `php` `python` `r` `ruby` `scala` `sql` `swift` `xml` `yaml`

## API

### `convertJiraMarkupToHTML(text?: string | null): string`

Converts a Jira Wiki Markup string to an HTML string.

Returns an empty string if `text` is `null` or `undefined`.

### `EMOJI_MAP`

The emoji mapping used internally. Can be imported if you need to extend or inspect it.

```ts
import { EMOJI_MAP } from "jira2html";
```

## License

MIT
