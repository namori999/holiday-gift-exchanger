'use client';

import { useState } from 'react';
import Image from 'next/image';
import { addUserToRoom } from '@/lib/database';

interface Props {
  onNext: (userId: string) => void;
  roomId: string;
}

export default function ParticipantJoinScreen({ onNext, roomId }: Props) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinRoom = async () => {
    if (!nickname.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 参加前に古いデータを確実にクリア
      const savedRoomId = localStorage.getItem('roomId');
      if (savedRoomId && savedRoomId !== roomId) {
        console.log('🧹 参加前に古いルームデータをクリア');
        localStorage.clear();
      }

      const userId = await addUserToRoom(roomId, nickname.trim());
      onNext(userId);
    } catch (err) {
      console.error('ルーム参加エラー:', err);
      setError('ルームへの参加に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      {/* ロゴ */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        height: '200px',
        position: 'relative',
        marginBottom: '60px'
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

      {/* コンテンツエリア */}
      <div style={{
        width: '100%',
        maxWidth: '500px'
      }}>
        {/* 説明テキスト */}
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          ニックネームを入力
        </div>

        {/* ニックネームラベル */}
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '16px'
        }}>
          ニックネーム
        </div>

        {/* 入力フィールド */}
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{
            width: '100%',
            padding: '20px 24px',
            backgroundColor: '#d9d9d9',
            border: 'none',
            borderRadius: '50px',
            fontSize: '16px',
            marginBottom: '40px',
            outline: 'none'
          }}
        />

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

        {/* ルームに参加ボタン */}
        <button
          onClick={handleJoinRoom}
          disabled={!nickname.trim() || loading}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: nickname.trim() && !loading ? '#ED1713' : '#999',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: nickname.trim() && !loading ? 'pointer' : 'not-allowed',
            minHeight: '64px'
          }}
        >
          {loading ? '参加中...' : 'ルームに参加'}
        </button>
      </div>
    </div>
  );
}

