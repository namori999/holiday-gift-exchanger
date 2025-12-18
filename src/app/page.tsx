'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MCRegistrationScreen from '@/components/screens/MCRegistrationScreen';
import MCWaitingScreen from '@/components/screens/MCWaitingScreen';
import ParticipantJoinScreen from '@/components/screens/ParticipantJoinScreen';
import ParticipantWaitingScreen from '@/components/screens/ParticipantWaitingScreen';
import PresentInputScreen from '@/components/screens/PresentInputScreen';
import SantaWaitingScreen from '@/components/screens/SantaWaitingScreen';
import PresentRevealScreen from '@/components/screens/PresentRevealScreen';
import PresentDetailScreen from '@/components/screens/PresentDetailScreen';
import EndingScreen from '@/components/screens/EndingScreen';
import ResultListScreen from '@/components/screens/ResultListScreen';
import { initializeFirebase } from '@/lib/firebase';
import { RoomProvider, useRoomContext } from '@/contexts/RoomContext';

type ScreenType = 'mc' | 'mcWaiting' | 'join' | 'participantWaiting' | 'presentInput' | 'santa' | 'reveal' | 'detail' | 'ending' | 'result';

interface HomeContentProps {
  initialRoomId: string | null;
  onRoomIdChange: (roomId: string) => void;
}

