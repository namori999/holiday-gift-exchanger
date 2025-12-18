'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRoomContext } from '@/contexts/RoomContext';
import { updateEventStatus, saveExchanges } from '@/lib/database';
import { generateExchanges, shuffleExchanges } from '@/lib/derangement';

interface Props {
  onPresentInput: () => void;
  onStartExchange: () => void;
  roomId: string;
  userId: string;
}

export default function MCWaitingScreen({ onPresentInput, onStartExchange, roomId, userId }: Props) {
  const { users, gifts, allUsersCompleted, loading, getUser } = useRoomContext();
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  // MCの入力状態を取得
  const mcUser = getUser(userId);
  const mcHasCompleted = mcUser?.hasCompletedInput || false;

  // プレゼント交換を開始
  const handleStartExchange = async () => {
    console.log('🎬 MC: プレゼント交換開始ボタン押下');
    setStarting(true);
    try {
      // 1. 完全順列アルゴリズムで交換結果を生成
      console.log('📝 MC: 交換結果を生成中...', { userCount: users.length, giftCount: gifts.length });
      const exchanges = generateExchanges(users, gifts);
      console.log('✅ MC: 交換結果生成完了', exchanges);

      // 2. 発表順序をランダムにシャッフル
      const shuffledExchanges = shuffleExchanges(exchanges);
      console.log('🔀 MC: シャッフル完了');

      // 3. Firebaseに保存
      console.log('💾 MC: Firebaseに交換結果を保存中...');
      await saveExchanges(roomId, shuffledExchanges);
      console.log('✅ MC: 交換結果保存完了');

      // 4. イベントステータスを'exchange'に更新
      console.log('🔄 MC: イベントステータスをexchangeに更新中...');
      await updateEventStatus(roomId, 'exchange');
      console.log('✅ MC: イベントステータス更新完了');

      // 5. 次の画面へ
      console.log('➡️ MC: Santa画面へ遷移');
      onStartExchange();
    } catch (error) {
      console.error('❌ プレゼント交換開始エラー:', error);
      alert('エラーが発生しました。もう一度お試しください。');
      setStarting(false);
    }
  };

  // ルームURLを生成
  const roomUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?room=${roomId}`
    : '';

  // URLをコピー
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* メンバーにURLを共有してください */}
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        メンバーにURLを共有してください
      </div>

      {/* URLエリア */}
      <div style={{
        width: '100%',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        marginBottom: '20px',
        wordBreak: 'break-all',
        fontSize: '14px',
        color: '#333'
      }}>
        {roomUrl}
      </div>

      {/* URLをコピー */}
      <button
        onClick={handleCopyUrl}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '30px',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: 'none',
          width: '100%'
        }}
      >
        <div style={{
          fontSize: '24px',
          color: '#fff'
        }}>
          {copied ? '✓' : '📋'}
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          {copied ? 'コピーしました！' : 'URLをコピー'}
        </div>
      </button>

      {/* 自分もプレゼントを入力する */}
      {!mcHasCompleted && (
        <button
          onClick={onPresentInput}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: '#ED1713',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '40px',
            minHeight: '64px'
          }}
        >
          自分もプレゼントを入力する
        </button>
      )}
      {mcHasCompleted && (
        <div style={{
          width: '100%',
          padding: '20px',
          backgroundColor: '#c8e6c9',
          border: 'none',
          borderRadius: '50px',
          color: '#2e7d32',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '40px',
          minHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          ✓ プレゼント情報を入力済み
        </div>
      )}

      {/* 参加中のメンバー */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '20px'
      }}>
        参加中のメンバー ({users.length}人)
      </div>

      {/* 参加者リスト */}
      {loading ? (
        <div style={{
          color: '#fff',
          textAlign: 'center',
          padding: '20px'
        }}>
          読み込み中...
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: user.hasCompletedInput ? '#c8e6c9' : '#f0f0f0',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>
                {user.name} {user.isMC && '👑'}
              </span>
              <span style={{
                fontSize: '12px',
                color: user.hasCompletedInput ? '#2e7d32' : '#999'
              }}>
                {user.hasCompletedInput ? '✓ 入力済み' : '未入力'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* プレゼント交換を始めるボタン（画面下部固定） */}
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
          onClick={handleStartExchange}
          disabled={!allUsersCompleted || users.length < 2 || starting}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: allUsersCompleted && users.length >= 2 && !starting ? '#ED1713' : '#999',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: allUsersCompleted && users.length >= 2 && !starting ? 'pointer' : 'not-allowed',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {starting ? '準備中...' : '🎁 プレゼント交換を始める'}
        </button>
        {!allUsersCompleted && users.length >= 2 && (
          <div style={{
            textAlign: 'center',
            color: '#999',
            fontSize: '12px',
            marginTop: '8px'
          }}>
            全員の入力が完了したら開始できます
          </div>
        )}
        {users.length < 2 && (
          <div style={{
            textAlign: 'center',
            color: '#999',
            fontSize: '12px',
            marginTop: '8px'
          }}>
            参加者が2人以上必要です
          </div>
        )}
      </div>
    </div>
  );
}

