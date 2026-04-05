import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@comista-kuchikomi.com";

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
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