function HomeContent({ initialRoomId, onRoomIdChange }: HomeContentProps) {
  const searchParams = useSearchParams();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('mc');
  const [mode, setMode] = useState<'mc' | 'participant'>('mc');
  const [roomId, setRoomId] = useState<string | null>(initialRoomId);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastExchangeIndex, setLastExchangeIndex] = useState<number>(-1);

  // 全員が同じContextを参照
  const { event } = useRoomContext();

  // roomIdが変わったら親に通知
  useEffect(() => {
    if (roomId) {
      onRoomIdChange(roomId);
    }
  }, [roomId, onRoomIdChange]);

  // URLパラメータからルームIDを取得（HomeContentで処理）
  useEffect(() => {
    const roomIdFromUrl = searchParams.get('room');
    const savedRoomId = localStorage.getItem('roomId');

    if (roomIdFromUrl) {
      // URLにroomIdがある場合（参加者として参加）
      if (savedRoomId && savedRoomId !== roomIdFromUrl) {
        console.log('🧹 古いルームデータをクリア:', savedRoomId, '->', roomIdFromUrl);
        localStorage.clear();
      }

      setRoomId(roomIdFromUrl);
      setCurrentScreen('join');
      setMode('participant');
    } else {
      // URLにroomIdがない場合（MCまたは復元）
      const savedUserId = localStorage.getItem('userId');
      const savedMode = localStorage.getItem('mode') as 'mc' | 'participant' | null;

      if (savedRoomId && savedUserId && savedMode) {
        setRoomId(savedRoomId);
        setUserId(savedUserId);
        setMode(savedMode);
        setCurrentScreen(savedMode === 'mc' ? 'mcWaiting' : 'participantWaiting');
      }
    }
  }, [searchParams]);

  // ルームID・ユーザーID・モードをlocalStorageに保存
  useEffect(() => {
    if (roomId) {
      localStorage.setItem('roomId', roomId);
    }
    if (userId) {
      localStorage.setItem('userId', userId);
    }
    localStorage.setItem('mode', mode);
  }, [roomId, userId, mode]);

  // 参加者側: イベントステータスに基づく自動画面遷移
  useEffect(() => {
    console.log('🔄 useEffect実行:', { mode, hasEvent: !!event });

    if (mode !== 'participant') {
      console.log('⏭️ スキップ: MCモード');
      return;
    }

    if (!event) {
      console.log('⏭️ スキップ: eventなし');
      return;
    }

    const currentIndex = event.currentExchangeIndex ?? 0;

    console.log('🔍 参加者側画面遷移チェック:');
    console.log('  mode:', mode);
    console.log('  event.status:', event.status);
    console.log('  currentIndex:', currentIndex);
    console.log('  lastExchangeIndex:', lastExchangeIndex);
    console.log('  currentScreen:', currentScreen);
    console.log('  条件チェック:');
    console.log('    - exchange中?', event.status === 'exchange');
    console.log('    - index増えた?', currentIndex > lastExchangeIndex, `(${currentIndex} > ${lastExchangeIndex})`);
    console.log('    - 詳細/配布画面?', currentScreen === 'detail' || currentScreen === 'reveal', `(${currentScreen})`);

    // イベントステータスが'exchange'になったら交換画面へ
    if (event.status === 'exchange' && currentScreen === 'participantWaiting') {
      console.log('✅ 交換画面へ遷移');
      setLastExchangeIndex(-1);
      setCurrentScreen('santa');
      return;
    }

    // 交換中にインデックスが変更されたら配布アニメーション画面へ
    if (event.status === 'exchange' && currentIndex > lastExchangeIndex &&
        (currentScreen === 'detail' || currentScreen === 'reveal')) {
      console.log('✅ 次のプレゼント配布アニメーション画面へ (index:', lastExchangeIndex, '->', currentIndex, ')');
      console.log('   currentScreen:', currentScreen, '-> reveal');
      setLastExchangeIndex(currentIndex);
      setCurrentScreen('reveal');
      return;
    }

    // イベントステータスが'completed'になったら結果画面へ
    if (event.status === 'completed' && currentScreen !== 'result') {
      console.log('✅ 結果画面へ遷移');
      setCurrentScreen('result');
      return;
    }

    console.log('❌ どの条件にも合致せず');
  }, [event?.status, event?.currentExchangeIndex, mode, currentScreen, lastExchangeIndex]);

  return (
    <div className="mobile-container">
      {/* モード切り替え（開発用） */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        backgroundColor: '#222',
        padding: '8px',
        display: 'flex',
        gap: '8px',
        zIndex: 1001,
        justifyContent: 'center'
      }}>
        <button
          onClick={() => {
            setMode('mc');
            setCurrentScreen('mc');
          }}
          style={{
            padding: '8px 24px',
            backgroundColor: mode === 'mc' ? '#0066cc' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          MCモード
        </button>
        <button
          onClick={() => {
            setMode('participant');
            setCurrentScreen('join');
          }}
          style={{
            padding: '8px 24px',
            backgroundColor: mode === 'participant' ? '#0066cc' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          参加者モード
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            setRoomId(null);
            setUserId(null);
            setMode('mc');
            setCurrentScreen('mc');
            window.location.reload();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🔄
        </button>
      </div>

      {/* 画面切り替えナビゲーション（開発用） */}
      <div style={{
        position: 'fixed',
        top: '52px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        backgroundColor: '#333',
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: mode === 'mc' ? 'repeat(7, 1fr)' : 'repeat(8, 1fr)',
        gap: '4px',
        zIndex: 1000
      }}>
        {mode === 'mc' ? (
          <>
            <button
              onClick={() => setCurrentScreen('mc')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'mc' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              登録
            </button>
            <button
              onClick={() => setCurrentScreen('mcWaiting')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'mcWaiting' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              待機
            </button>
            <button
              onClick={() => setCurrentScreen('presentInput')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'presentInput' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              入力
            </button>
            <button
              onClick={() => setCurrentScreen('santa')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'santa' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              開始
            </button>
            <button
              onClick={() => setCurrentScreen('reveal')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'reveal' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              配布
            </button>
            <button
              onClick={() => setCurrentScreen('detail')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'detail' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              詳細
            </button>
            <button
              onClick={() => setCurrentScreen('result')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'result' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              結果
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentScreen('join')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'join' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              参加
            </button>
            <button
              onClick={() => setCurrentScreen('presentInput')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'presentInput' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              入力
            </button>
            <button
              onClick={() => setCurrentScreen('participantWaiting')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'participantWaiting' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              待機
            </button>
            <button
              onClick={() => setCurrentScreen('santa')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'santa' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              開始
            </button>
            <button
              onClick={() => setCurrentScreen('reveal')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'reveal' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              配布
            </button>
            <button
              onClick={() => setCurrentScreen('detail')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'detail' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              詳細
            </button>
            <button
              onClick={() => setCurrentScreen('ending')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'ending' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              終了
            </button>
            <button
              onClick={() => setCurrentScreen('result')}
              style={{
                padding: '8px 4px',
                backgroundColor: currentScreen === 'result' ? '#666' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                whiteSpace: 'nowrap'
              }}
            >
              結果
            </button>
          </>
        )}
      </div>

      <div style={{ paddingTop: '104px' }}>
        {currentScreen === 'mc' && (
          <MCRegistrationScreen
            onNext={(newRoomId, newUserId) => {
              // 古いデータをクリア
              localStorage.clear();
              // 新しいデータをセット
              setRoomId(newRoomId);
              setUserId(newUserId);
              setCurrentScreen('mcWaiting');
            }}
          />
        )}
        {currentScreen === 'mcWaiting' && roomId && userId && (
          <MCWaitingScreen
            roomId={roomId}
            userId={userId}
            onPresentInput={() => setCurrentScreen('presentInput')}
            onStartExchange={() => setCurrentScreen('santa')}
          />
        )}
        {currentScreen === 'join' && roomId && (
          <ParticipantJoinScreen
            roomId={roomId}
            onNext={(newUserId) => {
              // 新規参加時は古いデータをクリア
              localStorage.removeItem('userId');
              localStorage.removeItem('mode');
              setUserId(newUserId);
              setMode('participant');
              setCurrentScreen('presentInput');
            }}
          />
        )}
        {currentScreen === 'presentInput' && roomId && userId && (
          <PresentInputScreen
            roomId={roomId}
            userId={userId}
            onNext={() => setCurrentScreen(mode === 'mc' ? 'mcWaiting' : 'participantWaiting')}
          />
        )}
        {currentScreen === 'participantWaiting' && roomId && (
          <ParticipantWaitingScreen
            roomId={roomId}
            onNext={() => setCurrentScreen('santa')}
          />
        )}
        {currentScreen === 'santa' && roomId && (
          <SantaWaitingScreen onNext={() => setCurrentScreen('reveal')} />
        )}
        {currentScreen === 'reveal' && roomId && (
          <PresentRevealScreen
            key={event?.currentExchangeIndex ?? 0}
            roomId={roomId}
            onNext={() => setCurrentScreen('detail')}
          />
        )}
        {currentScreen === 'detail' && roomId && (
          <PresentDetailScreen
            roomId={roomId}
            isMC={mode === 'mc'}
            onNext={() => setCurrentScreen('reveal')}
            onComplete={() => setCurrentScreen('result')}
          />
        )}
        {currentScreen === 'ending' && (
          <EndingScreen onNext={() => setCurrentScreen('result')} />
        )}
        {currentScreen === 'result' && (
          <ResultListScreen />
        )}
      </div>
    </div>
  );
}

// RoomProviderでラップして全コンポーネントに同じデータを配信
export default function Home() {
  const [roomId, setRoomId] = useState<string | null>(null);

  // Firebase初期化
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <RoomProvider roomId={roomId}>
      <Suspense fallback={<div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>読み込み中...</div>}>
        <HomeContent
          initialRoomId={roomId}
          onRoomIdChange={setRoomId}
        />
      </Suspense>
    </RoomProvider>
  );
}
