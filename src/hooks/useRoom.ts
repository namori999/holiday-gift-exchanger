/**
 * ルーム管理のカスタムフック
 */

import { useState, useEffect } from 'react';
import { subscribeToRoom } from '@/lib/database';
import type { RoomData, User, Gift, Exchange, Event } from '@/types';

export function useRoom(roomId: string | null) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToRoom(roomId, (data) => {
        console.log('📡 Firebase更新受信:', {
          roomId,
          status: data?.event?.status,
          currentIndex: data?.event?.currentExchangeIndex,
          exchangeCount: data?.exchanges ? Object.keys(data.exchanges).length : 0
        });
        setRoomData(data);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [roomId]);

  // ユーザーリストを配列で取得
  const users = roomData?.users ? Object.values(roomData.users) : [];

  // プレゼントリストを配列で取得
  const gifts = roomData?.gifts ? Object.values(roomData.gifts) : [];

  // 交換結果リストを配列で取得
  const exchanges = roomData?.exchanges ? Object.values(roomData.exchanges) : [];

  // MC情報を取得
  const mc = users.find((user) => user.isMC) || null;

  // 全員が入力完了しているかチェック
  const allUsersCompleted = users.length > 0 && users.every((user) => user.hasCompletedInput);

  // 特定のユーザーを取得
  const getUser = (userId: string): User | null => {
    return roomData?.users?.[userId] || null;
  };

  // 特定のプレゼントを取得
  const getGift = (giftId: string): Gift | null => {
    return roomData?.gifts?.[giftId] || null;
  };

  // ユーザーIDからプレゼントを取得
  const getGiftByGiverId = (giverId: string): Gift | null => {
    return gifts.find((gift) => gift.giverId === giverId) || null;
  };

  // 交換結果から受け取り手を取得
  const getReceiverByGiftId = (giftId: string): User | null => {
    const exchange = exchanges.find((ex) => ex.giftId === giftId);
    return exchange ? getUser(exchange.receiverId) : null;
  };

  return {
    roomData,
    event: roomData?.event || null,
    users,
    gifts,
    exchanges,
    mc,
    allUsersCompleted,
    loading,
    error,
    getUser,
    getGift,
    getGiftByGiverId,
    getReceiverByGiftId,
  };
}

