# playground

本リポジトリ内のデモ／サンプルサイト。`@b4moss/hermit-crumb` の **create 相当の利用例**（module + 生成 UI + 日英 content + Pico.css）です。Netlify preview（`preview-site` CD）の対象。

## 起動

前提: Node.js **>= 22.19**。

```shell
npm install
npm run build -w @b4moss/hermit-crumb
npm run dev:playground
# 静的書き出し
npm run generate:playground
```

公開ディレクトリ（Netlify publish）: **`playground/.output/public`**（`nuxt generate` の成果。ローカルでは `playground/dist` が同パスへの symlink の場合あり）。

## create との関係

| | playground | `hermit-crumb create` |
| --- | --- | --- |
| 役割 | モノレポ内の参照実装・preview | 新規利用側プロジェクトの骨格 |
| `@b4moss/hermit-crumb` | workspace `*` | `^0.1.0` |
| カラー上書きデモ | `theme-override.css` あり | 含めない（利用側で追加） |
| UI / content | リポ内で保守 | 生成後は利用側所有 |

復旧や個別追加は CLI の `add`（上書きは `--force`）を使う。

```shell
npx @b4moss/hermit-crumb add --list
npx @b4moss/hermit-crumb create my-docs
```

## テーマ

- Pico.css とデフォルトトークンは **module が注入**する（利用側で Pico を直 import しない）
- ライト／ダークは color-mode（`data-theme`）と連携
- サイトカラーの差し替えは CSS 変数の上書きのみ

デモの上書き例: [`app/assets/css/theme-override.css`](./app/assets/css/theme-override.css)  
（既定色をインディゴ系に変更。コンポーネントは未変更）

上書きを外す場合は `nuxt.config.ts` の `css` から当該ファイルを削除する。

## 関連

- 移行ガイド: [`docs/migration.md`](../docs/migration.md)
- 仕様: [`docs/specs`](../docs/specs/README.md)
- Netlify CD 配線は Phase 5B（`preview-site`）
