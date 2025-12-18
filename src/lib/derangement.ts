/**
 * 完全順列（Derangement）アルゴリズム
 * 自分のプレゼントが自分に当たらないようにランダムに配布する
 */

import type { User, Gift, Exchange } from '@/types';

/**
 * Fisher-Yates シャッフルアルゴリズム
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 完全順列かどうかをチェック
 * （自分のプレゼントが自分に当たっていないか）
 */
function isDerangement(givers: User[], receivers: User[]): boolean {
  return givers.every((giver, index) => giver.id !== receivers[index].id);
}

/**
 * 完全順列を生成（最大100回試行）
 */
function generateDerangement(users: User[]): User[] {
  if (users.length < 2) {
    throw new Error('最低2人以上の参加者が必要です');
  }

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const shuffled = shuffle(users);
    if (isDerangement(users, shuffled)) {
      return shuffled;
    }
    attempts++;
  }

  throw new Error('完全順列の生成に失敗しました。参加者数を確認してください。');
}

/**
 * プレゼント交換の組み合わせを生成
 */
export function generateExchanges(users: User[], gifts: Gift[]): Exchange[] {
  // プレゼントを持っているユーザーのみを対象
  const givers = users.filter((user) =>
    gifts.some((gift) => gift.giverId === user.id)
  );

  if (givers.length < 2) {
    throw new Error('プレゼントを入力した参加者が2人以上必要です');
  }

  // 完全順列で受け取り手を決定
  const receivers = generateDerangement(givers);

  // 交換結果を生成
  const exchanges: Exchange[] = givers.map((giver, index) => {
    const receiver = receivers[index];
    const gift = gifts.find((g) => g.giverId === giver.id)!;

    return {
      id: `exchange_${giver.id}_${receiver.id}`,
      giverId: giver.id,
      receiverId: receiver.id,
      giftId: gift.id,
      revealedAt: undefined,
    };
  });

  return exchanges;
}

/**
 * 交換結果をシャッフル（発表順序をランダムにする）
 */
export function shuffleExchanges(exchanges: Exchange[]): Exchange[] {
  return shuffle(exchanges);
}

