const fs = require('fs');
const path = require('path');

// ============================================================
// ID generators
// ============================================================
let choiceCounter = 0;
let sessionCounter = 0;
let answerCounter = 0;

function esc(s) {
  return s.replace(/'/g, "''");
}

function randomDate(monthsBack = 3) {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - monthsBack);
  const ts = start.getTime() + Math.random() * (now.getTime() - start.getTime());
  return new Date(ts).toISOString();
}

// ============================================================
// Review templates per industry (15-20 each)
// ============================================================
const reviewTemplates = {
  飲食店: [
    'ランチで伺いました。料理の味付けが絶妙で、特にパスタが美味しかったです。また来たいです。',
    'スタッフの方がとても親切で気持ちよく食事ができました。料理も美味しかったです。',
    '友人と一緒に訪問しました。雰囲気が良く、料理も美味しくて大満足です。',
    '初めて来ましたが、メニューが豊富で迷いました。どれも美味しかったのでまた来ます。',
    'コスパが良く、味も接客も満足です。ランチタイムは混むので早めに行くのがおすすめ。',
    'デザートが特に美味しかったです。店内も清潔で居心地が良かったです。',
    '子連れでも安心して食事ができました。キッズメニューがあるのが嬉しいです。',
    '記念日に利用しました。特別な料理を出していただき、素敵な時間を過ごせました。',
    '仕事帰りに立ち寄りました。疲れた体に美味しい料理が染みました。また行きます。',
    '予約なしで行きましたが、すぐに案内してもらえました。料理も早く出てきて助かりました。',
    '季節のメニューが楽しめるのが良いです。今回は秋の限定メニューを堪能しました。',
    'テイクアウトも利用しましたが、店内と変わらず美味しかったです。',
    '料理の盛り付けが綺麗で、目でも楽しめました。味ももちろん最高です。',
    '常連になりつつあります。いつ来ても安定した美味しさで安心します。',
    '新メニューを試しましたが期待以上でした。スタッフのおすすめは間違いないですね。',
    'ワインの品揃えが良く、料理とのペアリングを楽しめました。',
    '接客が丁寧で、料理の説明も分かりやすかったです。おすすめのお店です。',
    '個室を利用しました。落ち着いた空間で食事を楽しめて良かったです。',
  ],
  整骨院: [
    '長年の肩こりが嘘のように楽になりました。先生の技術に感謝しています。',
    '丁寧に症状を聞いてくれて、的確な施術をしてくれました。信頼できる院です。',
    '初めての整骨院でしたが、説明が丁寧で安心して施術を受けられました。',
    '腰痛がひどかったのですが、数回通って改善しました。先生ありがとうございます。',
    '院内がとても清潔で、リラックスして施術を受けることができました。',
    '予約制なので待ち時間がほとんどなく、忙しい人にもおすすめです。',
    'スタッフの皆さんが明るくて、通うのが楽しみになっています。',
    '施術後は体が軽くなります。定期的に通いたいと思える整骨院です。',
    '姿勢の矯正をしてもらいました。普段の姿勢のアドバイスも丁寧にくれます。',
    '交通事故の後遺症で通い始めましたが、少しずつ改善しています。',
    '料金が明確で安心して通えます。施術の効果も実感できています。',
    '首の痛みで来院しましたが、原因を丁寧に説明してくれて納得の施術でした。',
    '夜遅くまでやっているので、仕事帰りに通えて助かっています。',
    '施術だけでなく、自宅でのストレッチも教えてもらえるのが嬉しいです。',
    '友人の紹介で来ました。評判通り、腕の良い先生です。紹介して正解でした。',
    '膝の痛みが改善しました。先生の説明がわかりやすく、通うモチベーションが上がります。',
    'アットホームな雰囲気で初めてでも緊張しませんでした。技術も確かです。',
  ],
  美容室: [
    'いつも理想通りの仕上がりにしてくれます。カウンセリングが丁寧で安心です。',
    '初めて伺いましたが、希望通りのヘアスタイルになりました。とても満足しています。',
    'カラーの色味が絶妙で、友人からも褒められました。次回もお願いしたいです。',
    'スタイリストさんの技術が高く、毎回満足のいく仕上がりです。',
    '店内の雰囲気がおしゃれでリラックスできます。施術中も楽しい時間でした。',
    'トリートメントをしてもらいました。髪がツヤツヤになって嬉しいです。',
    '予約が取りやすく、待ち時間もないので助かります。仕上がりも毎回満足。',
    'ヘッドスパが最高に気持ちよかったです。髪だけでなく頭皮ケアも大切ですね。',
    'パーマをかけてもらいました。思い通りのウェーブで大満足です。',
    '子供のカットもお願いしましたが、上手にあやしながら切ってくれました。',
    '的確なアドバイスをくれるので、毎回新しい発見があります。信頼しています。',
    '髪の悩みを相談したら、適切なケア方法を教えてもらえました。',
    '長年通っていますが、いつも期待以上の仕上がりです。他の美容室は考えられません。',
    '縮毛矯正をしてもらいました。自然な仕上がりで大満足です。',
    'スタッフの皆さんが明るくて、居心地の良いサロンです。技術も間違いないです。',
    'カットだけでなくスタイリングのコツも教えてくれるのが嬉しいです。',
    '駅近で通いやすく、仕上がりも毎回素晴らしいです。おすすめの美容室です。',
  ],
};

