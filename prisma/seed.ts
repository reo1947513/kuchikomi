import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kuchikomi.jp" },
    update: {},
    create: {
      email: "admin@kuchikomi.jp",
      loginId: "AG-000001",
      password: hashedPassword,
      name: "管理者",
      role: "admin",
    },
  });

  // Create sample agent
  const agentPassword = await bcrypt.hash("agent1234", 10);
  const agent = await prisma.user.upsert({
    where: { loginId: "AG-000002" },
    update: {},
    create: {
      loginId: "AG-000002",
      password: agentPassword,
      name: "営業担当",
      role: "agent",
    },
  });

  // Create sample survey
  const survey = await prisma.survey.upsert({
    where: { id: "sample-survey-1" },
    update: {},
    create: {
      id: "sample-survey-1",
      title: "サービス満足度アンケート",
      description:
        "誠にありがとうございました！アンケートにお答えすることで得られるデータは、当店のサービス改善に活用させていただきます。ご同意いただいた上でアンケートにお答えください。",
      googleBusinessUrl: "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review",
      userId: admin.id,
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
            text: "作業スタッフの対応・技術はいかがでしたか？",
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
            text: "料金・費用対効果はいかがでしたか？",
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
            text: "総合的なご満足度はいかがでしたか？",
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
            text: "ご自由にご意見・ご感想をお聞かせください（任意）",
            order: 5,
            type: "text",
          },
        ],
      },
    },
  });

  console.log("Seed completed:", { admin, agent, survey });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
