import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@comista-kuchikomi.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await getResend().emails.send({
    from: `ComiSta <${FROM_EMAIL}>`,
    to: email,
    subject: "【ComiSta】パスワード再設定",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1f2937;">パスワード再設定</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          パスワード再設定のリクエストを受け付けました。<br />
          以下のボタンをクリックして、新しいパスワードを設定してください。
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(to right, #06b6d4, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            パスワードを再設定する
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">
          このリンクは1時間後に無効になります。<br />
          心当たりのない場合は、このメールを無視してください。
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 ComiSta</p>
      </div>
    `,
  });
}

export async function sendReviewNotificationEmail(
  email: string,
  shopName: string,
  reviewText: string,
  currentCount: number,
  limit: number
) {
  const limitText = limit === 0 ? "無制限" : `${currentCount}/${limit}件`;
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : "https://comista-kuchikomi.com/dashboard";

  await getResend().emails.send({
    from: `ComiSta <${FROM_EMAIL}>`,
    to: email,
    subject: `【ComiSta】新しい口コミが生成されました - ${shopName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1f2937;">新しい口コミが生成されました</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          ${shopName} のアンケートから新しい口コミが生成されました。
        </p>
        <div style="background: #f5f3ff; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">生成された口コミ:</p>
          <p style="color: #1f2937; font-size: 14px; line-height: 1.6; margin: 0;">${reviewText}</p>
        </div>
        <p style="color: #6b7280; font-size: 13px;">今月の生成数: <strong>${limitText}</strong></p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${dashboardUrl}" style="background: linear-gradient(to right, #06b6d4, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            ダッシュボードで確認
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 ComiSta</p>
      </div>
    `,
  });
}

export async function sendRenewalReminderEmail(
  email: string,
  shopName: string,
  renewalDate: string,
  planName: string
) {
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    : "https://comista-kuchikomi.com/dashboard/billing";

  await getResend().emails.send({
    from: `ComiSta <${FROM_EMAIL}>`,
    to: email,
    subject: `【ComiSta】ご契約の自動更新のお知らせ - ${shopName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1f2937;">契約更新のお知らせ</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          ${shopName} 様<br /><br />
          いつもComiStaをご利用いただきありがとうございます。<br />
          ご契約の自動更新日が近づいておりますのでお知らせいたします。
        </p>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            <strong>プラン:</strong> ${planName}<br />
            <strong>更新日:</strong> ${renewalDate}
          </p>
        </div>
        <p style="color: #4b5563; font-size: 13px; line-height: 1.6;">
          更新日に自動でお支払いが行われます。プランの変更・確認はダッシュボードから行えます。
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${dashboardUrl}" style="background: linear-gradient(to right, #06b6d4, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            プラン・お支払いを確認
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 ComiSta</p>
      </div>
    `,
  });
}
