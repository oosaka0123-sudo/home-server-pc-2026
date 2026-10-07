# 自宅サーバーPC図鑑｜HANDOFF

最終更新: 2026-10-07

## 正式情報

- Repository: `oosaka0123-sudo/home-server-pc-2026`
- Production: https://oosaka0123-sudo.github.io/home-server-pc-2026/
- 公開方式: GitHub Pages
- ロリポップ: 使用しない
- Framework: Astro
- データ: 1機種1 JSON
- Deploy: GitHub Actions

## サイトの核

サイト名: **自宅サーバーPC図鑑**

主軸は「完成総額10万円以内で、24時間365日動かすPCを選ぶ」。

ゲームPCランキングではない。スペック最速競争でもない。
実測・完成総額・電気代・安定性・付属品・保証を重視する。

基本条件:
- 完成総額10万円以内を本命
- 物理8コア以上
- メモリ32GB推奨
- NVMe 512GB以上
- Windows 11
- 有線LAN
- Wi-Fi内蔵または追加可能
- 4K60Hz
- 24時間365日運用

10万円超は「予算超過・参考」と明示し、本命扱いしない。

## データ原則

未確認の数値を推定で埋めない。

`dataStatus`:
- measured: 実測
- mixed: 一部実測 / 確認値
- shop: 販売情報
- research: 調査中

各データに `checkedAt` と状態を持たせる。
中古価格は固定の永続値として扱わない。
必須追加部品は `extrasJpy` に含め、`totalJpy` を完成総額とする。

## デザイン方針

コンセプト: **静かな24時間稼働**

白〜ライトグレー + 黒い計測パネル + acid green。
技術研究所 / 計測機器の雰囲気。
Awwwards級の完成度は狙うが、作品性より比較・可読性を優先する。
初期版では動画 / WebGL / particles / custom cursor は使わない。
Mobile は独立設計し、右上44pxハンバーガー + Full Screen Menu。
## 現在のページ

- `/` HOME
- `/pcs/` PC一覧
- `/pcs/[slug]/` PC詳細
- `/compare/` 比較
- `/guide/` 導入ガイド
- `/guide/used-business-laptop/` 中古ビジネスノート活用ガイド
- `/about/` 方針・免責
- `/changelog/` 更新履歴
- `/404.html`

静的生成は現在12ページ。

## CI / QA

`npm run qa` で以下を実行:
1. PCデータ検証
2. Astro build
3. 内部リンク検査

2026-10-07確認:
- 12 pages build: PASS
- Internal links: PASS
- npm audit: 0 vulnerabilities
- 390px主要10ルート: 横崩れ0 / Console Error 0
- 1366px主要10ルート: 横崩れ0 / Console Error 0
- Mobile Menu: open/close + aria-expanded PASS
- Lighthouse mobile:
  - Performance 94
  - Accessibility 100
  - Best Practices 100
  - SEO 100
  - LCP 1.0s
  - CLS 0

## レビュー
Claude実レビューで採用:
- 実測データを最大の差別化にする
- 出典 / 確認日 / データ種別を明示
- 初回リリースを絞る
- スペックカタログより実運用記録を重視

GitHub Copilot CLI独立レビュー:
- CONDITIONAL PASS
- build / 390px / 1366px / Console Error を独立再検証しPASS
- OGP画像不足を指摘 → 1200x630 `public/og-default.png` を追加済み
- 実機写真は公開ブロッカーではなく、実機入手後の追加を推奨

Gemini CLI:
- 0.62.0 は存在するが Google 側 `UNSUPPORTED_CLIENT` で利用不可
- Antigravity CLI実行コマンドは現時点で確認できていない
- Geminiの実レビューを取得したふりをしない

## main統合メモ

2026-10-07、`main` の `3525cf9 Add used business laptop comparison and buying checklist` をAstro版へ統合。
トップページへ混在させず、`/guide/used-business-laptop/` に移して「本命サーバー」と「管理・持ち運び・サブ機」を分離した。
中古価格は固定せず、購入時に再確認する方針。

## 次の優先順位

1. main反映後のGitHub Pages本番確認
2. 4750GEの価格・総額調査
3. 完成総額10万円以内の現行候補を追加
4. 実機購入後、消費電力・温度・CLI・Chrome・4K60Hz・SSHを実測
5. 実機写真を統一アートディレクションで追加
6. Search Console / Bing登録は本番安定後

ランキングは実測データが十分蓄積するまで作らない。
