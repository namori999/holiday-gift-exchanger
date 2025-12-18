'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface Props {
  onNext: () => void;
}

export default function SantaWaitingScreen({ onNext }: Props) {
  // 3秒後に自動で次の画面へ
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

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
        {/* ホ〜ッホッホ... */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center'
        }}>
          ホ〜ッホッホ...
        </div>

        {/* サブテキスト */}
        <div style={{
          fontSize: '16px',
          color: '#fff',
          textAlign: 'center',
          lineHeight: '1.8'
        }}>
          プレゼントを配るぞ〜
        </div>

        {/* サンタアニメーション */}
        <div className="pulse-animation" style={{
          width: '250px',
          height: '250px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image
            src="/images/exchange_start.png"
            alt="プレゼントを持つサンタクロース"
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