// Text answer templates per industry
const textAnswerTemplates = {
  飲食店: [
    '季節の限定メニューが楽しみです。',
    'パスタが特に美味しかったです。',
    'デザートのバリエーションを増やしてほしいです。',
    '和食メニューも試してみたいです。',
    'ランチセットがお得で嬉しいです。',
    '辛いメニューがあると嬉しいです。',
    'サラダの種類が豊富で良いですね。',
    '特になし。満足しています。',
    'ドリンクメニューが充実していて良いです。',
    'ヘルシーメニューがあると嬉しいです。',
  ],
  整骨院: [
    '首のこりも見てもらいたいです。',
    '週末も営業してくれると助かります。',
    '特にありません。とても満足しています。',
    '駐車場がもう少し広いと嬉しいです。',
    'ストレッチのアドバイスが参考になりました。',
    'BGMが心地よくてリラックスできました。',
    '予約がもう少し取りやすいと嬉しいです。',
    '施術時間がちょうど良かったです。',
    'スタッフの皆さんが優しくて安心します。',
    '自宅ケアの資料があると嬉しいです。',
  ],
  美容室: [
    'ヘッドスパをもっと長くしてほしいです。',
    '雑誌の種類が豊富で良かったです。',
    '特にありません。いつも満足しています。',
    '新しいカラー剤を試してみたいです。',
    'ドリンクサービスが嬉しかったです。',
    'トリートメントの効果が長持ちしました。',
    '予約サイトが使いやすくて助かります。',
    '次回はパーマに挑戦したいです。',
    'スタイリング剤のおすすめが参考になりました。',
    '髪質改善メニューに興味があります。',
  ],
};

