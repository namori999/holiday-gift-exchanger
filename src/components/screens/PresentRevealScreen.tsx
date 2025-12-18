'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRoomContext } from '@/contexts/RoomContext';

interface Props {
  onNext: () => void;
  roomId: string;
}

export default function PresentRevealScreen({ onNext, roomId }: Props) {
  const { event, exchanges, getUser, loading } = useRoomContext();

  // 現在の交換インデックス
  const currentIndex = event?.currentExchangeIndex || 0;

  // マウント時のログ
  useEffect(() => {
    console.log('🎁 PresentRevealScreen マウント (index:', currentIndex, ')');
    return () => {
      console.log('👋 PresentRevealScreen アンマウント (index:', currentIndex, ')');
    };
  }, [currentIndex]);

  // 現在のプレゼント交換情報
  const currentExchange = exchanges[currentIndex];
  const receiver = currentExchange ? getUser(currentExchange.receiverId) : null;
  const receiverName = receiver?.name || '参加者';

  // データが揃っているかチェック
  const isReady = !loading && exchanges.length > 0 && currentExchange && receiver;

  // データが揃ってから3秒後に自動で次の画面へ
  useEffect(() => {
    if (!isReady) {
      console.log('⏸️ PresentRevealScreen: データ待機中...');
      return;
    }

    console.log('▶️ PresentRevealScreen: アニメーション表示開始 (3秒後に次へ)');
    const timer = setTimeout(() => {
      console.log('⏭️ PresentRevealScreen: 次の画面へ遷移');
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isReady, onNext]);

  // データ読み込み中は何も表示しない（前の画面が表示され続ける）
  if (!isReady) {
    return null;
  }

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

      {/* メインコンテンツ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>
        {/* 参加者のニックネーム！ */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center'
        }}>
          {receiverName}！
        </div>

        {/* サブテキスト */}
        <div style={{
          fontSize: '16px',
          color: '#fff',
          textAlign: 'center',
          lineHeight: '1.8'
        }}>
          君にはこのプレゼントをあげよう！<br />
          メリークリスマス！
        </div>

        {/* サンタアニメーション */}
        <div className="pulse-animation" style={{
          width: '280px',
          height: '280px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image
            src="/images/present_for_you.png"
            alt="プレゼントを贈るサンタクロース"
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

