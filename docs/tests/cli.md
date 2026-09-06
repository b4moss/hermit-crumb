# cli

CLI 引数・テンプレート・スキャフォールド。対象: `packages/hermit-crumb/src/cli/*`、`bin/hermit-crumb.mjs`。

### parseArgs

- `process.argv.slice(2)` 相当をフラグと位置引数に分解する

#### テスト：正常系

- 位置引数が `_` に順に入る
- `--force` / `--list` / `--help` / `-h` が対応 boolean を立てる
- `--cwd <dir>` と `--cwd=<dir>` で `cwd` が設定される
- フラグ省略時 `cwd` は `process.cwd()`、boolean は `false`

#### テスト: 異常系

- `--cwd` の直後に値がないときエラー（メッセージに `--cwd`）
- 未知の `-` 始まりトークンはエラー（`不明なオプション`）
- `--cwd=` で空文字 cwd になってもパース自体は成功し得る（値検証はコマンド側）

### toPackageName

- ディレクトリ名から npm 向けスラッグを作る

#### テスト：正常系

- 空白・大文字を含む名前が小文字スラッグになる（例: `My Docs` → `my-docs`）
- パスが渡されたとき basename を使う
- 許可文字（`. _ -`）は残る

#### テスト: 異常系

- 記号だらけでスラッグが空になるときフォールバック `docs-site`
- 前後のハイフンはトリムされる

### findTemplate / listTemplates / ADD_TEMPLATES

- add 可能なコンポーネント一覧と出力パスを提供する

#### テスト：正常系

- 計画済み名前（DocsPager, DocsJsonLd, FaqList, FaqItem, CollapseBox, SiteHeader, SiteFooter, DocsSidebar, DocsToc, HeaderPrefsMenu, HeaderDropdown）が揃う
- 大文字小文字を無視して `findTemplate` がヒットする
- content 系は `app/components/content/...` へマップされる
- `listTemplates` が name / out / note を返す

#### テスト: 異常系

- 未知名は `null`
- 空文字は `null`

### createProject

- create テンプレートと add デフォルト UI をターゲットへ展開する

#### テスト：正常系

- 空ディレクトリへ作成し、`package.json` 名・依存、`nuxt.config`、content、デフォルト UI、ページ必須 UI が揃う
- `package.json` / `README.md` の `__PACKAGE_NAME__` が置換される
- 戻り値に `summary.created` 等が入る
- `--force` で既存ファイルを上書きし `overwritten` に計上する

#### テスト: 異常系

- 非空ディレクトリかつ `force: false` で `TARGET_EXISTS`（メッセージに既に存在）
- ターゲットがファイルのとき `TARGET_IS_FILE`
- `force: false` で既存のため失敗したとき、既存ファイル内容を壊さない

### assertNuxtApp / addComponent

- Nuxt アプリ根でコンポーネントテンプレートをコピーする

#### テスト：正常系

- `nuxt.config.ts|js|mjs|mts` のいずれかがあれば `assertNuxtApp` 成功
- 初回 add は `created`、既存かつ非 force は `skipped`、force は `overwritten`
- ネスト先（content 配下）も親ディレクトリ作成のうえ書き込まれる

#### テスト: 異常系

- nuxt.config 無しは `NOT_NUXT`
- 未知コンポーネント名は `UNKNOWN_COMPONENT`（追加可能一覧をメッセージに含む）
- skip 時はローカル編集内容を保持する

### run（bin/hermit-crumb.mjs）

- CLI エントリ。コマンド振り分けと終了コード

#### テスト：正常系

- `--help` / コマンド無しでヘルプを出し終了コード `0`
- `create <dir>` 成功で `0`
- `add --list` で `0`
- `add <Name> --cwd <nuxt>` 成功で `0`（再実行の skip も `0`）

#### テスト: 異常系

- `create` でディレクトリ引数無しは `1`
- 既存非空への `create`（非 force）は `1`
- 不明オプションは `1`
- Nuxt 外への `add` は `1`

----

以上
