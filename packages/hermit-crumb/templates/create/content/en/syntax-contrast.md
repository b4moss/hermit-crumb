---
title: Syntax contrast check
description: Verify token contrast on dark code blocks (safe to delete if unused)
---

# Syntax contrast check

Code blocks stay dark even in light UI. Use this page to confirm tokens do not blend into the background. Downstream clones can delete this Markdown and its nav entry if unused.

## Bash

```bash
# comment should stay readable
npm install
echo "hello"
export PATH="/usr/bin:$PATH"
```

## JavaScript

```js
// comment
const name = "doc-site";
function greet(x) {
  if (!x) return null;
  return x + 1;
}
export default class App extends Base {}
```

## TypeScript

```ts
import type { Route } from "./route";
type Meta = { title: string; ok: boolean };
const n: number = 42;
```

## JSON

```json
{
  "name": "doc",
  "ok": true,
  "count": 1,
  "tags": [null]
}
```

## YAML

```yaml
# site meta
siteName: hermit-crumb
siteUrl: https://example.com
enabled: true
```

## Python

```python
def hello(name: str) -> None:
    # tip
    print(f"hi {name}")
    return None
```

## CSS

```css
.foo {
  color: #fff; /* comment */
  background: var(--color-bg);
}
```
