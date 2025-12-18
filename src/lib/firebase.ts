import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase設定の検証
function validateFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Firebase環境変数が設定されていません:', missingVars);
    console.error('.env.localファイルを確認してください。');
    return false;
  }

  return true;
}

// Firebase設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseアプリの初期化（既に初期化されている場合は再利用）
let app: FirebaseApp | null = null;
let database: Database | null = null;

export function initializeFirebase() {
  try {
    // 環境変数の検証
    if (!validateFirebaseConfig()) {
      console.warn('⚠️ Firebase設定が不完全です。環境変数を設定してください。');
      return { app: null, database: null };
    }

    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase初期化成功');
    } else {
      app = getApps()[0];
      console.log('✅ 既存のFirebaseアプリを使用');
    }

    database = getDatabase(app);
    return { app, database };
  } catch (error) {
    console.error('❌ Firebase初期化エラー:', error);
    return { app: null, database: null };
  }
}

// データベースインスタンスを取得
export function getDB(): Database | null {
  if (!database) {
    const result = initializeFirebase();
    return result.database;
  }
  return database;
}

export { app, database };

