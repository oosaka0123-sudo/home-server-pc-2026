[Reading 35 lines from start (total: 35 lines, 0 remaining)]

# 自宅サーバーPC図鑑

完成総額10万円以内を軸に、24時間365日動かすミニPC・中古PCを、実測・総額・電気代で比較するサイトです。

## 公開先

GitHub Pages: https://oosaka0123-sudo.github.io/home-server-pc-2026/

## 設計原則

- 本体価格ではなく「完成総額10万円以内」
- 物理8コア以上、32GB推奨、NVMe 512GB以上
- 有線LAN、4K60Hz、24時間運用を確認
- 実測 / 販売情報 / 調査中を明示
- 未確認の数値を推定で埋めない
- ランキングより用途・条件別比較
- ロリポップは使わず GitHub Pages で公開

## 技術構成

Astro / JSON data / GitHub Actions / GitHub Pages

Yahoo!ショッピングの購入導線はValueCommerce LinkSwitchを利用し、実PIDはGitHub Actions Secretからデプロイ時に注入します。公開コードへ実IDを固定しません。

PC情報は `src/data/pcs/*.json` の1機種1ファイルで管理します。

## ローカル確認

```bash
npm ci
npm run qa
npm run dev
```

`npm run qa` は、PCデータ検証 → Astro build → 内部リンク検査をまとめて実行します。
