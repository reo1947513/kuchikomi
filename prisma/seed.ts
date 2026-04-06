import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  // Create agency
  const agency = await prisma.agency.upsert({
    where: { id: "agency-konest" },
    update: {},
    create: {
      id: "agency-konest",
      name: "コネスト",
    },
  });

  // Create super admin
  const superPassword = await bcrypt.hash(process.env.SEED_SUPER_PASSWORD || crypto.randomUUID(), 12);
  await prisma.user.upsert({
    where: { email: "x9kv-admin@sys.internal" },
    update: {},
    create: {
      email: "x9kv-admin@sys.internal",
      password: superPassword,
      name: "開発者",
      role: "super",
    },
  });

  // Create admin user (shop owner)
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || crypto.randomUUID(), 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kuchikomi.jp" },
    update: {},
    create: {
      email: "admin@kuchikomi.jp",
      loginId: "AG-000001",
      password: adminPassword,
      name: "管理者",
      role: "admin",
      shopName: "ガイア株式会社",
      address: "大分市西新地2-6-12コンフォール大洲105",
      industry: "その他",
      agencyId: agency.id,
    },
  });

  const DEFAULT_PROMPT = `以下のアンケート回答をもとに、Googleビジネスプロフィールに投稿する口コミ文章を作成してください。

口調: {tone}
キーワード（可能であれば含める）: {keywords}

アンケート回答:
{formattedResponses}

ガイドライン:
- 100文字程度の自然な文章
- 実際のお客様が書いたような口語的な表現
- 冒頭の表現を毎回変える
- アンケート回答に基づく具体的な内容のみ（架空の情報は禁止）
- 文章構成を毎回変える
- ポジティブな内容（ネガティブな回答は温かく改善点として表現）

口コミ文章のみ出力してください。`;

  // Create sample survey
  const survey = await prisma.survey.upsert({
    where: { id: "sample-survey-1" },
    update: {},
    create: {
      id: "sample-survey-1",
      title: "ガイア株式会社",
      openingMessage:
        "誠にありがとうございました！アンケートにお答えすることで得られるデータは、当店のサービス改善に活用させていただきます。ご同意いただいた上でアンケートにお答えください。",
      closingMessage: "ご回答いただきありがとうございました。またのご利用を心よりお待ちしております。",
      completionMessage:
        "回答ありがとうございました！\n下記の口コミ文章をコピーして、Google Mapへの口コミ投稿にご協力ください。",
      keywords: "親切,丁寧,スピーディ",
      promptTemplate: DEFAULT_PROMPT,
      googleBusinessUrl: "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review",
      monthlyReviewLimit: 100,
      userId: admin.id,
      tones: {
        create: [
          { name: "敬体（です・ます調）", order: 0 },
          { name: "情緒的で感情豊かな表現", order: 1 },
        ],
      },
      questions: {
        create: [
          {
            text: "ご依頼時の電話対応や見積もり時のスタッフの対応はいかがでしたか？",
            order: 1,
            type: "choice",
            choices: {
              create: [
                { text: "非常に満足", order: 1, score: 2 },
                { text: "満足", order: 2, score: 1 },
                { text: "どちらとも言えない", order: 3, score: 0 },
                { text: "やや不満", order: 4, score: -1 },
                { text: "不満", order: 5, score: -2 },
              ],
            },
          },
          {
            text: "作業当日のスタッフの対応はいかがでしたか？",
            order: 2,
            type: "choice",
            choices: {
              create: [
                { text: "非常に満足", order: 1, score: 2 },
                { text: "満足", order: 2, score: 1 },
                { text: "どちらとも言えない", order: 3, score: 0 },
                { text: "やや不満", order: 4, score: -1 },
                { text: "不満", order: 5, score: -2 },
              ],
            },
          },
          {
            text: "作業の丁寧さやスピードはいかがでしたか？",
            order: 3,
            type: "choice",
            choices: {
              create: [
                { text: "非常に満足", order: 1, score: 2 },
                { text: "満足", order: 2, score: 1 },
                { text: "どちらとも言えない", order: 3, score: 0 },
                { text: "やや不満", order: 4, score: -1 },
                { text: "不満", order: 5, score: -2 },
              ],
            },
          },
          {
            text: "料金プランの説明はわかりやすかったですか？",
            order: 4,
            type: "choice",
            choices: {
              create: [
                { text: "非常に満足", order: 1, score: 2 },
                { text: "満足", order: 2, score: 1 },
                { text: "どちらとも言えない", order: 3, score: 0 },
                { text: "やや不満", order: 4, score: -1 },
                { text: "不満", order: 5, score: -2 },
              ],
            },
          },
          {
            text: "このサービスを家族や友人に勧めたいと思いますか？",
            order: 5,
            type: "choice",
            choices: {
              create: [
                { text: "ぜひ勧めたい", order: 1, score: 2 },
                { text: "たぶん勧める", order: 2, score: 1 },
                { text: "どちらとも言えない", order: 3, score: 0 },
                { text: "あまり勧めない", order: 4, score: -1 },
                { text: "勧めない", order: 5, score: -2 },
              ],
            },
          },
          {
            text: "当店を知ったきっかけを教えてください",
            order: 6,
            type: "text",
          },
          {
            text: "またご利用いただけますか？",
            order: 7,
            type: "choice",
            choices: {
              create: [
                { text: "ぜひ利用したい", order: 1, score: 2 },
                { text: "たぶん利用する", order: 2, score: 1 },
                { text: "どちらとも言えない", order: 3, score: 0 },
                { text: "あまり利用しない", order: 4, score: -1 },
                { text: "利用しない", order: 5, score: -2 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
