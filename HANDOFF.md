# 自宅サーバーPC図鑑｜HANDOFF

最終更新: 2026-11-21

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
4. アフィリエイト検査（LinkSwitch runtime / PR表記 / Yahoo! CTA）
5. SEO検査（verification files / sitemap / canonical / JSON-LD / OGP）
6. 依存脆弱性検査（npm audit / moderate以上）

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
- ValueCommerce LinkSwitchのPIDはブラウザへ配信される公開識別子なので、GitHub Actionsで公開設定として生成する。
- LinkSwitchが有効なときだけ購入CTAを表示する。
- PR表記を購入導線の近くに表示する。
- アフィリエイト提携や報酬額を比較順位・予算判定・実測評価に使わない。
- プライバシーポリシーで広告・Cookie等の外部サービス利用方針を明示する。

## 現在の完成状態

2026-11-20時点で、公開サイトの通常リリース範囲は完成。

完了:
1. Astro / GitHub Pages本番公開
2. PC一覧・詳細・比較・導入ガイド・中古ノートガイド
3. PC写真必須化・ローカル固定
4. Yahoo!ショッピング / ValueCommerce LinkSwitch本番稼働
5. アフィリエイト漏れをCIで自動検査
6. 4750GE / 5750GE価格再調査
7. GMKtec NucBox K6を10万円以内候補として追加
8. Google / Bing所有権確認ファイル配置
9. robots / sitemap / canonical / JSON-LD / OGP整備
10. SEO資産をCIで自動検査
11. npm audit脆弱性0件へ更新し、CIへセキュリティ検査を追加
12. Google Search Consoleの登録・所有権確認を実確認
13. IndexNowをデプロイ後に自動送信し、Bing等への更新通知を自動化

外部アカウント側の状態:
- Google Search Console: URLプレフィックスプロパティ `https://oosaka0123-sudo.github.io/home-server-pc-2026/` は登録済み。2026-11-21に「確認済み所有者」をPC03 Operaで確認。ページレポートは登録済み1 / 未登録0。旧送信 `/sitemap.xml` は2026-10-10送信のまま「取得できませんでした」表示だが、現在は `/sitemap.xml` と `/sitemap-index.xml` の両方をrobots.txtへ明示し、ファイル自体の本番取得も確認済み。
- Bing Webmaster Tools: `BingSiteAuth.xml` は本番配置済み。管理画面はMicrosoftアカウント未ログインのため登録状態は未確認。代替としてMicrosoft推奨のIndexNowをGitHub Pagesデプロイ後に自動送信する。

今後は新機能開発ではなく運用フェーズ:
- 実機入手時の消費電力・温度・CLI・Chrome・4K60Hz・SSH実測
- 中古価格の定期更新
- 条件を満たす新規PC候補追加

ランキングは実測データが十分蓄積するまで作らない。

## 写真ポリシー（2026-11-19追加）

- PC写真は掲載必須。写真なしのPCデータはCIで失敗させる。
- 一覧カード・PC詳細・中古ビジネスノートガイドに実機識別用の写真を表示する。
- 現在はメーカー公式画像を優先し、画像本体は `public/images/` に固定保存する。表示時にメーカーCDNへ依存しない。
- データに画像出典URL、クレジット、画像確認日、画像種別（manufacturer / original）を保持する。
- 実機入手後は自前写真へ順次差し替える。
- 画像が不明確・低解像度・型番違いの場合は掲載しない。
- `npm run qa` は画像メタデータだけでなく、ローカル画像ファイルの実在と最低サイズも検証する。
- 中古ノート候補は `src/data/used-laptops.json` で一元管理する。

## アフィリエイトQA（2026-11-20追加）

- すべてのメインPCに `yahooQuery` を必須化する。
- build後に `npm run check:affiliate` を実行し、LinkSwitch runtime有効、数値PID、各PC詳細のPR表記、Yahoo!ショッピングCTA、`rel="sponsored nofollow noopener"` を検証する。
- 新規PC追加時にYahoo!導線を入れ忘れるとCIを失敗させる。
