# セットアップガイド

## Firebase設定

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `holiday-gift-exchanger`）
4. Google Analyticsは不要なら無効化してOK

### 2. Realtime Databaseの有効化

1. 左メニューから「Realtime Database」を選択
2. 「データベースを作成」をクリック
3. ロケーションを選択（例: `asia-southeast1`）
4. セキュリティルールは「テストモードで開始」を選択（後で変更可能）

### 3. 環境変数の設定

1. Firebaseコンソールの「プロジェクトの設定」（歯車アイコン）を開く
2. 「全般」タブの「マイアプリ」から「ウェブアプリを追加」
3. アプリのニックネームを入力して登録
4. 表示される設定値をコピー

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. データベースのセキュリティルール（本番環境用）

開発が完了したら、以下のルールに変更することを推奨：

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## 本番デプロイ

Vercelでのデプロイを推奨：

```bash
npm run build
```

環境変数は Vercel のダッシュボードから設定してください。

