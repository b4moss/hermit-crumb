---
title: シンタックスコントラスト検証
description: 暗いコードブロック上のトークンコントラスト確認用（不要なら削除可）
---

# シンタックスコントラスト検証

ライト UI でもコードブロックは暗い背景のままです。各トークンが背景に同化しないか確認するためのページです。クローン先で不要ならこの Markdown とナビ項目を削除してください。

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
siteName: Doc Site
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
