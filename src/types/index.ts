/**
 * データモデル定義
 */

// ユーザー（参加者）
export interface User {
  id: string;
  name: string;
  isMC: boolean;
  hasCompletedInput: boolean;
  createdAt: number; // timestamp
}

// プレゼント
export interface Gift {
  id: string;
  giverId: string; // User.id
  title: string;
  reason: string; // 選んだ理由
  recommendation?: string; // おすすめの使い方
  createdAt: number; // timestamp
}

// 交換結果
export interface Exchange {
  id: string;
  giverId: string; // User.id
  receiverId: string; // User.id
  giftId: string; // Gift.id
  revealedAt?: number; // timestamp
}

// イベント（ルーム）
export type EventStatus = 'registration' | 'input' | 'exchange' | 'completed';

export interface Event {
  id: string;
  status: EventStatus;
  currentExchangeIndex: number; // 現在表示中のプレゼントのインデックス
  createdAt: number; // timestamp
  mcId?: string; // MC のユーザーID
}

// Firebaseのデータ構造
export interface RoomData {
  event: Event;
  users: { [userId: string]: User };
  gifts: { [giftId: string]: Gift };
  exchanges: { [exchangeId: string]: Exchange };
}

