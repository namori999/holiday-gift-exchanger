'use client';

import { useState, useEffect } from 'react';

interface Props {
  onNext: () => void;
}

export default function EndingScreen({ onNext }: Props) {
  const [present] = useState({
    giverName: '参加者名',
    receiverName: '参加者名',
    title: 'プレゼントタイトルタイトルタイトル',
    reason: '選んだポイントテキスト選んだポイントテキスト選んだポイントテキスト選んだポイントテキスト選んだポイントテキスト。',
    recommendation: 'おすすめの使い方テキストおすすめの使い方テキストおすすめの使い方テキストおすすめの使い方テキストおすすめの使い方テキスト。'
  });

  useEffect(() => {
    // 3秒後に自動で次の画面へ
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="screen-container" style={{
      padding: '20px',
      paddingBottom: '20px'
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
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>{present.giverName}</span>
        <span style={{ fontSize: '14px' }}>▶</span>
        <span>{present.receiverName}へ</span>
      </div>

      {/* イラスト */}
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#d9d9d9',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#666',
        fontWeight: 'bold',
        marginBottom: '30px'
      }}>
        イラスト
      </div>

      {/* プレゼントタイトル */}
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#000',
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
          color: '#000',
          marginBottom: '16px'
        }}>
          選んだポイント
        </div>
        <div style={{
          fontSize: '15px',
          color: '#000',
          lineHeight: '1.8'
        }}>
          {present.reason}
        </div>
      </div>

      {/* おすすめの使い方など */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '16px'
        }}>
          おすすめの使い方など
        </div>
        <div style={{
          fontSize: '15px',
          color: '#000',
          lineHeight: '1.8'
        }}>
          {present.recommendation}
        </div>
      </div>
    </div>
  );
}

