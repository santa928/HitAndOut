# Hit And Out

スマホで遊ぶ端末受け渡し版のヒット&アウトです。投手役が打球先を選び、端末を渡された打者役が予想を選びます。まずは 1 台の端末で 3 イニングを遊べる静的 Web アプリとして公開し、将来は Supabase を使った複数端末プレイへ拡張する想定です。

## いま遊べる範囲

- 2 人用の端末受け渡しプレイ
- 3 イニング制
- 各回の得点とアウトを読む球場スコアボード
- 投手が隠したヒット位置を打者が読めたら進塁と得点
- アウトを引いたら残った位置を読み、3 アウトで攻守交代
- 各攻守交代時の端末受け渡し画面

`Call Your Shot` は初版では扱いません。同点終了時は初版の暫定仕様として引き分けにしています。

## 開発

ローカルの Node.js 環境を汚さないため、開発コマンドは Docker Compose 経由で実行します。

```bash
docker compose run --rm app npm test
docker compose run --rm app npm run build
docker compose run --rm e2e npm run test:e2e
docker compose up app
```

開発サーバーは `http://localhost:5173` で起動します。

## 遊び方

1. 先攻の投手役が球場盤面からヒット位置を隠します。
2. 端末受け渡し画面で相手へ端末を渡します。
3. 打者役がヒット位置を予想します。
4. アウトなら同じ隠し配置の残りを読み、ヒットなら進塁後に次の勝負へ進みます。
5. 3 イニング終了時点の得点で勝敗を決めます。

## 公開

GitHub Pages は `.github/workflows/deploy-pages.yml` で `main` への push から `dist` を公開します。リポジトリ設定の Pages で Source を GitHub Actions にしてから使います。

Vite のアセット参照は相対 `base` にしているため、GitHub Pages のリポジトリ配下公開と Vercel のルート公開の両方を見据えています。

## 今後

- Supabase のルームと合言葉で複数端末対戦
- 公開名、説明文、ルール表現のリリース前整理
- 追加ルールの採用判断
