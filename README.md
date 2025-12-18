# 🎁 クリプレこうかんや | Holiday Gift Exchanger

ホリデーシーズンのプレゼント交換をもっと楽しく、意味のあるものにするWebアプリケーション。
従来のビンゴやあみだくじの問題点を解決し、プレゼントの想いをしっかり伝えられる体験を提供します。

## ✨ 特徴

- 🎅 **スムーズな進行**: MC主導でイベントをスマートに管理
- 🎯 **完璧な配分**: 自分のプレゼントが自分に当たらない仕組み
- 💝 **想いを伝える**: プレゼントの詳細情報を全員で共有
- 📱 **モバイル対応**: スマホで簡単に参加可能
- 🔄 **リアルタイム同期**: 全員の画面が自動で更新

## 🚀 クイックスタート

### 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### 環境変数の設定

`.env.local` ファイルをプロジェクトのルートに作成し、以下の環境変数を設定してください：

```env
# アプリケーションのベースURL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase設定（Firebase Consoleから取得）
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_database_url
```

## 📦 デプロイ

### Vercelへのデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/namori999/holiday-gift-exchanger)

1. 上のボタンをクリック、またはVercelダッシュボードから「New Project」を選択
2. GitHubリポジトリを接続
3. 環境変数を設定
4. 「Deploy」をクリック

### 公開前のチェックリスト

- [ ] 環境変数が本番環境用に設定されている
- [ ] `NEXT_PUBLIC_BASE_URL` が本番ドメインに設定されている
- [ ] Firebase Realtime Databaseのセキュリティルールが設定されている
- [ ] Firebase Storageのセキュリティルールが設定されている
- [ ] OGP画像（`/public/images/logo.png`）が用意されている
- [ ] ファビコンが設定されている
- [ ] Twitter カードのメタデータに正しいTwitterハンドルを設定（`src/app/layout.tsx`）

## 🛠 技術スタック

- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **スタイリング**: CSS / Tailwind CSS
- **データベース**: Firebase Realtime Database
- **ホスティング**: Vercel / Netlify

## 📱 使い方

### MCとして主催する場合

1. トップページで「MCのニックネーム」を入力してルームを作成
2. 表示されるQRコードを参加者にシェア
3. 全員がプレゼント情報を入力するまで待機
4. 「プレゼント交換を始める」ボタンをクリック
5. 各プレゼントの配布時に「次のプレゼント」ボタンで進行

### 参加者として参加する場合

1. MCからシェアされたQRコードをスキャン、またはURLにアクセス
2. ニックネームを入力して参加
3. プレゼント情報を入力（タイトル、選んだポイント、おすすめの使い方など）
4. MCがイベントを開始するまで待機
5. プレゼント配布を楽しむ！

## 📄 ドキュメント

- [要件定義書](./REQUIREMENTS.md) - 機能の詳細仕様
- [セットアップガイド](./SETUP.md) - 詳細なセットアップ手順

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📝 ライセンス

MIT License

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
