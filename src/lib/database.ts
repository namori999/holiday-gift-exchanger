/**
 * Firebase Realtime Database のデータアクセス層
 */

import { ref, set, get, update, remove, onValue, off, push } from 'firebase/database';
import { getDB } from './firebase';
import type { Event, User, Gift, Exchange, RoomData } from '@/types';

// ルームのパス
const getRoomPath = (roomId: string) => `rooms/${roomId}`;

/**
 * 新しいルームを作成
 */
export async function createRoom(mcName: string): Promise<{ roomId: string; userId: string }> {
  const db = getDB();
  const roomsRef = ref(db, 'rooms');
  const newRoomRef = push(roomsRef);
  const roomId = newRoomRef.key!;

  const mcId = `user_${Date.now()}`;

  const initialData: RoomData = {
    event: {
      id: roomId,
      status: 'registration',
      currentExchangeIndex: 0,
      createdAt: Date.now(),
      mcId,
    },
    users: {
      [mcId]: {
        id: mcId,
        name: mcName,
        isMC: true,
        hasCompletedInput: false,
        createdAt: Date.now(),
      },
    },
    gifts: {},
    exchanges: {},
  };

  await set(newRoomRef, initialData);
  return { roomId, userId: mcId };
}

/**
 * ルームにユーザーを追加
 */
export async function addUserToRoom(roomId: string, userName: string): Promise<string> {
  const db = getDB();
  const userId = `user_${Date.now()}`;

  const newUser: User = {
    id: userId,
    name: userName,
    isMC: false,
    hasCompletedInput: false,
    createdAt: Date.now(),
  };

  await set(ref(db, `${getRoomPath(roomId)}/users/${userId}`), newUser);
  return userId;
}

/**
 * プレゼント情報を保存
 */
export async function saveGift(
  roomId: string,
  userId: string,
  title: string,
  reason: string,
  recommendation?: string
): Promise<string> {
  const db = getDB();
  const giftId = `gift_${Date.now()}`;

  // recommendationが空の場合はプロパティごと削除
  const gift: Gift = {
    id: giftId,
    giverId: userId,
    title,
    reason,
    createdAt: Date.now(),
    ...(recommendation ? { recommendation } : {}),
  };

  // プレゼント情報を保存
  await set(ref(db, `${getRoomPath(roomId)}/gifts/${giftId}`), gift);

  // ユーザーの入力完了状態を更新
  await update(ref(db, `${getRoomPath(roomId)}/users/${userId}`), {
    hasCompletedInput: true,
  });

  return giftId;
}

/**
 * イベントステータスを更新
 */
export async function updateEventStatus(roomId: string, status: Event['status']) {
  console.log('💾 updateEventStatus 開始:', { roomId, status });
  const db = getDB();
  const path = `${getRoomPath(roomId)}/event`;
  console.log('📍 更新パス:', path);
  await update(ref(db, path), { status });
  console.log('✅ updateEventStatus 完了');
}

/**
 * 現在の交換インデックスを更新
 */
export async function updateCurrentExchangeIndex(roomId: string, index: number) {
  console.log('💾 updateCurrentExchangeIndex 開始:', { roomId, index });
  const db = getDB();
  const path = `${getRoomPath(roomId)}/event`;
  console.log('📍 更新パス:', path);
  await update(ref(db, path), { currentExchangeIndex: index });
  console.log('✅ updateCurrentExchangeIndex 完了');
}

/**
 * プレゼント交換結果を保存
 */
export async function saveExchanges(roomId: string, exchanges: Exchange[]) {
  const db = getDB();
  const exchangesData: { [key: string]: any } = {};

  exchanges.forEach((exchange) => {
    // revealedAtがundefinedの場合はプロパティごと削除
    exchangesData[exchange.id] = {
      id: exchange.id,
      giverId: exchange.giverId,
      receiverId: exchange.receiverId,
      giftId: exchange.giftId,
      ...(exchange.revealedAt ? { revealedAt: exchange.revealedAt } : {}),
    };
  });

  await set(ref(db, `${getRoomPath(roomId)}/exchanges`), exchangesData);
}

/**
 * ルームデータを取得
 */
export async function getRoomData(roomId: string): Promise<RoomData | null> {
  const db = getDB();
  const snapshot = await get(ref(db, getRoomPath(roomId)));
  return snapshot.exists() ? snapshot.val() : null;
}

/**
 * ルームデータの変更を監視
 */
export function subscribeToRoom(
  roomId: string,
  callback: (data: RoomData | null) => void
): () => void {
  const db = getDB();
  const roomRef = ref(db, getRoomPath(roomId));

  onValue(roomRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });

  // クリーンアップ関数を返す
  return () => off(roomRef);
}

