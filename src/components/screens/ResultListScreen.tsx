'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRoomContext } from '@/contexts/RoomContext';
import ResultDetailModal from './ResultDetailModal';

export default function ResultListScreen() {
  const { exchanges, getUser, getGift, loading } = useRoomContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // データが揃っているかチェック
  const isReady = !loading && exchanges.length > 0;

  // データ読み込み中は何も表示しない
  if (!isReady) {
    return null;
  }

  // 交換結果を配列に変換
  const results = exchanges.map(exchange => {
    const giver = getUser(exchange.giverId);
    const receiver = getUser(exchange.receiverId);
    const gift = getGift(exchange.giftId);

    return {
      giver: giver?.name || '参加者',
      receiver: receiver?.name || '参加者',
      title: gift?.title || 'プレゼント',
      reason: gift?.reason || '',
      recommendation: gift?.recommendation || ''
    };
  });

  return (
    <div className="screen-container" style={{
      padding: '20px'
    }}>
      {/* ロゴ */}
      <div style={{
        width: '150px',
        height: '50px',
        position: 'relative',
        marginBottom: '40px'
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

      {/* みんなのプレゼント */}
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        みんなのプレゼント
      </div>

      {/* 結果リスト */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {results.map((result, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setIsModalOpen(true);
            }}
            style={{
              backgroundColor: '#f0f0f0',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer'
            }}
          >
            {/* プレゼントイラスト */}
            <div style={{
              width: '100px',
              height: '100px',
              position: 'relative',
              flexShrink: 0
            }}>
              <Image
                src={`/images/gift-${(index % 4) + 1}.png`}
                alt="プレゼント"
                fill
                style={{
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* テキスト情報 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 参加者名 ▶ 参加者名へ */}
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#ED1713',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1.5px solid #ED1713',
                borderRadius: '999px',
                padding: '4px 10px',
                width: 'fit-content'
              }}>
                <span>{result.giver}</span>
                <span style={{ fontSize: '10px' }}>▶</span>
                <span>{result.receiver}へ</span>
              </div>

              {/* プレゼントタイトル */}
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000',
                lineHeight: '1.4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {result.title}
              </div>
            </div>

            {/* 右矢印 */}
            <div style={{
              fontSize: '24px',
              color: '#999',
              flexShrink: 0
            }}>
              ›
            </div>
          </div>
        ))}
      </div>

      {/* 詳細モーダル */}
      {results[selectedIndex] && (
        <ResultDetailModal
          isOpen={isModalOpen}
          giver={results[selectedIndex].giver}
          receiver={results[selectedIndex].receiver}
          title={results[selectedIndex].title}
          reason={results[selectedIndex].reason}
          recommendation={results[selectedIndex].recommendation}
          giftImageIndex={selectedIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

