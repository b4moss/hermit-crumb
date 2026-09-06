# site-meta

サイトメタの正規化と YAML 読込。対象: `packages/hermit-crumb/src/runtime/utils/siteMeta.ts`、`packages/hermit-crumb/src/loadSiteMeta.ts`。

### normalizeSiteMeta

- 生のサイトメタ（または欠落）を `SiteMeta` に正規化する
- 文字列化・デフォルト補完・`siteUrl` 末尾スラッシュ除去を行う
- `software` / `organization` / `jsonLdExtra` を型安全な形へ落とす

#### テスト：正常系

- `undefined` / `null` を渡すと `defaultSiteMeta` 相当（`siteName`・`siteUrl`・`footerText` 等）が返る
- 部分入力（例: `siteName` と `githubUrl` のみ）で未指定フィールドはデフォルト、指定フィールドは採用される
- `siteUrl` 末尾の `/` が除去される（例: `https://example.com/` → `https://example.com`）
- `software.name` 未指定時は `siteName` を、`software.codeRepository` 未指定時は `githubUrl` を用いる
- `organization` がプレーンオブジェクトのときそのまま保持し、`jsonLdExtra` が配列のとき各要素を保持する

#### テスト: 異常系

- `organization` が配列やプリミティブのとき `organization` は `null` になる
- `jsonLdExtra` が配列でないとき空配列になる
- `software.programmingLanguage` が配列でないとき空配列になる
- `siteName` が空文字のときデフォルトの `siteName` にフォールバックする
- `npmUrl` が未指定のとき空文字になり、明示的に渡した文字列は保持される

### loadSiteMeta

- 消費者ルートとパッケージ例示パスから `site.meta.yaml` 系を探索して読み込む
- 優先順位: `site.meta.yaml` → `site.meta.yaml.example` → パッケージ同梱例 → デフォルト
- パース成功時は `normalizeSiteMeta` の結果を返す

#### テスト：正常系

- `rootDir/site.meta.yaml` があるときその内容が採用される
- yaml が無く example のみあるとき example が採用される
- いずれも無く `packageExamplePath` が有効なときパッケージ例が採用される
- 候補がすべて無いとき `normalizeSiteMeta(undefined)` 相当が返る

#### テスト: 異常系

- YAML が壊れているファイルはスキップされ（警告出力）、次候補またはデフォルトに落ちる
- 空 YAML（`null`）は `normalizeSiteMeta(undefined)` 相当として扱われる
- 存在しない `packageExamplePath` を渡しても例外にならずデフォルトへ落ちる

----

以上
