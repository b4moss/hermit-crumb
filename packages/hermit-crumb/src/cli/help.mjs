export const HELP_TEXT = `hermit-crumb — @b4moss/hermit-crumb CLI

使い方:
  hermit-crumb <command> [options]

コマンド:
  add <name>     コンポーネントテンプレートを利用側へ追加
  create         新規プロジェクト生成（Phase 4B で実装予定）
  help           このヘルプを表示

add オプション:
  --force        既存ファイルを上書きする（省略時はスキップ）
  --list         追加可能なコンポーネント名を表示
  --cwd <dir>    対象プロジェクトのルート（既定: カレント）

例:
  npx @b4moss/hermit-crumb add DocsPager
  npx @b4moss/hermit-crumb add DocsPager --force
  npx @b4moss/hermit-crumb add --list

注意:
  add / create で生成した UI は利用側の所有物です。
  パッケージ更新では既存ファイルを自動上書きしません（--force のみ上書き）。
`;
