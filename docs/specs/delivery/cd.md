# CD（継続的デリバリ）

v0.1.0 スコープに含む CD のトリガーと成果物。実装の正は本仕様と [publishing.md](./publishing.md)。

## 方針サマリ

| 対象 | トリガー | 成果 |
| --- | --- | --- |
| npm リリース | **`release` ブランチ**へ、**新しいタグが付いたコミット**がマージされたとき | `@b4moss/hermit-crumb` を npmjs.org に publish |
| Netlify リリース | **`preview-site` ブランチ**へマージが入ったとき | 本リポ内デモ／preview サイトを Netlify にデプロイ |

CI（lint / test / build）と CD は分離してよい。CD は上記ブランチ／条件に限定する。

## npm リリース（`release`）

### トリガー

1. 対象コミットに **新しいバージョンタグ**が付いている（例: `v0.1.0`）
2. そのコミットが **`release` ブランチにマージ**される

両方を満たしたときに npm publish を実行する。タグだけの push や、`release` 以外へのマージでは publish しない。

### 振る舞い

- タグ名から公開バージョンを決定する（`v` プレフィックスは剥がして `package.json` / npm バージョンと一致させる）
- 既に同じバージョンが npm に存在する場合は失敗させる（再 publish しない）
- 初回公開は **v0.1.0**（[publishing.md](./publishing.md) の公開条件を満たしたうえで、本 CD 経路で出す）

### 前提

- `@b4moss` scope の npm トークン等を CD シークレットとして保持する
- publish 前に pack／ビルドが成功していること

## Netlify リリース（`preview-site`）

### トリガー

- **`preview-site` ブランチへのマージ**（PR マージまたは同等の更新）

### 振る舞い

- 本リポジトリ内のデモ／サンプルサイトをビルドし、Netlify にデプロイする
- production 相当の preview サイト更新として扱う（ブランチ名は `preview-site`）

### 前提

- Netlify サイトとリポジトリ／ブランチの接続、または CD からのデプロイトークン
- デモのビルドコマンドと公開ディレクトリが決まっていること（Phase 5 で確定）

## ブランチ役割（v0.1.0）

| ブランチ | 役割 |
| --- | --- |
| `main`（または開発用既定） | 日常開発。ここへのマージだけでは npm／Netlify CD を起動しない |
| `release` | npm リリース用。**新タグ付きコミットのマージ**で npm CD |
| `preview-site` | preview サイト用。**マージ**で Netlify CD |

開発 →（タグ付け）→ `release` へマージ、デモ更新 → `preview-site` へマージ、という流れを基本とする。

## 非スコープ（v0.1.0）

- 全ブランチへの自動 npm publish
- タグ無しの `release` マージでの publish
- `main` 直結の Netlify production デプロイ（preview は `preview-site` 経由）

## 関連決定

- 決定 9, 10, 18, 19, 20 — [decisions.md](../decisions.md)

## 関連文書

- [publishing.md](./publishing.md)
- [roadmap.md](./roadmap.md)
