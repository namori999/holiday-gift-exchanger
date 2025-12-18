'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRoomContext } from '@/contexts/RoomContext';

interface Props {
  onNext: () => void;
  roomId: string;
}

export default function ParticipantWaitingScreen({ onNext, roomId }: Props) {
  const { event } = useRoomContext();

  // イベントステータスが'exchange'になったら次の画面へ
  useEffect(() => {
    if (event?.status === 'exchange') {
      onNext();
    }
  }, [event?.status, onNext]);

  return (
    <div className="screen-container" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ロゴ */}
      <div style={{
        width: '150px',
        height: '50px',
        position: 'relative',
        marginBottom: '100px'
      }}>
        <Image
          src="/images/logo.png"
          alt="クリプレこうかんや"
          fill
          style={{
            objectFit: 'contain'
          }}
        />
      </div>

      {/* 待機メッセージとローディング */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '60px'
      }}>
        {/* メッセージ */}
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center'
        }}>
          MCがスタートするまでお待ちください...
        </div>

        {/* ローディングアニメーション - サンタ */}
        <div className="pulse-animation" style={{
          width: '200px',
          height: '280px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image
            src="/images/loading.png"
            alt="サンタクロース"
            fill
            style={{
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    </div>
  );
}

