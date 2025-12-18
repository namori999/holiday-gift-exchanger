# 🚀 デプロイガイド

このガイドでは、クリプレこうかんや（Holiday Gift Exchanger）アプリをVercelにデプロイする手順を説明します。

## 📋 事前準備

### 1. Firebaseプロジェクトのセットアップ

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト設定から以下の情報を取得：
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   - Measurement ID
   - Database URL

### 2. Firebase Realtime Databaseの設定

1. Firebase Consoleで「Realtime Database」を選択
2. 「データベースを作成」をクリック
3. セキュリティルールを以下のように設定：

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        "users": {
          ".indexOn": ["name"]
        },
        "gifts": {
          ".indexOn": ["giverId"]
        },
        "exchanges": {
          ".indexOn": ["giverId", "receiverId"]
        }
      }
    }
  }
}
```

**注意**: 本番環境では、より厳密なセキュリティルールを設定することを推奨します。

### 3. Firebase Storageの設定

1. Firebase Consoleで「Storage」を選択
2. 「開始する」をクリック
3. セキュリティルールを以下のように設定：

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gifts/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🌐 Vercelへのデプロイ

### ステップ1: GitHubリポジトリの準備

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit for deployment"

# GitHubリポジトリを作成して、リモートを追加
git remote add origin https://github.com/namori999/holiday-gift-exchanger.git

# プッシュ
git push -u origin main
```

### ステップ2: Vercelプロジェクトの作成

1. [Vercel](https://vercel.com)にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### ステップ3: 環境変数の設定

Vercelのプロジェクト設定画面で、以下の環境変数を追加：

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebaseから取得 |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Firebaseから取得 |

### ステップ4: デプロイ

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（通常2-5分）
3. デプロイ完了後、URLをクリックしてアプリを確認

## ✅ デプロイ後のチェックリスト

- [ ] トップページが正常に表示される
- [ ] MCとしてルームを作成できる
- [ ] QRコードが正しく生成される
- [ ] 参加者としてルームに参加できる
- [ ] プレゼント情報が入力できる
- [ ] プレゼント交換が正常に動作する
- [ ] 画像のアップロードが機能する
- [ ] OGP画像が正しく表示される（Twitter Card Validator等で確認）
- [ ] モバイルデバイスで正常に動作する

## 🔧 カスタムドメインの設定（オプション）

### Vercelでカスタムドメインを追加

1. Vercelプロジェクトの「Settings」→「Domains」に移動
2. 「Add」ボタンをクリック
3. ドメイン名を入力（例: `giftexchanger.com`）
4. DNS設定の指示に従う

### 環境変数の更新

カスタムドメインを設定した場合、`NEXT_PUBLIC_BASE_URL`を更新：

```
NEXT_PUBLIC_BASE_URL=https://your-custom-domain.com
```

### robots.txtの更新

`public/robots.txt`のサイトマップURLも更新：

```
Sitemap: https://your-custom-domain.com/sitemap.xml
```

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合

1. ローカル環境でビルドを確認：
```bash
npm run build
```

2. TypeScriptのエラーがあれば修正
3. 修正後、再度プッシュ

### 環境変数が反映されない場合

1. Vercelの環境変数設定を確認
2. 環境変数を更新した場合は、再デプロイが必要
3. Vercelダッシュボードから「Redeploy」をクリック

### Firebase接続エラーが発生する場合

1. Firebase設定が正しいか確認
2. Firebaseプロジェクトが有効か確認
3. セキュリティルールが正しく設定されているか確認

## 📊 パフォーマンス最適化

### 画像の最適化

- `/public/images/`内の画像を最適化
- WebP形式への変換を検討
- 適切なサイズにリサイズ

### キャッシュの活用

- `vercel.json`で設定済み
- 静的アセットは1年間キャッシュ

## 🔒 セキュリティ推奨事項

1. **Firebase セキュリティルール**: より厳格なルールを実装
2. **環境変数**: センシティブな情報は必ず環境変数で管理
3. **CORS設定**: 必要に応じてFirebaseでCORSを設定
4. **レート制限**: Firebase Functions等でレート制限を実装

## 📈 監視とログ

### Vercel Analytics

1. Vercelダッシュボードで「Analytics」を有効化
2. ページビュー、パフォーマンスを監視

### Firebase Monitoring

1. Firebase Consoleで「Performance」「Crashlytics」を確認
2. エラーログを定期的にチェック

## 🔄 更新のデプロイ

コードを更新してGitHubにプッシュすると、Vercelが自動的に再デプロイします：

```bash
git add .
git commit -m "Update feature"
git push
```

## 📞 サポート

問題が発生した場合：
1. [GitHub Issues](https://github.com/namori999/holiday-gift-exchanger/issues)で報告
2. [Vercelドキュメント](https://vercel.com/docs)を参照
3. [Firebaseドキュメント](https://firebase.google.com/docs)を参照

---

**最終更新**: 2025年12月18日

