# 🖼️ OGP画像とSNSシェア設定ガイド

このガイドでは、SNSでシェアされた際に表示されるOGP（Open Graph Protocol）画像の準備と設定方法を説明します。

## 📐 OGP画像の仕様

### 推奨サイズ
- **幅**: 1200px
- **高さ**: 630px
- **比率**: 1.91:1
- **ファイル形式**: PNG、JPG、GIF
- **最大ファイルサイズ**: 5MB（推奨は1MB以下）

### 現在の設定
現在、`/public/images/logo.png`がOGP画像として設定されています。

## 🎨 OGP画像の作成方法

### オプション1: デザインツールで作成

#### Canva（無料・簡単）
1. [Canva](https://www.canva.com/)にアクセス
2. カスタムサイズで「1200 × 630 px」を指定
3. テンプレートまたは白紙から作成
4. 以下の要素を含めることを推奨：
   - アプリ名: 「クリプレこうかんや」
   - キャッチコピー: 「想いを伝えるプレゼント交換」
   - ビジュアル: プレゼントボックスやクリスマスのイメージ
   - ブランドカラー: #C41E3A（クリスマスレッド）
5. PNG形式でダウンロード

#### Figma（デザイナー向け）
1. 新規フレームを1200×630pxで作成
2. デザインを作成
3. Export → PNG → 2x でエクスポート

### オプション2: 既存のロゴを最適化

もし現在の`logo.png`がOGP用として適切でない場合：

```bash
# ImageMagickを使用してリサイズ（Macの場合）
brew install imagemagick
convert logo.png -resize 1200x630 -background white -gravity center -extent 1200x630 ogp-image.png
```

## 📝 OGP画像の配置

作成したOGP画像を以下のディレクトリに配置：

```
/public/images/logo.png
```

または、別名で保存した場合は`src/app/layout.tsx`を更新：

```typescript
openGraph: {
  images: [
    {
      url: "/images/your-custom-ogp-image.png",  // ← ファイル名を変更
      width: 1200,
      height: 630,
      alt: "Holiday Gift Exchanger",
    },
  ],
  // ...
},
twitter: {
  images: ["/images/your-custom-ogp-image.png"],  // ← ファイル名を変更
  // ...
},
```

## 🐦 Twitterカードの設定

### Twitterハンドルの更新

`src/app/layout.tsx`の以下の部分を更新してください：

```typescript
twitter: {
  card: "summary_large_image",
  title: "ホリデーギフト交換 | Holiday Gift Exchanger",
  description: "ホリデーシーズンのプレゼント交換をもっと楽しく！想いを伝えられる新しいプレゼント交換アプリ。",
  images: ["/images/logo.png"],
  creator: "@your_twitter_handle",  // ← ここを実際のTwitterハンドルに変更
},
```

例：
```typescript
creator: "@gift_exchanger",  // アカウント名が @gift_exchanger の場合
```

Twitterアカウントがない場合は、この行を削除してもOKです：
```typescript
twitter: {
  card: "summary_large_image",
  title: "クリプレこうかんや | Holiday Gift Exchanger",
  description: "ホリデーシーズンのプレゼント交換をもっと楽しく！想いを伝えられる新しいプレゼント交換アプリ。",
  images: ["/images/logo.png"],
  // creator行を削除
},
```

## ✅ OGPの動作確認

### テストツール

デプロイ後、以下のツールで確認：

#### 1. Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- デプロイ後のURLを入力して「Preview card」をクリック

#### 2. Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- デプロイ後のURLを入力して「デバッグ」をクリック

#### 3. LinkedIn Post Inspector
- URL: https://www.linkedin.com/post-inspector/
- デプロイ後のURLを入力

### ローカルでの確認

開発環境でOGPタグを確認：

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
# 右クリック → 「ページのソースを表示」
# <meta property="og:image" /> タグを確認
```

## 🎯 チェックリスト

OGP設定が完了したら、以下を確認：

- [ ] OGP画像が1200×630pxで作成されている
- [ ] 画像が`/public/images/`に配置されている
- [ ] `layout.tsx`で画像パスが正しく設定されている
- [ ] Twitterハンドルが更新されている（またはcreator行が削除されている）
- [ ] デプロイ後、Twitter Card Validatorで確認
- [ ] デプロイ後、Facebook Sharing Debuggerで確認
- [ ] モバイルデバイスでシェアした際の表示を確認

## 🎨 デザインのヒント

### 含めるべき情報
- **アプリ名**: 大きく目立つように
- **キャッチコピー**: 短く魅力的に
- **ビジュアル**: プレゼント、クリスマス、交換のイメージ
- **ブランドカラー**: #C41E3A（赤）、#0F8B3A（緑）

### 避けるべきこと
- 小さすぎる文字（モバイルで読めない）
- 複雑すぎるデザイン（縮小すると見づらい）
- 重要な情報を端に配置（トリミングされる可能性）

## 📱 ファビコンの確認

ファビコンも確認してください：

現在のファビコン設定：
- `/public/favicon.svg` - メインのファビコン
- `/public/favicon.ico` - 旧ブラウザ用

ファビコンを変更する場合：
1. 新しいファビコンを上記のパスに配置
2. SVG形式が推奨（ベクター形式でスケーラブル）
3. サイズ: 32×32px または 16×16px

## 🔄 キャッシュのクリア

OGP画像を更新した後、SNSのキャッシュをクリア：

### Twitter
- Card Validatorで再度URLを入力すると自動的にキャッシュ更新

### Facebook
- Sharing Debuggerで「再度スクレイピング」ボタンをクリック

### LinkedIn
- Post Inspectorで再度URLを入力

---

**最終更新**: 2025年12月18日

