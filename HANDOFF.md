# 自宅サーバーPC図鑑｜HANDOFF

最終更新: 2026-10-12

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
- `/privacy/` プライバシー・広告方針
- `/changelog/` 更新履歴
- `/404.html`

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
- Lighthouse mobile: Performance 94 / Accessibility 100 / Best Practices 100 / SEO 100
- LCP 1.0s / CLS 0

## レビュー

既存Claude実レビューで採用:
- 実測データを最大の差別化にする
- 出典 / 確認日 / データ種別を明示
- 初回リリースを絞る
- スペックカタログより実運用記録を重視

GitHub Copilot CLI独立レビュー:
- CONDITIONAL PASS
- build / 390px / 1366px / Console Error を独立再検証しPASS
- OGP画像不足を指摘 → 1200x630 `public/og-default.png` を追加済み

2026-10-12:
- PC03でAntigravity CLI `agy` と Gemini 3.1 Pro High / Claude Sonnet 5.5 High のモデル一覧取得を確認
- ただし今回のヘッドレス独立レビューは、内部 `command` 権限が自動拒否され完走できなかった
- 権限を全開放して完了扱いにはせず、外部3者レビューは「未完了」として扱う
- ChatGPT監査で、壊れたfavicon、構造化データ不足、一次情報リンク不足、README/HANDOFFの古い記述を修正対象化

## 2026-10-12 レビュー修正

- favicon.svgを有効なSVGへ修復
- webmanifestへSVG icon / scopeを追加
- WebSite JSON-LDとrobots metadataを追加
- 中古ビジネスノートガイドへDell / Lenovo / HP / Microsoftの公式仕様リンクを追加
- Surface Book 3の32GB + GTX 1650表現を公式SKUに合わせて限定
- READMEの標準確認コマンドを `npm run qa` 中心へ修正

## アフィリエイト方針

- Yahoo!ショッピングの購入導線はPC詳細ページだけに置く。
- 公開コードには通常のYahoo!ショッピング検索URLだけを持たせる。
- ValueCommerce LinkSwitchの実PIDはGitHub Actions Secret `VALUECOMMERCE_LINKSWITCH_PID` からデプロイ時に注入する。
- Secret未設定時は購入CTAを表示しない。
- PR表記を購入導線の近くに表示する。
- アフィリエイト提携や報酬額を比較順位・予算判定・実測評価に使わない。
- プライバシーポリシーで広告・Cookie等の外部サービス利用方針を明示する。

## 次の優先順位

1. PRのCI / build / link checkを確認してmainへ反映
2. GitHub Pages本番確認
3. 4750GEの価格・総額調査
4. 完成総額10万円以内の現行候補を追加
5. 実機購入後、消費電力・温度・CLI・Chrome・4K60Hz・SSHを実測
6. Search Console / Bing登録は本番安定後

ランキングは実測データが十分蓄積するまで作らない。
