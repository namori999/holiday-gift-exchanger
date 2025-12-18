'use client';

import { useState } from 'react';
import Image from 'next/image';
import { saveGift } from '@/lib/database';

interface Props {
  onNext: () => void;
  roomId: string;
  userId: string;
}

export default function PresentInputScreen({ onNext, roomId, userId }: Props) {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleMaxLength = 20;
  const reasonMaxLength = 50;
  const recommendationMaxLength = 50;

  const isValid = title.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      await saveGift(
        roomId,
        userId,
        title.trim(),
        reason.trim(),
        recommendation.trim() || undefined
      );
      onNext();
    } catch (err) {
      console.error('プレゼント情報保存エラー:', err);
      setError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container" style={{
      padding: '20px',
      paddingBottom: '100px'
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

      {/* 説明テキスト */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '12px'
      }}>
        持ってきたプレゼントについて教えてください
      </div>

      <div style={{
        fontSize: '14px',
        color: '#fff',
        marginBottom: '40px'
      }}>
        *マークの項目は必須です
      </div>

      {/* タイトル */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '12px'
        }}>
          タイトル *
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= titleMaxLength) {
              setTitle(e.target.value);
            }
          }}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#d9d9d9',
            border: 'none',
            borderRadius: '50px',
            fontSize: '16px',
            outline: 'none',
            marginBottom: '8px'
          }}
        />
        <div style={{
          textAlign: 'right',
          fontSize: '14px',
          color: '#fff'
        }}>
          {title.length}/{titleMaxLength}
        </div>
      </div>

      {/* 選んだポイント */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '12px'
        }}>
          選んだポイント
        </div>
        <textarea
          value={reason}
          onChange={(e) => {
            if (e.target.value.length <= reasonMaxLength) {
              setReason(e.target.value);
            }
          }}
          style={{
            width: '100%',
            padding: '16px 20px',
            backgroundColor: '#d9d9d9',
            border: 'none',
            borderRadius: '20px',
            fontSize: '16px',
            outline: 'none',
            minHeight: '120px',
            resize: 'none',
            fontFamily: 'inherit',
            marginBottom: '8px'
          }}
        />
        <div style={{
          textAlign: 'right',
          fontSize: '14px',
          color: '#fff'
        }}>
          {reason.length}/{reasonMaxLength}
        </div>
      </div>

      {/* おすすめの使い方など */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '12px'
        }}>
          おすすめの使い方など
        </div>
        <textarea
          value={recommendation}
          onChange={(e) => {
            if (e.target.value.length <= recommendationMaxLength) {
              setRecommendation(e.target.value);
            }
          }}
          style={{
            width: '100%',
            padding: '16px 20px',
            backgroundColor: '#d9d9d9',
            border: 'none',
            borderRadius: '20px',
            fontSize: '16px',
            outline: 'none',
            minHeight: '120px',
            resize: 'none',
            fontFamily: 'inherit',
            marginBottom: '8px'
          }}
        />
        <div style={{
          textAlign: 'right',
          fontSize: '14px',
          color: '#fff'
        }}>
          {recommendation.length}/{recommendationMaxLength}
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div style={{
          color: '#ff6b6b',
          fontSize: '14px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* 決定ボタン（画面下部固定） */}
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
          onClick={handleSubmit}
          disabled={!isValid || loading}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: isValid && !loading ? '#ED1713' : '#999',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: isValid && !loading ? 'pointer' : 'not-allowed',
            minHeight: '64px'
          }}
        >
          {loading ? '保存中...' : '決定'}
        </button>
      </div>
    </div>
  );
}

