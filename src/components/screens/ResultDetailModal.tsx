'use client';

import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  giver: string;
  receiver: string;
  title: string;
  reason: string;
  recommendation?: string;
  giftImageIndex: number;
}

export default function ResultDetailModal({
  isOpen,
  onClose,
  giver,
  receiver,
  title,
  reason,
  recommendation,
  giftImageIndex
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.8)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        {/* ロゴ（背景に表示） */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '150px',
          height: '50px'
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

        {/* モーダルコンテンツ */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            padding: '30px 20px',
            position: 'relative'
          }}
        >
          {/* 参加者名 ▶ 参加者名へ */}
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#ED1713',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '2px solid #ED1713',
            borderRadius: '999px',
            padding: '6px 14px',
            width: 'fit-content'
          }}>
            <span>{giver}</span>
            <span style={{ fontSize: '12px' }}>▶</span>
            <span>{receiver}へ</span>
          </div>

          {/* プレゼントイラスト */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            marginBottom: '24px'
          }}>
            <Image
              src={`/images/gift-${(giftImageIndex % 4) + 1}.png`}
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
            color: '#000',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            {title}
          </div>

          {/* 選んだポイント */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '12px'
            }}>
              選んだポイント
            </div>
            <div style={{
              fontSize: '15px',
              color: '#000',
              lineHeight: '1.8'
            }}>
              {reason}
            </div>
          </div>

          {/* おすすめの使い方など */}
          {recommendation && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '12px'
              }}>
                おすすめの使い方など
              </div>
              <div style={{
                fontSize: '15px',
                color: '#000',
                lineHeight: '1.8'
              }}>
                {recommendation}
              </div>
            </div>
          )}

          {/* 閉じるボタン */}
          <div style={{
            textAlign: 'center'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '16px 48px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#000',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

