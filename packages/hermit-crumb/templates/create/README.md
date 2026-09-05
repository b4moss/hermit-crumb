# __PACKAGE_NAME__

`@b4moss/hermit-crumb` の `create` で生成したドキュメントサイトです。

## はじめ方

```shell
cp site.meta.yaml.example site.meta.yaml   # 任意（無い場合は example がフォールバック）
npm install
npm run dev
```

静的書き出し:

```shell
npm run generate
```

## 所有境界

| 触ってよい（利用側所有） | パッケージ依存のまま |
| --- | --- |
| `app/components/**`（create / add で生成した UI） | `@b4moss/hermit-crumb` module |
| `content/` | Pico.css / カラー用 CSS 変数のデフォルト |
| `site.meta.yaml` の値 | composables / utils（auto-import） |
| `app/config/docsNav.ts` / 上書き CSS | |

パッケージ更新では生成ファイルを自動上書きしません。復旧や追加は `npx @b4moss/hermit-crumb add <name>`（上書きは `--force`）。

## カラーの上書き

`:root` / `[data-theme]` で CSS 変数を上書きすればサイトカラーを変えられます（コンポーネント編集は不要）。詳細はリポジトリの `docs/theming.md` を参照してください。