// ============================================================
// Data definitions
// ============================================================
const shops = [
  {
    userId: 'demo-user-1',
    email: 'demo1@kuchikomi.jp',
    loginId: 'AG-000001',
    shopName: 'デモ飲食店',
    industry: '飲食店',
    surveyId: 'demo-survey-1',
    keywords: '美味しい,料理,接客,雰囲気,コスパ',
    openingMessage: 'ご来店ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。',
    closingMessage: 'アンケートにご協力いただきありがとうございました。',
    completionMessage: 'ご回答ありがとうございました。またのご来店をお待ちしております。',
    googleBusinessUrl: 'https://g.page/demo-restaurant',
    questions: [
      { id: 'demo-q1-1', text: '料理の味はいかがでしたか？', order: 1, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q2-1', text: 'スタッフの接客はいかがでしたか？', order: 2, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q3-1', text: '店内の雰囲気はいかがでしたか？', order: 3, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q4-1', text: '料金に対する満足度は？', order: 4, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q5a-1', text: 'お気に入りのメニューはありましたか？', order: 5, type: 'text', isRandom: true, groupName: 'メニュー' },
      { id: 'demo-q5b-1', text: '新メニューへの期待は？', order: 6, type: 'text', isRandom: true, groupName: 'メニュー' },
      { id: 'demo-q6a-1', text: 'また来店したいですか？', order: 7, type: 'choice', isRandom: true, groupName: 'リピート' },
      { id: 'demo-q6b-1', text: '友人に紹介したいですか？', order: 8, type: 'choice', isRandom: true, groupName: 'リピート' },
      { id: 'demo-q7-1', text: 'その他ご意見があればお聞かせください', order: 9, type: 'text', isRandom: false, groupName: null },
    ],
  },
  {
    userId: 'demo-user-2',
    email: 'demo2@kuchikomi.jp',
    loginId: 'AG-000002',
    shopName: 'デモ整骨院',
    industry: '整骨院',
    surveyId: 'demo-survey-2',
    keywords: '施術,効果,丁寧,清潔,改善',
    openingMessage: 'ご来院ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。',
    closingMessage: 'アンケートにご協力いただきありがとうございました。',
    completionMessage: 'ご回答ありがとうございました。お体のお悩みがありましたらいつでもご相談ください。',
    googleBusinessUrl: 'https://g.page/demo-seikotsuin',
    questions: [
      { id: 'demo-q1-2', text: '施術の効果は感じられましたか？', order: 1, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q2-2', text: 'スタッフの対応はいかがでしたか？', order: 2, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q3-2', text: '院内の清潔感はいかがでしたか？', order: 3, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q4-2', text: '待ち時間は適切でしたか？', order: 4, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q5a-2', text: '症状の説明はわかりやすかったですか？', order: 5, type: 'choice', isRandom: true, groupName: '説明' },
      { id: 'demo-q5b-2', text: '施術内容の説明は十分でしたか？', order: 6, type: 'choice', isRandom: true, groupName: '説明' },
      { id: 'demo-q6a-2', text: '継続して通いたいと思いますか？', order: 7, type: 'choice', isRandom: true, groupName: '通院' },
      { id: 'demo-q6b-2', text: '他の方にもおすすめしたいですか？', order: 8, type: 'choice', isRandom: true, groupName: '通院' },
      { id: 'demo-q7-2', text: '改善して欲しい点があればお聞かせください', order: 9, type: 'text', isRandom: false, groupName: null },
    ],
  },
  {
    userId: 'demo-user-3',
    email: 'demo3@kuchikomi.jp',
    loginId: 'AG-000003',
    shopName: 'デモ美容室',
    industry: '美容室',
    surveyId: 'demo-survey-3',
    keywords: 'カット,カラー,仕上がり,接客,おしゃれ',
    openingMessage: 'ご来店ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。',
    closingMessage: 'アンケートにご協力いただきありがとうございました。',
    completionMessage: 'ご回答ありがとうございました。またのご来店をお待ちしております。',
    googleBusinessUrl: 'https://g.page/demo-biyoushitsu',
    questions: [
      { id: 'demo-q1-3', text: '仕上がりには満足していますか？', order: 1, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q2-3', text: 'スタイリストの技術はいかがでしたか？', order: 2, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q3-3', text: 'カウンセリングは十分でしたか？', order: 3, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q4-3', text: '店内の雰囲気はいかがでしたか？', order: 4, type: 'choice', isRandom: false, groupName: null },
      { id: 'demo-q5a-3', text: 'ヘッドスパやトリートメントに興味はありますか？', order: 5, type: 'choice', isRandom: true, groupName: 'サービス' },
      { id: 'demo-q5b-3', text: 'カラーやパーマの仕上がりは？', order: 6, type: 'choice', isRandom: true, groupName: 'サービス' },
      { id: 'demo-q6a-3', text: '次回も指名したいですか？', order: 7, type: 'choice', isRandom: true, groupName: 'リピート' },
      { id: 'demo-q6b-3', text: '友人や家族に紹介したいですか？', order: 8, type: 'choice', isRandom: true, groupName: 'リピート' },
      { id: 'demo-q7-3', text: 'その他ご要望があればお聞かせください', order: 9, type: 'text', isRandom: false, groupName: null },
    ],
  },
];

const choiceLabels = [
  { text: '非常に満足', score: 2 },
  { text: '満足', score: 1 },
  { text: 'どちらとも言えない', score: 0 },
  { text: 'やや不満', score: -1 },
  { text: '不満', score: -2 },
];

const toneNames = ['敬体（です・ます調）', 'カジュアルな口調'];

const passwordHash = '$2a$10$V5h/b24p0tNw34DJ9T7TkOxGaOubUwBnvLOALbMPZFtvr2wsIJi0y';

// ============================================================
// SQL generation
// ============================================================
const lines = [];

lines.push('BEGIN;');
lines.push('');
lines.push('-- ============================================');
lines.push('-- Delete existing demo data (idempotent)');
lines.push('-- ============================================');
lines.push(`DELETE FROM "Answer" WHERE "sessionId" LIKE 'demo-%';`);
lines.push(`DELETE FROM "ReviewSession" WHERE id LIKE 'demo-%';`);
lines.push(`DELETE FROM "Choice" WHERE id LIKE 'demo-%';`);
lines.push(`DELETE FROM "Question" WHERE id LIKE 'demo-%';`);
lines.push(`DELETE FROM "Tone" WHERE id LIKE 'demo-%';`);
lines.push(`DELETE FROM "Survey" WHERE id LIKE 'demo-%';`);
lines.push(`DELETE FROM "User" WHERE id LIKE 'demo-%';`);
lines.push('');

const now = new Date().toISOString();

// Build a map of questionId -> list of choiceIds for session generation
const questionChoicesMap = {}; // questionId -> [{choiceId, score}]

for (const shop of shops) {
  const shopIdx = shops.indexOf(shop) + 1;

  // ---- User ----
  lines.push(`-- ============================================`);
  lines.push(`-- Shop ${shopIdx}: ${shop.shopName}`);
  lines.push(`-- ============================================`);
  lines.push(`INSERT INTO "User" (id, email, "loginId", password, name, role, "shopName", address, industry, "noContractLimit", "createdAt", "updatedAt")`);
  lines.push(`VALUES ('${shop.userId}', '${shop.email}', '${shop.loginId}', '${esc(passwordHash)}', '${esc(shop.shopName)}管理者', 'admin', '${esc(shop.shopName)}', '東京都渋谷区demo${shopIdx}', '${esc(shop.industry)}', true, '${now}', '${now}');`);
  lines.push('');

  // ---- Survey ----
  lines.push(`INSERT INTO "Survey" (id, title, "openingMessage", "closingMessage", "completionMessage", keywords, "toneRandom", "googleBusinessUrl", "minRandomQuestions", "maxRandomQuestions", "isActive", "monthlyReviewLimit", "monthlyReviewCount", "createdAt", "updatedAt", "userId")`);
  lines.push(`VALUES ('${shop.surveyId}', '${esc(shop.shopName)}アンケート', '${esc(shop.openingMessage)}', '${esc(shop.closingMessage)}', '${esc(shop.completionMessage)}', '${esc(shop.keywords)}', true, '${esc(shop.googleBusinessUrl)}', 1, 1, true, 100, 0, '${now}', '${now}', '${shop.userId}');`);
  lines.push('');

  // ---- Tones ----
  for (let t = 0; t < toneNames.length; t++) {
    const toneId = `demo-tone-${shopIdx}-${t + 1}`;
    lines.push(`INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")`);
    lines.push(`VALUES ('${toneId}', '${esc(toneNames[t])}', true, ${t + 1}, '${shop.surveyId}');`);
  }
  lines.push('');

  // ---- Questions & Choices ----
  for (const q of shop.questions) {
    const groupVal = q.groupName ? `'${esc(q.groupName)}'` : 'NULL';
    lines.push(`INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")`);
    lines.push(`VALUES ('${q.id}', '${esc(q.text)}', ${q.order}, '${q.type}', ${q.isRandom}, ${groupVal}, '${shop.surveyId}');`);

    if (q.type === 'choice') {
      questionChoicesMap[q.id] = [];
      for (let c = 0; c < choiceLabels.length; c++) {
        choiceCounter++;
        const choiceId = `demo-choice-${choiceCounter}`;
        const cl = choiceLabels[c];
        lines.push(`INSERT INTO "Choice" (id, text, "order", score, "questionId")`);
        lines.push(`VALUES ('${choiceId}', '${esc(cl.text)}', ${c + 1}, ${cl.score}, '${q.id}');`);
        questionChoicesMap[q.id].push({ choiceId, score: cl.score });
      }
    }
  }
  lines.push('');

  // ---- Review Sessions & Answers ----
  const sessionCount = shopIdx <= 2 ? 33 : 34; // 33+33+34 = 100
  const templates = reviewTemplates[shop.industry];
  const textTemplates = textAnswerTemplates[shop.industry];

  // Determine fixed questions and random groups
  const fixedQuestions = shop.questions.filter(q => !q.isRandom);
  const randomGroups = {};
  for (const q of shop.questions) {
    if (q.isRandom && q.groupName) {
      if (!randomGroups[q.groupName]) randomGroups[q.groupName] = [];
      randomGroups[q.groupName].push(q);
    }
  }
  const groupNames = Object.keys(randomGroups);

  lines.push(`-- Sessions for ${shop.shopName}`);
  for (let s = 0; s < sessionCount; s++) {
    sessionCounter++;
    const sessionId = `demo-session-${sessionCounter}`;
    const createdAt = randomDate(3);
    const reviewText = templates[s % templates.length];

    lines.push(`INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")`);
    lines.push(`VALUES ('${sessionId}', '${shop.surveyId}', '${esc(reviewText)}', 'completed', false, '${createdAt}', '${createdAt}');`);

    // Pick questions for this session: all fixed + 1 random from each group
    const sessionQuestions = [...fixedQuestions];
    for (const gn of groupNames) {
      const groupQs = randomGroups[gn];
      const picked = groupQs[Math.floor(Math.random() * groupQs.length)];
      sessionQuestions.push(picked);
    }

    // Generate answers
    for (const q of sessionQuestions) {
      answerCounter++;
      const answerId = `demo-answer-${answerCounter}`;

      if (q.type === 'choice') {
        // Mostly positive: 50% score 2, 35% score 1, 15% score 0
        const choices = questionChoicesMap[q.id];
        const r = Math.random();
        let picked;
        if (r < 0.50) picked = choices.find(c => c.score === 2);
        else if (r < 0.85) picked = choices.find(c => c.score === 1);
        else picked = choices.find(c => c.score === 0);

        lines.push(`INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")`);
        lines.push(`VALUES ('${answerId}', '${sessionId}', '${q.id}', '${picked.choiceId}', NULL, '${createdAt}');`);
      } else {
        // text question
        const textVal = textTemplates[Math.floor(Math.random() * textTemplates.length)];
        lines.push(`INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")`);
        lines.push(`VALUES ('${answerId}', '${sessionId}', '${q.id}', NULL, '${esc(textVal)}', '${createdAt}');`);
      }
    }
    lines.push('');
  }
}

lines.push('COMMIT;');

// Write output
const outputPath = path.join(__dirname, 'demo-data.sql');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`Generated: ${outputPath}`);
console.log(`Total sessions: ${sessionCounter}`);
console.log(`Total answers: ${answerCounter}`);
console.log(`Total choices: ${choiceCounter}`);
