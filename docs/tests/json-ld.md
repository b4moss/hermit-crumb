# json-ld

JSON-LD エンティティ組み立て。対象: `packages/hermit-crumb/src/runtime/utils/jsonLdEntities.ts`。

### normalizeJsonLdValue

- YAML 由来の値を JSON-LD 向けに正規化する
- 日付・配列・オブジェクトを再帰処理する

#### テスト：正常系

- 深夜 UTC の `Date` は `YYYY-MM-DD` の日付のみ文字列になる
- 時刻成分のある `Date` は ISO 文字列のままになる
- 配列・ネストオブジェクト内の `Date` も再帰的に正規化される
- 文字列・数値・真偽値はそのまま返る

#### テスト: 異常系

- `null` / `undefined` はそのまま返る（例外にしない）
- 循環参照は想定外（テスト対象外）。プレーンな木構造のみ保証する

### buildJsonLdEntity

- `type` とコンテキストからロールエンティティを組み立て、著者プロパティを上書き適用する
- 意味のないエンティティは `null` を返す

#### テスト：正常系

- `TechArticle` は `@id`（`#article`）、`headline`、`isPartOf`、`about` を持ち、`organizationId` があれば `publisher` を付与する
- `HowTo` は `name`（headline ではなく）を持ち、同様に `isPartOf` / `about` を付与する
- `FAQPage` は `faqMainEntity` があるとき `mainEntity` を含む
- 未知の `type` でも `@type` とフラグメント付き `@id` のスキャフォールドを返す
- 著者プロパティがデフォルトより優先される

#### テスト: 異常系

- `type` が空または空白のみのとき `null`
- `FAQPage` で `mainEntity` が得られないとき `null`
- `type` 欠落の入力は `null`

### buildWebPage

- WebPage ノードを組み立て、著者 `webPage` プロパティをマージする

#### テスト：正常系

- `@type` `WebPage`、`@id` / `url` / `name`、`isPartOf`（website）、`about`（software）を持つ
- `inLanguage`・`description`・`organizationId` があるときそれぞれ付与される
- 著者オブジェクトのキーがデフォルトを上書きする

#### テスト: 異常系

- `authored` 未指定でも例外なくデフォルトのみの WebPage を返す
- 空オブジェクトの `authored` でもデフォルト構造が壊えない

### sanitizeExtraEntities

- escape hatch の追加エンティティ配列を検証し、不正要素を落とす

#### テスト：正常系

- プレーンオブジェクトの配列はそのまま（日付正規化後）返す
- 空配列・falsy 入力は空配列を返す

#### テスト: 異常系

- 配列でない入力は警告のうえ空配列
- 配列内の非オブジェクト（配列・プリミティブ・null）はスキップされる

### buildOrganization

- `site.meta.yaml` の organization 宣言があるときだけ Organization ノードを返す

#### テスト：正常系

- 非空オブジェクトなら `@type` Organization、`@id` `{siteUrl}/#organization`、`name`、`url` と著者プロパティを返す
- 著者の `name` 等はデフォルトを上書きできる

#### テスト: 異常系

- `null` / `undefined` / 空オブジェクトは `null`
- キーはあるが値が全て落ちるような入力でも、オブジェクトが非空ならノードを返す（キー有無がゲート）

### resolveEntityInputs

- `jsonLd.entities` と `schemaRole` からエンティティ入力リストを決定する

#### テスト：正常系

- `entities` に `type` 付き要素があるときそれを返す
- `entities` が空で `schemaRole` があるとき `[{ type: schemaRole }]` を返す
- 両方無いとき空配列

#### テスト: 異常系

- `entities` と `schemaRole` が同時指定のとき `entities` を優先し、`schemaRole` 無視の警告を出す
- `entities` 内の `type` 無し要素は除外される

### includesEntityType

- 指定タイプが entities / schemaRole 解決結果に含まれるかを返す（競合警告なし）

#### テスト：正常系

- `entities` に当該 `type` があれば `true`
- `entities` が空で `schemaRole` が一致すれば `true`
- どちらも一致しなければ `false`

#### テスト: 異常系

- `entities` があるとき `schemaRole` だけ一致しても `false`（entities 側が正）
- `type` 空文字は含まれないとみなす

----

以上
