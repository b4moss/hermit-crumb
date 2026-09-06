# sitemap

ドキュメントナビから urlset を生成する。対象: `packages/hermit-crumb/src/runtime/utils/buildSitemap.ts`。  
※ 実装は `~/config/docsNav` に依存するため、単体テストでは `docsNavItems` をモックまたはテスト用フィクスチャに差し替える。

### buildSitemapXml

- `siteUrl` とデフォルトロケールから、ナビ項目×ロケールの sitemap XML を組み立てる
- 各 URL に `hreflang` 代替と `x-default` を含める
- XML 特殊文字をエスケープする

#### テスト：正常系

- 返却文字列が XML 宣言と `urlset`（sitemap 0.9 + xhtml）を含む
- ナビの各 `path` について `/{locale}{path}` 形式の `loc` がデフォルトロケールで出る（`path === "/"` はロケール直下）
- `ja` / `en` の `xhtml:link` alternate と、デフォルトロケールの `x-default` が各 url に付く
- `defaultLocale` 省略時は `ja`、明示時はそのロケールの `loc` / `x-default` になる
- `siteUrl` 末尾 `/` は除去してから結合される

#### テスト: 異常系

- `siteUrl` が空文字のときフォールバック基底 `https://example.com` を使う
- `loc` / `href` に `&` `<` `>` `"` `'` が含まれる場合、XML エスケープされる
- ナビが空配列のとき url 要素ゼロの合法な urlset になる

----

以上
