# 依存バージョンと semver

## 初回バージョン

- 本仕様（Pico.css ベース＋ CSS 変数カラーテーマを含む）の実現をもって **v0.1.0** とし、npmjs.org に公開する

## 依存バージョン方針

- **`doc-site` 現状に固定**する（Nuxt 4.5 系および現行 Content / i18n / color-mode / scripts 等）
- **Pico.css** をスタイルベースとして追加依存する（具体バージョンは v0.1.0 実装時に固定）
- 周辺 major への追随は **別判断**（初期リリースの自動追従はしない）
- パッケージの `peerDependencies` / `dependencies` の具体レンジは、移植時の `doc-site/package.json` ＋ Pico の固定版を正とする

## semver（本パッケージ）

### major にする変更

1. **公開契約の破壊**
   - module オプションキー
   - `site.meta.yaml` スキーマ（および対応する `runtimeConfig.public`）
   - create / add 生成テンプレの必須構造
   - CSS 変数の削除・意味変更
   - Pico.css のメジャー切り替えでデフォルト見た目が大きく変わる場合
2. **デフォルトの見た目・クラス構造の大きな変更**
   - 利用側が「デフォルト見た目」やクラスフックに依存している場合に壊れうる変更

### minor / patch の目安

| 種別 | 例 |
| --- | --- |
| minor | 後方互換な機能追加、任意スキーマキー追加、変数追加、新しい `add` テンプレ |
| patch | バグ修正、ドキュメント、トークン微調整（契約名不変で影響が限定的） |

## 生成物との関係

生成 UI は利用側所有のため、パッケージの patch/minor だけでは生成ファイルは更新されない。意図的に揃える場合は再 `add --force` または手作業。

## 関連決定

- 決定 5, 8, 16, 18 — [decisions.md](../decisions.md)
