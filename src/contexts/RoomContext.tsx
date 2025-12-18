'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRoom } from '@/hooks/useRoom';
import type { RoomData, User, Gift, Exchange, Event } from '@/types';

interface RoomContextValue {
  roomData: RoomData | null;
  event: Event | null;
  users: User[];
  gifts: Gift[];
  exchanges: Exchange[];
  mc: User | null;
  allUsersCompleted: boolean;
  loading: boolean;
  error: Error | null;
  getUser: (userId: string) => User | null;
  getGift: (giftId: string) => Gift | null;
  getGiftByGiverId: (giverId: string) => Gift | null;
  getReceiverByGiftId: (giftId: string) => User | null;
}

const RoomContext = createContext<RoomContextValue | null>(null);

interface RoomProviderProps {
  roomId: string | null;
  children: ReactNode;
}

export function RoomProvider({ roomId, children }: RoomProviderProps) {
  // 1箇所でFirebaseを監視
  const roomData = useRoom(roomId);

  return (
    <RoomContext.Provider value={roomData}>
      {children}
    </RoomContext.Provider>
  );
}

// カスタムフック：全コンポーネントが同じContextを参照
export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within RoomProvider');
  }
  return context;
}

