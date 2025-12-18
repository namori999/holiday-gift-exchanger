'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRoomContext } from '@/contexts/RoomContext';
import { updateCurrentExchangeIndex, updateEventStatus } from '@/lib/database';

interface Props {
  isMC?: boolean;
  onNext: () => void;
  onComplete: () => void;
  roomId: string;
}

export default function PresentDetailScreen({ isMC = false, onNext, onComplete, roomId }: Props) {
  const { event, exchanges, getUser, getGift, loading: dataLoading } = useRoomContext();
  const [loading, setLoading] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  // 現在の交換インデックス
  const currentIndex = event?.currentExchangeIndex || 0;

  // 現在のプレゼント交換情報
  const currentExchange = exchanges[currentIndex];
  const giver = currentExchange ? getUser(currentExchange.giverId) : null;
  const receiver = currentExchange ? getUser(currentExchange.receiverId) : null;
  const gift = currentExchange ? getGift(currentExchange.giftId) : null;

  // データが揃っているかチェック
  const isReady = !dataLoading && exchanges.length > 0 && currentExchange && giver && receiver && gift;

  // データ読み込み中、または非表示中は何も表示しない
  if (!isReady || isHiding) {
    return null;
  }

  const present = {
    giverName: giver?.name || '参加者名',
    receiverName: receiver?.name || '参加者名',
    title: gift?.title || 'プレゼントタイトル',
    reason: gift?.reason || '選んだポイント',
    recommendation: gift?.recommendation || ''
  };

  // 次のプレゼントへ進む
  const handleNext = async () => {
    if (!isMC) return;

    // まず画面を非表示にする（ネタバレ防止）
    setIsHiding(true);
    setLoading(true);

    try {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= exchanges.length) {
        // 全員分終了 → 結果画面へ
        console.log('🏁 MC: 全プレゼント配布完了 → completed');
        await updateEventStatus(roomId, 'completed');
        onComplete();
      } else {
        // 次のプレゼントへ
        console.log('➡️ MC: 次のプレゼントへ (index:', currentIndex, '->', nextIndex, ')');
        await updateCurrentExchangeIndex(roomId, nextIndex);
        console.log('✅ MC: Firebaseのindex更新完了');
        // 少し待ってから画面遷移（アニメーションのため）
        setTimeout(() => {
          console.log('🔄 MC: reveal画面へ遷移');
          onNext();
        }, 100);
      }
    } catch (error) {
      console.error('次のプレゼントへの進行エラー:', error);
      alert('エラーが発生しました。もう一度お試しください。');
      setIsHiding(false);
      setLoading(false);
    }
  };

  return (
    <div className="screen-container" style={{
      padding: '20px',
      paddingBottom: isMC ? '120px' : '20px'
    }}>
      {/* ロゴ */}
      <div style={{
        width: '150px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        <img
          src="/images/logo.png"
          alt="クリプレこうかんや"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* 参加者名 ▶ 参加者名へ */}
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        border: '2px solid #fff',
        borderRadius: '999px',
        padding: '6px 14px',
        width: 'fit-content'
      }}>
        <span>{present.giverName}</span>
        <span style={{ fontSize: '12px' }}>▶</span>
        <span>{present.receiverName}へ</span>
      </div>

      {/* プレゼントイラスト */}
      <div style={{
        width: '200px',
        height: '200px',
        position: 'relative',
        marginBottom: '30px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Image
          src={`/images/gift-${(currentIndex % 4) + 1}.png`}
          alt="プレゼント"
          fill
          style={{
            objectFit: 'contain'
          }}
        />
      </div>

      {/* プレゼントタイトル */}
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '40px',
        lineHeight: '1.5'
      }}>
        {present.title}
      </div>

      {/* 選んだポイント */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '16px'
        }}>
          選んだポイント
        </div>
        <div style={{
          fontSize: '15px',
          color: '#fff',
          lineHeight: '1.8'
        }}>
          {present.reason}
        </div>
      </div>

      {/* おすすめの使い方など */}
      {present.recommendation && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '16px'
          }}>
            おすすめの使い方など
          </div>
          <div style={{
            fontSize: '15px',
            color: '#fff',
            lineHeight: '1.8'
          }}>
            {present.recommendation}
          </div>
        </div>
      )}

      {/* MC専用: 進行ボタン（画面下部固定） */}
      {isMC && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          padding: '20px',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)'
        }}>
          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: loading ? '#999' : '#ED1713',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              minHeight: '64px'
            }}
          >
            {loading ? '処理中...' : (currentIndex >= exchanges.length - 1 ? '交換結果画面へ' : '次のプレゼント')}
          </button>
        </div>
      )}
    </div>
  );
}

