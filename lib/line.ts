/**
 * LINE Messaging API ユーティリティ
 * 顧客のLINE連携アカウントへプッシュメッセージを送信
 */

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

function getToken(): string | undefined {
  return process.env.LINE_CHANNEL_ACCESS_TOKEN;
}

async function pushMessage(to: string, messages: { type: string; text: string }[]) {
  const token = getToken();
  if (!token) {
    console.error("LINE_CHANNEL_ACCESS_TOKEN is not set");
    return;
  }

  const res = await fetch(LINE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("LINE push message failed:", res.status, text);
  }
}

/**
 * レビュー受信通知をLINEで送信
 */
export async function sendLineReviewNotification(
  lineUserId: string,
  shopName: string,
  reviewText: string,
  currentCount: number,
  limit: number,
) {
  const limitText = limit === 0 ? "無制限" : `${limit}件`;
  const text =
    `【レビュー受信】\n` +
    `${shopName}\n\n` +
    `${reviewText.slice(0, 300)}${reviewText.length > 300 ? "..." : ""}\n\n` +
    `今月: ${currentCount}/${limitText}\n` +
    `▶ ダッシュボードで確認`;

  await pushMessage(lineUserId, [{ type: "text", text }]);
}

/**
 * 月次レポート通知をLINEで送信
 */
export async function sendLineMonthlyReport(
  lineUserId: string,
  shopName: string,
  data: {
    totalReviews: number;
    averageRating: number;
    topKeywords: string[];
    month: string; // "2026年4月"
  },
) {
  const keywords = data.topKeywords.length > 0 ? data.topKeywords.join("、") : "なし";
  const text =
    `【${data.month} 月次レポート】\n` +
    `${shopName}\n\n` +
    `レビュー数: ${data.totalReviews}件\n` +
    `平均評価: ${data.averageRating.toFixed(1)}点\n` +
    `頻出キーワード: ${keywords}\n\n` +
    `▶ ダッシュボードで詳細を確認`;

  await pushMessage(lineUserId, [{ type: "text", text }]);
}

/**
 * 管理者へのLINE通知（既存の管理者通知と同じパターン）
 */
export async function sendLineAdminNotification(message: string) {
  const adminLineId = process.env.LINE_ADMIN_USER_ID;
  if (!adminLineId) return;

  await pushMessage(adminLineId, [{ type: "text", text: message }]);
}
