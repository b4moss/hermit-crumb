# faq

FAQ 抽出とリスト用コンテキスト型。対象: `packages/hermit-crumb/src/runtime/utils/extractFaq.ts`、`faqListContext.ts`。

### minimarkToText

- minimark / MDC ノード木をプレーンテキストへ平坦化する

#### テスト：正常系

- 文字列・数値はそのまま文字列化される
- minimark 要素 `[tag, props, ...children]` は children のみ連結する
- 配列（要素でない）は各要素を連結する
- `{ value }` / `{ children }` オブジェクトは再帰してテキスト化する

#### テスト: 異常系

- `null` / `undefined` / `boolean` は空文字
- 未知オブジェクト形状は空文字（例外にしない）
- 深いネストでも例外なく連結できる

### extractFaqFromBody

- Nuxt Content の body（minimark）から `faq-item` の Q/A を収集する
- JSON-LD FAQPage の唯一の本文ソースとする意図の関数

#### テスト：正常系

- `faq-item` の `question` と子テキストから `{ id, question, answer }` を得る
- 複数の `faq-item` で `id` が `body-faq-0` から連番になる
- ネストした木の中の `faq-item` も拾う
- answer 内の連続空白は単一空白へ正規化される

#### テスト: 異常系

- `question` が空、または answer が空の `faq-item` は結果に含めない
- `faq-item` 以外のタグだけでは空配列
- `body` が `null` / 非配列でも例外なく空配列（または walk 可能な value のみ）
- props 欠落の要素は question 空としてスキップされる

### faqListInjectionKey / FaqListContext

- provide/inject 用のキーとコンテキスト型の契約（実行ロジックはコンポーネント側）

#### テスト：正常系

- `faqListInjectionKey` が安定した文字列定数である
- コンテキスト型が `registerPanel` / `unregisterPanel` / `isOpen` / `toggle` を要求する（型・契約テストで足りる）

#### テスト: 異常系

- キー文字列の変更は破壊的変更として明示的にテストで検知する（スナップショットまたは定数一致）

----

以上
