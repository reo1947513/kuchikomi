BEGIN;

-- ============================================
-- Delete existing demo data (idempotent)
-- ============================================
DELETE FROM "Answer" WHERE "sessionId" LIKE 'demo-%';
DELETE FROM "ReviewSession" WHERE id LIKE 'demo-%';
DELETE FROM "Choice" WHERE id LIKE 'demo-%';
DELETE FROM "Question" WHERE id LIKE 'demo-%';
DELETE FROM "Tone" WHERE id LIKE 'demo-%';
DELETE FROM "Survey" WHERE id LIKE 'demo-%';
DELETE FROM "User" WHERE id LIKE 'demo-%';

-- ============================================
-- Shop 1: デモ飲食店
-- ============================================
INSERT INTO "User" (id, email, "loginId", password, name, role, "shopName", address, industry, "noContractLimit", "planType", "planReviewLimit", "createdAt", "updatedAt")
VALUES ('demo-user-1', 'demo1@kuchikomi.jp', 'AG-000001', '$2a$10$V5h/b24p0tNw34DJ9T7TkOxGaOubUwBnvLOALbMPZFtvr2wsIJi0y', 'デモ飲食店管理者', 'admin', 'デモ飲食店', '東京都渋谷区demo1', '飲食店', true, 'premium', 0, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z');

INSERT INTO "Survey" (id, title, "openingMessage", "closingMessage", "completionMessage", keywords, "toneRandom", "googleBusinessUrl", "minRandomQuestions", "maxRandomQuestions", "isActive", "monthlyReviewLimit", "monthlyReviewCount", "createdAt", "updatedAt", "userId")
VALUES ('demo-survey-1', 'デモ飲食店アンケート', 'ご来店ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。', 'アンケートにご協力いただきありがとうございました。', 'ご回答ありがとうございました。またのご来店をお待ちしております。', '美味しい,料理,接客,雰囲気,コスパ', true, 'https://g.page/demo-restaurant', 1, 1, true, 100, 0, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z', 'demo-user-1');

INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-1-1', '敬体（です・ます調）', true, 1, 'demo-survey-1');
INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-1-2', 'カジュアルな口調', true, 2, 'demo-survey-1');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q1-1', '料理の味はいかがでしたか？', 1, 'choice', false, NULL, 'demo-survey-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-1', '非常に満足', 1, 2, 'demo-q1-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-2', '満足', 2, 1, 'demo-q1-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-3', 'どちらとも言えない', 3, 0, 'demo-q1-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4', 'やや不満', 4, -1, 'demo-q1-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-5', '不満', 5, -2, 'demo-q1-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q2-1', 'スタッフの接客はいかがでしたか？', 2, 'choice', false, NULL, 'demo-survey-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-6', '非常に満足', 1, 2, 'demo-q2-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-7', '満足', 2, 1, 'demo-q2-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-8', 'どちらとも言えない', 3, 0, 'demo-q2-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-9', 'やや不満', 4, -1, 'demo-q2-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-10', '不満', 5, -2, 'demo-q2-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q3-1', '店内の雰囲気はいかがでしたか？', 3, 'choice', false, NULL, 'demo-survey-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-11', '非常に満足', 1, 2, 'demo-q3-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-12', '満足', 2, 1, 'demo-q3-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-13', 'どちらとも言えない', 3, 0, 'demo-q3-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-14', 'やや不満', 4, -1, 'demo-q3-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-15', '不満', 5, -2, 'demo-q3-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q4-1', '料金に対する満足度は？', 4, 'choice', false, NULL, 'demo-survey-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-16', '非常に満足', 1, 2, 'demo-q4-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-17', '満足', 2, 1, 'demo-q4-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-18', 'どちらとも言えない', 3, 0, 'demo-q4-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-19', 'やや不満', 4, -1, 'demo-q4-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-20', '不満', 5, -2, 'demo-q4-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5a-1', 'お気に入りのメニューはありましたか？', 5, 'text', true, 'メニュー', 'demo-survey-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5b-1', '新メニューへの期待は？', 6, 'text', true, 'メニュー', 'demo-survey-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q6a-1', 'また来店したいですか？', 7, 'choice', true, 'リピート', 'demo-survey-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-21', '非常に満足', 1, 2, 'demo-q6a-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-22', '満足', 2, 1, 'demo-q6a-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-23', 'どちらとも言えない', 3, 0, 'demo-q6a-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-24', 'やや不満', 4, -1, 'demo-q6a-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-25', '不満', 5, -2, 'demo-q6a-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q6b-1', '友人に紹介したいですか？', 8, 'choice', true, 'リピート', 'demo-survey-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-26', '非常に満足', 1, 2, 'demo-q6b-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-27', '満足', 2, 1, 'demo-q6b-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-28', 'どちらとも言えない', 3, 0, 'demo-q6b-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-29', 'やや不満', 4, -1, 'demo-q6b-1');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-30', '不満', 5, -2, 'demo-q6b-1');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q7-1', 'その他ご意見があればお聞かせください', 9, 'text', false, NULL, 'demo-survey-1');

-- Sessions for デモ飲食店
INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-1', 'demo-survey-1', 'ランチで伺いました。料理の味付けが絶妙で、特にパスタが美味しかったです。また来たいです。', 'completed', false, '2026-01-13T21:29:19.806Z', '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-1', 'demo-session-1', 'demo-q1-1', 'demo-choice-2', NULL, '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-2', 'demo-session-1', 'demo-q2-1', 'demo-choice-6', NULL, '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-3', 'demo-session-1', 'demo-q3-1', 'demo-choice-11', NULL, '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-4', 'demo-session-1', 'demo-q4-1', 'demo-choice-18', NULL, '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-5', 'demo-session-1', 'demo-q7-1', NULL, '辛いメニューがあると嬉しいです。', '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-6', 'demo-session-1', 'demo-q5a-1', NULL, 'サラダの種類が豊富で良いですね。', '2026-01-13T21:29:19.806Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-7', 'demo-session-1', 'demo-q6a-1', 'demo-choice-23', NULL, '2026-01-13T21:29:19.806Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-2', 'demo-survey-1', 'スタッフの方がとても親切で気持ちよく食事ができました。料理も美味しかったです。', 'completed', false, '2026-03-06T16:03:38.075Z', '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-8', 'demo-session-2', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-9', 'demo-session-2', 'demo-q2-1', 'demo-choice-7', NULL, '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-10', 'demo-session-2', 'demo-q3-1', 'demo-choice-12', NULL, '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-11', 'demo-session-2', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-12', 'demo-session-2', 'demo-q7-1', NULL, '和食メニューも試してみたいです。', '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-13', 'demo-session-2', 'demo-q5a-1', NULL, 'パスタが特に美味しかったです。', '2026-03-06T16:03:38.075Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-14', 'demo-session-2', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-03-06T16:03:38.075Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-3', 'demo-survey-1', '友人と一緒に訪問しました。雰囲気が良く、料理も美味しくて大満足です。', 'completed', false, '2026-04-03T23:04:20.318Z', '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-15', 'demo-session-3', 'demo-q1-1', 'demo-choice-2', NULL, '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-16', 'demo-session-3', 'demo-q2-1', 'demo-choice-7', NULL, '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-17', 'demo-session-3', 'demo-q3-1', 'demo-choice-12', NULL, '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-18', 'demo-session-3', 'demo-q4-1', 'demo-choice-16', NULL, '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-19', 'demo-session-3', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-20', 'demo-session-3', 'demo-q5b-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-04-03T23:04:20.318Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-21', 'demo-session-3', 'demo-q6b-1', 'demo-choice-26', NULL, '2026-04-03T23:04:20.318Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-4', 'demo-survey-1', '初めて来ましたが、メニューが豊富で迷いました。どれも美味しかったのでまた来ます。', 'completed', false, '2026-02-01T02:03:55.365Z', '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-22', 'demo-session-4', 'demo-q1-1', 'demo-choice-1', NULL, '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-23', 'demo-session-4', 'demo-q2-1', 'demo-choice-6', NULL, '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-24', 'demo-session-4', 'demo-q3-1', 'demo-choice-11', NULL, '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-25', 'demo-session-4', 'demo-q4-1', 'demo-choice-17', NULL, '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-26', 'demo-session-4', 'demo-q7-1', NULL, '特になし。満足しています。', '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-27', 'demo-session-4', 'demo-q5b-1', NULL, 'デザートのバリエーションを増やしてほしいです。', '2026-02-01T02:03:55.365Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-28', 'demo-session-4', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-02-01T02:03:55.365Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-5', 'demo-survey-1', 'コスパが良く、味も接客も満足です。ランチタイムは混むので早めに行くのがおすすめ。', 'completed', false, '2026-02-12T16:49:08.424Z', '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-29', 'demo-session-5', 'demo-q1-1', 'demo-choice-2', NULL, '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-30', 'demo-session-5', 'demo-q2-1', 'demo-choice-7', NULL, '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-31', 'demo-session-5', 'demo-q3-1', 'demo-choice-11', NULL, '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-32', 'demo-session-5', 'demo-q4-1', 'demo-choice-16', NULL, '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-33', 'demo-session-5', 'demo-q7-1', NULL, '和食メニューも試してみたいです。', '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-34', 'demo-session-5', 'demo-q5b-1', NULL, 'ヘルシーメニューがあると嬉しいです。', '2026-02-12T16:49:08.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-35', 'demo-session-5', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-02-12T16:49:08.424Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-6', 'demo-survey-1', 'デザートが特に美味しかったです。店内も清潔で居心地が良かったです。', 'completed', false, '2026-02-19T09:21:21.835Z', '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-36', 'demo-session-6', 'demo-q1-1', 'demo-choice-2', NULL, '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-37', 'demo-session-6', 'demo-q2-1', 'demo-choice-7', NULL, '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-38', 'demo-session-6', 'demo-q3-1', 'demo-choice-12', NULL, '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-39', 'demo-session-6', 'demo-q4-1', 'demo-choice-16', NULL, '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-40', 'demo-session-6', 'demo-q7-1', NULL, 'デザートのバリエーションを増やしてほしいです。', '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-41', 'demo-session-6', 'demo-q5a-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-02-19T09:21:21.835Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-42', 'demo-session-6', 'demo-q6b-1', 'demo-choice-27', NULL, '2026-02-19T09:21:21.835Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-7', 'demo-survey-1', '子連れでも安心して食事ができました。キッズメニューがあるのが嬉しいです。', 'completed', false, '2026-01-31T06:29:14.399Z', '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-43', 'demo-session-7', 'demo-q1-1', 'demo-choice-1', NULL, '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-44', 'demo-session-7', 'demo-q2-1', 'demo-choice-6', NULL, '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-45', 'demo-session-7', 'demo-q3-1', 'demo-choice-13', NULL, '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-46', 'demo-session-7', 'demo-q4-1', 'demo-choice-17', NULL, '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-47', 'demo-session-7', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-48', 'demo-session-7', 'demo-q5a-1', NULL, '和食メニューも試してみたいです。', '2026-01-31T06:29:14.399Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-49', 'demo-session-7', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-01-31T06:29:14.399Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-8', 'demo-survey-1', '記念日に利用しました。特別な料理を出していただき、素敵な時間を過ごせました。', 'completed', false, '2026-03-11T04:38:49.381Z', '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-50', 'demo-session-8', 'demo-q1-1', 'demo-choice-2', NULL, '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-51', 'demo-session-8', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-52', 'demo-session-8', 'demo-q3-1', 'demo-choice-13', NULL, '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-53', 'demo-session-8', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-54', 'demo-session-8', 'demo-q7-1', NULL, '和食メニューも試してみたいです。', '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-55', 'demo-session-8', 'demo-q5a-1', NULL, 'ヘルシーメニューがあると嬉しいです。', '2026-03-11T04:38:49.381Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-56', 'demo-session-8', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-03-11T04:38:49.381Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-9', 'demo-survey-1', '仕事帰りに立ち寄りました。疲れた体に美味しい料理が染みました。また行きます。', 'completed', false, '2026-03-13T23:31:13.580Z', '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-57', 'demo-session-9', 'demo-q1-1', 'demo-choice-2', NULL, '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-58', 'demo-session-9', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-59', 'demo-session-9', 'demo-q3-1', 'demo-choice-13', NULL, '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-60', 'demo-session-9', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-61', 'demo-session-9', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-62', 'demo-session-9', 'demo-q5a-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-03-13T23:31:13.580Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-63', 'demo-session-9', 'demo-q6a-1', 'demo-choice-23', NULL, '2026-03-13T23:31:13.580Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-10', 'demo-survey-1', '予約なしで行きましたが、すぐに案内してもらえました。料理も早く出てきて助かりました。', 'completed', false, '2026-03-31T18:16:10.678Z', '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-64', 'demo-session-10', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-65', 'demo-session-10', 'demo-q2-1', 'demo-choice-7', NULL, '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-66', 'demo-session-10', 'demo-q3-1', 'demo-choice-11', NULL, '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-67', 'demo-session-10', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-68', 'demo-session-10', 'demo-q7-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-69', 'demo-session-10', 'demo-q5a-1', NULL, 'パスタが特に美味しかったです。', '2026-03-31T18:16:10.678Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-70', 'demo-session-10', 'demo-q6b-1', 'demo-choice-27', NULL, '2026-03-31T18:16:10.678Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-11', 'demo-survey-1', '季節のメニューが楽しめるのが良いです。今回は秋の限定メニューを堪能しました。', 'completed', false, '2026-01-27T19:05:43.046Z', '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-71', 'demo-session-11', 'demo-q1-1', 'demo-choice-2', NULL, '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-72', 'demo-session-11', 'demo-q2-1', 'demo-choice-7', NULL, '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-73', 'demo-session-11', 'demo-q3-1', 'demo-choice-12', NULL, '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-74', 'demo-session-11', 'demo-q4-1', 'demo-choice-16', NULL, '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-75', 'demo-session-11', 'demo-q7-1', NULL, 'ヘルシーメニューがあると嬉しいです。', '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-76', 'demo-session-11', 'demo-q5a-1', NULL, 'サラダの種類が豊富で良いですね。', '2026-01-27T19:05:43.046Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-77', 'demo-session-11', 'demo-q6b-1', 'demo-choice-26', NULL, '2026-01-27T19:05:43.046Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-12', 'demo-survey-1', 'テイクアウトも利用しましたが、店内と変わらず美味しかったです。', 'completed', false, '2026-02-19T15:41:16.364Z', '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-78', 'demo-session-12', 'demo-q1-1', 'demo-choice-2', NULL, '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-79', 'demo-session-12', 'demo-q2-1', 'demo-choice-6', NULL, '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-80', 'demo-session-12', 'demo-q3-1', 'demo-choice-11', NULL, '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-81', 'demo-session-12', 'demo-q4-1', 'demo-choice-16', NULL, '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-82', 'demo-session-12', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-83', 'demo-session-12', 'demo-q5b-1', NULL, 'ヘルシーメニューがあると嬉しいです。', '2026-02-19T15:41:16.364Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-84', 'demo-session-12', 'demo-q6b-1', 'demo-choice-28', NULL, '2026-02-19T15:41:16.364Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-13', 'demo-survey-1', '料理の盛り付けが綺麗で、目でも楽しめました。味ももちろん最高です。', 'completed', false, '2026-03-21T09:30:16.117Z', '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-85', 'demo-session-13', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-86', 'demo-session-13', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-87', 'demo-session-13', 'demo-q3-1', 'demo-choice-12', NULL, '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-88', 'demo-session-13', 'demo-q4-1', 'demo-choice-17', NULL, '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-89', 'demo-session-13', 'demo-q7-1', NULL, 'パスタが特に美味しかったです。', '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-90', 'demo-session-13', 'demo-q5a-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-03-21T09:30:16.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-91', 'demo-session-13', 'demo-q6a-1', 'demo-choice-23', NULL, '2026-03-21T09:30:16.117Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-14', 'demo-survey-1', '常連になりつつあります。いつ来ても安定した美味しさで安心します。', 'completed', false, '2026-02-07T07:35:27.179Z', '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-92', 'demo-session-14', 'demo-q1-1', 'demo-choice-3', NULL, '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-93', 'demo-session-14', 'demo-q2-1', 'demo-choice-7', NULL, '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-94', 'demo-session-14', 'demo-q3-1', 'demo-choice-11', NULL, '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-95', 'demo-session-14', 'demo-q4-1', 'demo-choice-18', NULL, '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-96', 'demo-session-14', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-97', 'demo-session-14', 'demo-q5a-1', NULL, '和食メニューも試してみたいです。', '2026-02-07T07:35:27.179Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-98', 'demo-session-14', 'demo-q6b-1', 'demo-choice-26', NULL, '2026-02-07T07:35:27.179Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-15', 'demo-survey-1', '新メニューを試しましたが期待以上でした。スタッフのおすすめは間違いないですね。', 'completed', false, '2026-03-08T01:37:26.990Z', '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-99', 'demo-session-15', 'demo-q1-1', 'demo-choice-2', NULL, '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-100', 'demo-session-15', 'demo-q2-1', 'demo-choice-7', NULL, '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-101', 'demo-session-15', 'demo-q3-1', 'demo-choice-11', NULL, '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-102', 'demo-session-15', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-103', 'demo-session-15', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-104', 'demo-session-15', 'demo-q5a-1', NULL, 'パスタが特に美味しかったです。', '2026-03-08T01:37:26.990Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-105', 'demo-session-15', 'demo-q6b-1', 'demo-choice-26', NULL, '2026-03-08T01:37:26.990Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-16', 'demo-survey-1', 'ワインの品揃えが良く、料理とのペアリングを楽しめました。', 'completed', false, '2026-04-02T13:11:07.266Z', '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-106', 'demo-session-16', 'demo-q1-1', 'demo-choice-1', NULL, '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-107', 'demo-session-16', 'demo-q2-1', 'demo-choice-6', NULL, '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-108', 'demo-session-16', 'demo-q3-1', 'demo-choice-11', NULL, '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-109', 'demo-session-16', 'demo-q4-1', 'demo-choice-17', NULL, '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-110', 'demo-session-16', 'demo-q7-1', NULL, '季節の限定メニューが楽しみです。', '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-111', 'demo-session-16', 'demo-q5b-1', NULL, '特になし。満足しています。', '2026-04-02T13:11:07.266Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-112', 'demo-session-16', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-04-02T13:11:07.266Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-17', 'demo-survey-1', '接客が丁寧で、料理の説明も分かりやすかったです。おすすめのお店です。', 'completed', false, '2026-03-20T19:43:20.545Z', '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-113', 'demo-session-17', 'demo-q1-1', 'demo-choice-2', NULL, '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-114', 'demo-session-17', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-115', 'demo-session-17', 'demo-q3-1', 'demo-choice-12', NULL, '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-116', 'demo-session-17', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-117', 'demo-session-17', 'demo-q7-1', NULL, 'パスタが特に美味しかったです。', '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-118', 'demo-session-17', 'demo-q5a-1', NULL, 'サラダの種類が豊富で良いですね。', '2026-03-20T19:43:20.545Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-119', 'demo-session-17', 'demo-q6b-1', 'demo-choice-27', NULL, '2026-03-20T19:43:20.545Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-18', 'demo-survey-1', '個室を利用しました。落ち着いた空間で食事を楽しめて良かったです。', 'completed', false, '2026-01-19T21:09:29.509Z', '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-120', 'demo-session-18', 'demo-q1-1', 'demo-choice-1', NULL, '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-121', 'demo-session-18', 'demo-q2-1', 'demo-choice-6', NULL, '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-122', 'demo-session-18', 'demo-q3-1', 'demo-choice-11', NULL, '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-123', 'demo-session-18', 'demo-q4-1', 'demo-choice-17', NULL, '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-124', 'demo-session-18', 'demo-q7-1', NULL, '辛いメニューがあると嬉しいです。', '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-125', 'demo-session-18', 'demo-q5a-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-01-19T21:09:29.509Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-126', 'demo-session-18', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-01-19T21:09:29.509Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-19', 'demo-survey-1', 'ランチで伺いました。料理の味付けが絶妙で、特にパスタが美味しかったです。また来たいです。', 'completed', false, '2026-02-04T16:00:49.101Z', '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-127', 'demo-session-19', 'demo-q1-1', 'demo-choice-1', NULL, '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-128', 'demo-session-19', 'demo-q2-1', 'demo-choice-8', NULL, '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-129', 'demo-session-19', 'demo-q3-1', 'demo-choice-12', NULL, '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-130', 'demo-session-19', 'demo-q4-1', 'demo-choice-16', NULL, '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-131', 'demo-session-19', 'demo-q7-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-132', 'demo-session-19', 'demo-q5a-1', NULL, 'サラダの種類が豊富で良いですね。', '2026-02-04T16:00:49.101Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-133', 'demo-session-19', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-02-04T16:00:49.101Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-20', 'demo-survey-1', 'スタッフの方がとても親切で気持ちよく食事ができました。料理も美味しかったです。', 'completed', false, '2026-03-05T07:40:50.533Z', '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-134', 'demo-session-20', 'demo-q1-1', 'demo-choice-2', NULL, '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-135', 'demo-session-20', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-136', 'demo-session-20', 'demo-q3-1', 'demo-choice-13', NULL, '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-137', 'demo-session-20', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-138', 'demo-session-20', 'demo-q7-1', NULL, '特になし。満足しています。', '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-139', 'demo-session-20', 'demo-q5b-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-03-05T07:40:50.533Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-140', 'demo-session-20', 'demo-q6b-1', 'demo-choice-28', NULL, '2026-03-05T07:40:50.533Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-21', 'demo-survey-1', '友人と一緒に訪問しました。雰囲気が良く、料理も美味しくて大満足です。', 'completed', false, '2026-01-30T22:43:43.720Z', '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-141', 'demo-session-21', 'demo-q1-1', 'demo-choice-1', NULL, '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-142', 'demo-session-21', 'demo-q2-1', 'demo-choice-6', NULL, '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-143', 'demo-session-21', 'demo-q3-1', 'demo-choice-12', NULL, '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-144', 'demo-session-21', 'demo-q4-1', 'demo-choice-17', NULL, '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-145', 'demo-session-21', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-146', 'demo-session-21', 'demo-q5a-1', NULL, '特になし。満足しています。', '2026-01-30T22:43:43.720Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-147', 'demo-session-21', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-01-30T22:43:43.720Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-22', 'demo-survey-1', '初めて来ましたが、メニューが豊富で迷いました。どれも美味しかったのでまた来ます。', 'completed', false, '2026-04-03T19:23:44.703Z', '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-148', 'demo-session-22', 'demo-q1-1', 'demo-choice-1', NULL, '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-149', 'demo-session-22', 'demo-q2-1', 'demo-choice-6', NULL, '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-150', 'demo-session-22', 'demo-q3-1', 'demo-choice-11', NULL, '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-151', 'demo-session-22', 'demo-q4-1', 'demo-choice-17', NULL, '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-152', 'demo-session-22', 'demo-q7-1', NULL, 'パスタが特に美味しかったです。', '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-153', 'demo-session-22', 'demo-q5a-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-04-03T19:23:44.703Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-154', 'demo-session-22', 'demo-q6b-1', 'demo-choice-27', NULL, '2026-04-03T19:23:44.703Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-23', 'demo-survey-1', 'コスパが良く、味も接客も満足です。ランチタイムは混むので早めに行くのがおすすめ。', 'completed', false, '2026-02-27T04:06:43.557Z', '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-155', 'demo-session-23', 'demo-q1-1', 'demo-choice-1', NULL, '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-156', 'demo-session-23', 'demo-q2-1', 'demo-choice-6', NULL, '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-157', 'demo-session-23', 'demo-q3-1', 'demo-choice-11', NULL, '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-158', 'demo-session-23', 'demo-q4-1', 'demo-choice-16', NULL, '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-159', 'demo-session-23', 'demo-q7-1', NULL, 'サラダの種類が豊富で良いですね。', '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-160', 'demo-session-23', 'demo-q5a-1', NULL, '特になし。満足しています。', '2026-02-27T04:06:43.557Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-161', 'demo-session-23', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-02-27T04:06:43.557Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-24', 'demo-survey-1', 'デザートが特に美味しかったです。店内も清潔で居心地が良かったです。', 'completed', false, '2026-03-26T13:45:25.134Z', '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-162', 'demo-session-24', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-163', 'demo-session-24', 'demo-q2-1', 'demo-choice-8', NULL, '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-164', 'demo-session-24', 'demo-q3-1', 'demo-choice-11', NULL, '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-165', 'demo-session-24', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-166', 'demo-session-24', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-167', 'demo-session-24', 'demo-q5a-1', NULL, 'パスタが特に美味しかったです。', '2026-03-26T13:45:25.134Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-168', 'demo-session-24', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-03-26T13:45:25.134Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-25', 'demo-survey-1', '子連れでも安心して食事ができました。キッズメニューがあるのが嬉しいです。', 'completed', false, '2026-03-14T23:29:29.382Z', '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-169', 'demo-session-25', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-170', 'demo-session-25', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-171', 'demo-session-25', 'demo-q3-1', 'demo-choice-12', NULL, '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-172', 'demo-session-25', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-173', 'demo-session-25', 'demo-q7-1', NULL, '特になし。満足しています。', '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-174', 'demo-session-25', 'demo-q5a-1', NULL, '季節の限定メニューが楽しみです。', '2026-03-14T23:29:29.382Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-175', 'demo-session-25', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-03-14T23:29:29.382Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-26', 'demo-survey-1', '記念日に利用しました。特別な料理を出していただき、素敵な時間を過ごせました。', 'completed', false, '2026-02-22T08:43:34.322Z', '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-176', 'demo-session-26', 'demo-q1-1', 'demo-choice-1', NULL, '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-177', 'demo-session-26', 'demo-q2-1', 'demo-choice-6', NULL, '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-178', 'demo-session-26', 'demo-q3-1', 'demo-choice-11', NULL, '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-179', 'demo-session-26', 'demo-q4-1', 'demo-choice-18', NULL, '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-180', 'demo-session-26', 'demo-q7-1', NULL, 'デザートのバリエーションを増やしてほしいです。', '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-181', 'demo-session-26', 'demo-q5b-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-02-22T08:43:34.322Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-182', 'demo-session-26', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-02-22T08:43:34.322Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-27', 'demo-survey-1', '仕事帰りに立ち寄りました。疲れた体に美味しい料理が染みました。また行きます。', 'completed', false, '2026-01-27T10:25:59.544Z', '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-183', 'demo-session-27', 'demo-q1-1', 'demo-choice-1', NULL, '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-184', 'demo-session-27', 'demo-q2-1', 'demo-choice-7', NULL, '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-185', 'demo-session-27', 'demo-q3-1', 'demo-choice-12', NULL, '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-186', 'demo-session-27', 'demo-q4-1', 'demo-choice-17', NULL, '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-187', 'demo-session-27', 'demo-q7-1', NULL, '辛いメニューがあると嬉しいです。', '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-188', 'demo-session-27', 'demo-q5a-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-01-27T10:25:59.544Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-189', 'demo-session-27', 'demo-q6b-1', 'demo-choice-26', NULL, '2026-01-27T10:25:59.544Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-28', 'demo-survey-1', '予約なしで行きましたが、すぐに案内してもらえました。料理も早く出てきて助かりました。', 'completed', false, '2026-01-16T08:31:01.387Z', '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-190', 'demo-session-28', 'demo-q1-1', 'demo-choice-1', NULL, '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-191', 'demo-session-28', 'demo-q2-1', 'demo-choice-7', NULL, '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-192', 'demo-session-28', 'demo-q3-1', 'demo-choice-12', NULL, '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-193', 'demo-session-28', 'demo-q4-1', 'demo-choice-18', NULL, '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-194', 'demo-session-28', 'demo-q7-1', NULL, 'パスタが特に美味しかったです。', '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-195', 'demo-session-28', 'demo-q5a-1', NULL, 'パスタが特に美味しかったです。', '2026-01-16T08:31:01.387Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-196', 'demo-session-28', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-01-16T08:31:01.387Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-29', 'demo-survey-1', '季節のメニューが楽しめるのが良いです。今回は秋の限定メニューを堪能しました。', 'completed', false, '2026-01-08T02:10:42.489Z', '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-197', 'demo-session-29', 'demo-q1-1', 'demo-choice-2', NULL, '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-198', 'demo-session-29', 'demo-q2-1', 'demo-choice-7', NULL, '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-199', 'demo-session-29', 'demo-q3-1', 'demo-choice-11', NULL, '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-200', 'demo-session-29', 'demo-q4-1', 'demo-choice-17', NULL, '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-201', 'demo-session-29', 'demo-q7-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-202', 'demo-session-29', 'demo-q5a-1', NULL, 'ランチセットがお得で嬉しいです。', '2026-01-08T02:10:42.489Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-203', 'demo-session-29', 'demo-q6a-1', 'demo-choice-22', NULL, '2026-01-08T02:10:42.489Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-30', 'demo-survey-1', 'テイクアウトも利用しましたが、店内と変わらず美味しかったです。', 'completed', false, '2026-03-27T10:49:56.474Z', '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-204', 'demo-session-30', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-205', 'demo-session-30', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-206', 'demo-session-30', 'demo-q3-1', 'demo-choice-11', NULL, '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-207', 'demo-session-30', 'demo-q4-1', 'demo-choice-17', NULL, '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-208', 'demo-session-30', 'demo-q7-1', NULL, 'デザートのバリエーションを増やしてほしいです。', '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-209', 'demo-session-30', 'demo-q5a-1', NULL, 'ドリンクメニューが充実していて良いです。', '2026-03-27T10:49:56.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-210', 'demo-session-30', 'demo-q6b-1', 'demo-choice-28', NULL, '2026-03-27T10:49:56.474Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-31', 'demo-survey-1', '料理の盛り付けが綺麗で、目でも楽しめました。味ももちろん最高です。', 'completed', false, '2026-03-15T20:42:33.745Z', '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-211', 'demo-session-31', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-212', 'demo-session-31', 'demo-q2-1', 'demo-choice-6', NULL, '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-213', 'demo-session-31', 'demo-q3-1', 'demo-choice-11', NULL, '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-214', 'demo-session-31', 'demo-q4-1', 'demo-choice-16', NULL, '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-215', 'demo-session-31', 'demo-q7-1', NULL, '特になし。満足しています。', '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-216', 'demo-session-31', 'demo-q5a-1', NULL, '季節の限定メニューが楽しみです。', '2026-03-15T20:42:33.745Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-217', 'demo-session-31', 'demo-q6a-1', 'demo-choice-23', NULL, '2026-03-15T20:42:33.745Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-32', 'demo-survey-1', '常連になりつつあります。いつ来ても安定した美味しさで安心します。', 'completed', false, '2026-02-05T03:36:12.797Z', '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-218', 'demo-session-32', 'demo-q1-1', 'demo-choice-2', NULL, '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-219', 'demo-session-32', 'demo-q2-1', 'demo-choice-6', NULL, '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-220', 'demo-session-32', 'demo-q3-1', 'demo-choice-13', NULL, '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-221', 'demo-session-32', 'demo-q4-1', 'demo-choice-17', NULL, '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-222', 'demo-session-32', 'demo-q7-1', NULL, 'デザートのバリエーションを増やしてほしいです。', '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-223', 'demo-session-32', 'demo-q5b-1', NULL, 'デザートのバリエーションを増やしてほしいです。', '2026-02-05T03:36:12.797Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-224', 'demo-session-32', 'demo-q6b-1', 'demo-choice-27', NULL, '2026-02-05T03:36:12.797Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-33', 'demo-survey-1', '新メニューを試しましたが期待以上でした。スタッフのおすすめは間違いないですね。', 'completed', false, '2026-03-23T04:35:28.915Z', '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-225', 'demo-session-33', 'demo-q1-1', 'demo-choice-1', NULL, '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-226', 'demo-session-33', 'demo-q2-1', 'demo-choice-8', NULL, '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-227', 'demo-session-33', 'demo-q3-1', 'demo-choice-11', NULL, '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-228', 'demo-session-33', 'demo-q4-1', 'demo-choice-17', NULL, '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-229', 'demo-session-33', 'demo-q7-1', NULL, '季節の限定メニューが楽しみです。', '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-230', 'demo-session-33', 'demo-q5b-1', NULL, 'サラダの種類が豊富で良いですね。', '2026-03-23T04:35:28.915Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-231', 'demo-session-33', 'demo-q6a-1', 'demo-choice-21', NULL, '2026-03-23T04:35:28.915Z');

-- ============================================
-- Shop 2: デモ整骨院
-- ============================================
INSERT INTO "User" (id, email, "loginId", password, name, role, "shopName", address, industry, "noContractLimit", "planType", "planReviewLimit", "createdAt", "updatedAt")
VALUES ('demo-user-2', 'demo2@kuchikomi.jp', 'AG-000002', '$2a$10$V5h/b24p0tNw34DJ9T7TkOxGaOubUwBnvLOALbMPZFtvr2wsIJi0y', 'デモ整骨院管理者', 'admin', 'デモ整骨院', '東京都渋谷区demo2', '整骨院', true, 'premium', 0, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z');

INSERT INTO "Survey" (id, title, "openingMessage", "closingMessage", "completionMessage", keywords, "toneRandom", "googleBusinessUrl", "minRandomQuestions", "maxRandomQuestions", "isActive", "monthlyReviewLimit", "monthlyReviewCount", "createdAt", "updatedAt", "userId")
VALUES ('demo-survey-2', 'デモ整骨院アンケート', 'ご来院ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。', 'アンケートにご協力いただきありがとうございました。', 'ご回答ありがとうございました。お体のお悩みがありましたらいつでもご相談ください。', '施術,効果,丁寧,清潔,改善', true, 'https://g.page/demo-seikotsuin', 1, 1, true, 100, 0, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z', 'demo-user-2');

INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-2-1', '敬体（です・ます調）', true, 1, 'demo-survey-2');
INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-2-2', 'カジュアルな口調', true, 2, 'demo-survey-2');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q1-2', '施術の効果は感じられましたか？', 1, 'choice', false, NULL, 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-31', '非常に満足', 1, 2, 'demo-q1-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-32', '満足', 2, 1, 'demo-q1-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-33', 'どちらとも言えない', 3, 0, 'demo-q1-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-34', 'やや不満', 4, -1, 'demo-q1-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-35', '不満', 5, -2, 'demo-q1-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q2-2', 'スタッフの対応はいかがでしたか？', 2, 'choice', false, NULL, 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-36', '非常に満足', 1, 2, 'demo-q2-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-37', '満足', 2, 1, 'demo-q2-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-38', 'どちらとも言えない', 3, 0, 'demo-q2-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-39', 'やや不満', 4, -1, 'demo-q2-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-40', '不満', 5, -2, 'demo-q2-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q3-2', '院内の清潔感はいかがでしたか？', 3, 'choice', false, NULL, 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-41', '非常に満足', 1, 2, 'demo-q3-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-42', '満足', 2, 1, 'demo-q3-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-43', 'どちらとも言えない', 3, 0, 'demo-q3-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-44', 'やや不満', 4, -1, 'demo-q3-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-45', '不満', 5, -2, 'demo-q3-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q4-2', '待ち時間は適切でしたか？', 4, 'choice', false, NULL, 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-46', '非常に満足', 1, 2, 'demo-q4-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-47', '満足', 2, 1, 'demo-q4-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-48', 'どちらとも言えない', 3, 0, 'demo-q4-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-49', 'やや不満', 4, -1, 'demo-q4-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-50', '不満', 5, -2, 'demo-q4-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5a-2', '症状の説明はわかりやすかったですか？', 5, 'choice', true, '説明', 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-51', '非常に満足', 1, 2, 'demo-q5a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-52', '満足', 2, 1, 'demo-q5a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-53', 'どちらとも言えない', 3, 0, 'demo-q5a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-54', 'やや不満', 4, -1, 'demo-q5a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-55', '不満', 5, -2, 'demo-q5a-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5b-2', '施術内容の説明は十分でしたか？', 6, 'choice', true, '説明', 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-56', '非常に満足', 1, 2, 'demo-q5b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-57', '満足', 2, 1, 'demo-q5b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-58', 'どちらとも言えない', 3, 0, 'demo-q5b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-59', 'やや不満', 4, -1, 'demo-q5b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-60', '不満', 5, -2, 'demo-q5b-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q6a-2', '継続して通いたいと思いますか？', 7, 'choice', true, '通院', 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-61', '非常に満足', 1, 2, 'demo-q6a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-62', '満足', 2, 1, 'demo-q6a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-63', 'どちらとも言えない', 3, 0, 'demo-q6a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-64', 'やや不満', 4, -1, 'demo-q6a-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-65', '不満', 5, -2, 'demo-q6a-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q6b-2', '他の方にもおすすめしたいですか？', 8, 'choice', true, '通院', 'demo-survey-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-66', '非常に満足', 1, 2, 'demo-q6b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-67', '満足', 2, 1, 'demo-q6b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-68', 'どちらとも言えない', 3, 0, 'demo-q6b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-69', 'やや不満', 4, -1, 'demo-q6b-2');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-70', '不満', 5, -2, 'demo-q6b-2');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q7-2', '改善して欲しい点があればお聞かせください', 9, 'text', false, NULL, 'demo-survey-2');

-- Sessions for デモ整骨院
INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-34', 'demo-survey-2', '長年の肩こりが嘘のように楽になりました。先生の技術に感謝しています。', 'completed', false, '2026-01-11T22:09:42.560Z', '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-232', 'demo-session-34', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-233', 'demo-session-34', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-234', 'demo-session-34', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-235', 'demo-session-34', 'demo-q4-2', 'demo-choice-46', NULL, '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-236', 'demo-session-34', 'demo-q7-2', NULL, '首のこりも見てもらいたいです。', '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-237', 'demo-session-34', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-11T22:09:42.560Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-238', 'demo-session-34', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-11T22:09:42.560Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-35', 'demo-survey-2', '丁寧に症状を聞いてくれて、的確な施術をしてくれました。信頼できる院です。', 'completed', false, '2026-02-16T19:39:39.885Z', '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-239', 'demo-session-35', 'demo-q1-2', 'demo-choice-31', NULL, '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-240', 'demo-session-35', 'demo-q2-2', 'demo-choice-37', NULL, '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-241', 'demo-session-35', 'demo-q3-2', 'demo-choice-43', NULL, '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-242', 'demo-session-35', 'demo-q4-2', 'demo-choice-46', NULL, '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-243', 'demo-session-35', 'demo-q7-2', NULL, '首のこりも見てもらいたいです。', '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-244', 'demo-session-35', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-02-16T19:39:39.885Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-245', 'demo-session-35', 'demo-q6b-2', 'demo-choice-66', NULL, '2026-02-16T19:39:39.885Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-36', 'demo-survey-2', '初めての整骨院でしたが、説明が丁寧で安心して施術を受けられました。', 'completed', false, '2026-01-30T02:28:04.987Z', '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-246', 'demo-session-36', 'demo-q1-2', 'demo-choice-32', NULL, '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-247', 'demo-session-36', 'demo-q2-2', 'demo-choice-37', NULL, '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-248', 'demo-session-36', 'demo-q3-2', 'demo-choice-43', NULL, '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-249', 'demo-session-36', 'demo-q4-2', 'demo-choice-46', NULL, '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-250', 'demo-session-36', 'demo-q7-2', NULL, '特にありません。とても満足しています。', '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-251', 'demo-session-36', 'demo-q5b-2', 'demo-choice-57', NULL, '2026-01-30T02:28:04.987Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-252', 'demo-session-36', 'demo-q6b-2', 'demo-choice-67', NULL, '2026-01-30T02:28:04.987Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-37', 'demo-survey-2', '腰痛がひどかったのですが、数回通って改善しました。先生ありがとうございます。', 'completed', false, '2026-01-18T00:26:25.295Z', '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-253', 'demo-session-37', 'demo-q1-2', 'demo-choice-32', NULL, '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-254', 'demo-session-37', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-255', 'demo-session-37', 'demo-q3-2', 'demo-choice-42', NULL, '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-256', 'demo-session-37', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-257', 'demo-session-37', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-258', 'demo-session-37', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-18T00:26:25.295Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-259', 'demo-session-37', 'demo-q6b-2', 'demo-choice-67', NULL, '2026-01-18T00:26:25.295Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-38', 'demo-survey-2', '院内がとても清潔で、リラックスして施術を受けることができました。', 'completed', false, '2026-01-12T08:36:38.914Z', '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-260', 'demo-session-38', 'demo-q1-2', 'demo-choice-32', NULL, '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-261', 'demo-session-38', 'demo-q2-2', 'demo-choice-37', NULL, '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-262', 'demo-session-38', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-263', 'demo-session-38', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-264', 'demo-session-38', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-265', 'demo-session-38', 'demo-q5b-2', 'demo-choice-56', NULL, '2026-01-12T08:36:38.914Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-266', 'demo-session-38', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-12T08:36:38.914Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-39', 'demo-survey-2', '予約制なので待ち時間がほとんどなく、忙しい人にもおすすめです。', 'completed', false, '2026-03-17T18:35:26.122Z', '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-267', 'demo-session-39', 'demo-q1-2', 'demo-choice-31', NULL, '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-268', 'demo-session-39', 'demo-q2-2', 'demo-choice-37', NULL, '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-269', 'demo-session-39', 'demo-q3-2', 'demo-choice-41', NULL, '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-270', 'demo-session-39', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-271', 'demo-session-39', 'demo-q7-2', NULL, '自宅ケアの資料があると嬉しいです。', '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-272', 'demo-session-39', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-03-17T18:35:26.122Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-273', 'demo-session-39', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-03-17T18:35:26.122Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-40', 'demo-survey-2', 'スタッフの皆さんが明るくて、通うのが楽しみになっています。', 'completed', false, '2026-02-15T01:32:17.788Z', '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-274', 'demo-session-40', 'demo-q1-2', 'demo-choice-31', NULL, '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-275', 'demo-session-40', 'demo-q2-2', 'demo-choice-37', NULL, '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-276', 'demo-session-40', 'demo-q3-2', 'demo-choice-42', NULL, '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-277', 'demo-session-40', 'demo-q4-2', 'demo-choice-46', NULL, '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-278', 'demo-session-40', 'demo-q7-2', NULL, '駐車場がもう少し広いと嬉しいです。', '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-279', 'demo-session-40', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-02-15T01:32:17.788Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-280', 'demo-session-40', 'demo-q6b-2', 'demo-choice-67', NULL, '2026-02-15T01:32:17.788Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-41', 'demo-survey-2', '施術後は体が軽くなります。定期的に通いたいと思える整骨院です。', 'completed', false, '2026-01-19T01:02:50.477Z', '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-281', 'demo-session-41', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-282', 'demo-session-41', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-283', 'demo-session-41', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-284', 'demo-session-41', 'demo-q4-2', 'demo-choice-46', NULL, '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-285', 'demo-session-41', 'demo-q7-2', NULL, 'ストレッチのアドバイスが参考になりました。', '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-286', 'demo-session-41', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-19T01:02:50.477Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-287', 'demo-session-41', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-01-19T01:02:50.477Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-42', 'demo-survey-2', '姿勢の矯正をしてもらいました。普段の姿勢のアドバイスも丁寧にくれます。', 'completed', false, '2026-03-09T08:49:57.060Z', '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-288', 'demo-session-42', 'demo-q1-2', 'demo-choice-31', NULL, '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-289', 'demo-session-42', 'demo-q2-2', 'demo-choice-37', NULL, '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-290', 'demo-session-42', 'demo-q3-2', 'demo-choice-41', NULL, '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-291', 'demo-session-42', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-292', 'demo-session-42', 'demo-q7-2', NULL, '週末も営業してくれると助かります。', '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-293', 'demo-session-42', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-03-09T08:49:57.060Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-294', 'demo-session-42', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-03-09T08:49:57.060Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-43', 'demo-survey-2', '交通事故の後遺症で通い始めましたが、少しずつ改善しています。', 'completed', false, '2026-03-05T19:34:02.495Z', '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-295', 'demo-session-43', 'demo-q1-2', 'demo-choice-33', NULL, '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-296', 'demo-session-43', 'demo-q2-2', 'demo-choice-36', NULL, '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-297', 'demo-session-43', 'demo-q3-2', 'demo-choice-41', NULL, '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-298', 'demo-session-43', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-299', 'demo-session-43', 'demo-q7-2', NULL, '自宅ケアの資料があると嬉しいです。', '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-300', 'demo-session-43', 'demo-q5b-2', 'demo-choice-56', NULL, '2026-03-05T19:34:02.495Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-301', 'demo-session-43', 'demo-q6b-2', 'demo-choice-66', NULL, '2026-03-05T19:34:02.495Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-44', 'demo-survey-2', '料金が明確で安心して通えます。施術の効果も実感できています。', 'completed', false, '2026-03-18T19:38:30.050Z', '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-302', 'demo-session-44', 'demo-q1-2', 'demo-choice-32', NULL, '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-303', 'demo-session-44', 'demo-q2-2', 'demo-choice-36', NULL, '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-304', 'demo-session-44', 'demo-q3-2', 'demo-choice-43', NULL, '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-305', 'demo-session-44', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-306', 'demo-session-44', 'demo-q7-2', NULL, '自宅ケアの資料があると嬉しいです。', '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-307', 'demo-session-44', 'demo-q5b-2', 'demo-choice-56', NULL, '2026-03-18T19:38:30.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-308', 'demo-session-44', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-03-18T19:38:30.050Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-45', 'demo-survey-2', '首の痛みで来院しましたが、原因を丁寧に説明してくれて納得の施術でした。', 'completed', false, '2026-03-27T06:45:24.508Z', '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-309', 'demo-session-45', 'demo-q1-2', 'demo-choice-32', NULL, '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-310', 'demo-session-45', 'demo-q2-2', 'demo-choice-36', NULL, '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-311', 'demo-session-45', 'demo-q3-2', 'demo-choice-42', NULL, '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-312', 'demo-session-45', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-313', 'demo-session-45', 'demo-q7-2', NULL, '駐車場がもう少し広いと嬉しいです。', '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-314', 'demo-session-45', 'demo-q5a-2', 'demo-choice-52', NULL, '2026-03-27T06:45:24.508Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-315', 'demo-session-45', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-03-27T06:45:24.508Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-46', 'demo-survey-2', '夜遅くまでやっているので、仕事帰りに通えて助かっています。', 'completed', false, '2026-02-18T06:09:42.117Z', '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-316', 'demo-session-46', 'demo-q1-2', 'demo-choice-33', NULL, '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-317', 'demo-session-46', 'demo-q2-2', 'demo-choice-36', NULL, '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-318', 'demo-session-46', 'demo-q3-2', 'demo-choice-42', NULL, '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-319', 'demo-session-46', 'demo-q4-2', 'demo-choice-46', NULL, '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-320', 'demo-session-46', 'demo-q7-2', NULL, 'ストレッチのアドバイスが参考になりました。', '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-321', 'demo-session-46', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-02-18T06:09:42.117Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-322', 'demo-session-46', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-02-18T06:09:42.117Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-47', 'demo-survey-2', '施術だけでなく、自宅でのストレッチも教えてもらえるのが嬉しいです。', 'completed', false, '2026-02-05T10:16:16.481Z', '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-323', 'demo-session-47', 'demo-q1-2', 'demo-choice-32', NULL, '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-324', 'demo-session-47', 'demo-q2-2', 'demo-choice-36', NULL, '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-325', 'demo-session-47', 'demo-q3-2', 'demo-choice-42', NULL, '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-326', 'demo-session-47', 'demo-q4-2', 'demo-choice-46', NULL, '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-327', 'demo-session-47', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-328', 'demo-session-47', 'demo-q5b-2', 'demo-choice-57', NULL, '2026-02-05T10:16:16.481Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-329', 'demo-session-47', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-02-05T10:16:16.481Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-48', 'demo-survey-2', '友人の紹介で来ました。評判通り、腕の良い先生です。紹介して正解でした。', 'completed', false, '2026-04-04T10:44:58.561Z', '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-330', 'demo-session-48', 'demo-q1-2', 'demo-choice-32', NULL, '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-331', 'demo-session-48', 'demo-q2-2', 'demo-choice-36', NULL, '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-332', 'demo-session-48', 'demo-q3-2', 'demo-choice-42', NULL, '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-333', 'demo-session-48', 'demo-q4-2', 'demo-choice-48', NULL, '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-334', 'demo-session-48', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-335', 'demo-session-48', 'demo-q5b-2', 'demo-choice-57', NULL, '2026-04-04T10:44:58.561Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-336', 'demo-session-48', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-04-04T10:44:58.561Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-49', 'demo-survey-2', '膝の痛みが改善しました。先生の説明がわかりやすく、通うモチベーションが上がります。', 'completed', false, '2026-01-19T09:19:23.474Z', '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-337', 'demo-session-49', 'demo-q1-2', 'demo-choice-32', NULL, '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-338', 'demo-session-49', 'demo-q2-2', 'demo-choice-37', NULL, '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-339', 'demo-session-49', 'demo-q3-2', 'demo-choice-42', NULL, '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-340', 'demo-session-49', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-341', 'demo-session-49', 'demo-q7-2', NULL, '駐車場がもう少し広いと嬉しいです。', '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-342', 'demo-session-49', 'demo-q5b-2', 'demo-choice-58', NULL, '2026-01-19T09:19:23.474Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-343', 'demo-session-49', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-01-19T09:19:23.474Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-50', 'demo-survey-2', 'アットホームな雰囲気で初めてでも緊張しませんでした。技術も確かです。', 'completed', false, '2026-01-12T23:28:15.884Z', '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-344', 'demo-session-50', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-345', 'demo-session-50', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-346', 'demo-session-50', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-347', 'demo-session-50', 'demo-q4-2', 'demo-choice-46', NULL, '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-348', 'demo-session-50', 'demo-q7-2', NULL, '駐車場がもう少し広いと嬉しいです。', '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-349', 'demo-session-50', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-12T23:28:15.884Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-350', 'demo-session-50', 'demo-q6b-2', 'demo-choice-67', NULL, '2026-01-12T23:28:15.884Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-51', 'demo-survey-2', '長年の肩こりが嘘のように楽になりました。先生の技術に感謝しています。', 'completed', false, '2026-02-14T00:53:09.603Z', '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-351', 'demo-session-51', 'demo-q1-2', 'demo-choice-31', NULL, '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-352', 'demo-session-51', 'demo-q2-2', 'demo-choice-36', NULL, '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-353', 'demo-session-51', 'demo-q3-2', 'demo-choice-41', NULL, '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-354', 'demo-session-51', 'demo-q4-2', 'demo-choice-47', NULL, '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-355', 'demo-session-51', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-356', 'demo-session-51', 'demo-q5b-2', 'demo-choice-57', NULL, '2026-02-14T00:53:09.603Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-357', 'demo-session-51', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-02-14T00:53:09.603Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-52', 'demo-survey-2', '丁寧に症状を聞いてくれて、的確な施術をしてくれました。信頼できる院です。', 'completed', false, '2026-02-14T05:37:09.577Z', '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-358', 'demo-session-52', 'demo-q1-2', 'demo-choice-31', NULL, '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-359', 'demo-session-52', 'demo-q2-2', 'demo-choice-37', NULL, '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-360', 'demo-session-52', 'demo-q3-2', 'demo-choice-42', NULL, '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-361', 'demo-session-52', 'demo-q4-2', 'demo-choice-46', NULL, '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-362', 'demo-session-52', 'demo-q7-2', NULL, 'スタッフの皆さんが優しくて安心します。', '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-363', 'demo-session-52', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-02-14T05:37:09.577Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-364', 'demo-session-52', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-02-14T05:37:09.577Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-53', 'demo-survey-2', '初めての整骨院でしたが、説明が丁寧で安心して施術を受けられました。', 'completed', false, '2026-01-29T00:54:21.501Z', '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-365', 'demo-session-53', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-366', 'demo-session-53', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-367', 'demo-session-53', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-368', 'demo-session-53', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-369', 'demo-session-53', 'demo-q7-2', NULL, '駐車場がもう少し広いと嬉しいです。', '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-370', 'demo-session-53', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-29T00:54:21.501Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-371', 'demo-session-53', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-29T00:54:21.501Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-54', 'demo-survey-2', '腰痛がひどかったのですが、数回通って改善しました。先生ありがとうございます。', 'completed', false, '2026-01-10T21:23:59.541Z', '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-372', 'demo-session-54', 'demo-q1-2', 'demo-choice-32', NULL, '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-373', 'demo-session-54', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-374', 'demo-session-54', 'demo-q3-2', 'demo-choice-42', NULL, '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-375', 'demo-session-54', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-376', 'demo-session-54', 'demo-q7-2', NULL, '首のこりも見てもらいたいです。', '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-377', 'demo-session-54', 'demo-q5a-2', 'demo-choice-52', NULL, '2026-01-10T21:23:59.541Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-378', 'demo-session-54', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-10T21:23:59.541Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-55', 'demo-survey-2', '院内がとても清潔で、リラックスして施術を受けることができました。', 'completed', false, '2026-01-07T07:55:08.920Z', '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-379', 'demo-session-55', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-380', 'demo-session-55', 'demo-q2-2', 'demo-choice-38', NULL, '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-381', 'demo-session-55', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-382', 'demo-session-55', 'demo-q4-2', 'demo-choice-46', NULL, '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-383', 'demo-session-55', 'demo-q7-2', NULL, '自宅ケアの資料があると嬉しいです。', '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-384', 'demo-session-55', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-07T07:55:08.920Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-385', 'demo-session-55', 'demo-q6a-2', 'demo-choice-63', NULL, '2026-01-07T07:55:08.920Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-56', 'demo-survey-2', '予約制なので待ち時間がほとんどなく、忙しい人にもおすすめです。', 'completed', false, '2026-02-13T05:22:09.889Z', '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-386', 'demo-session-56', 'demo-q1-2', 'demo-choice-31', NULL, '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-387', 'demo-session-56', 'demo-q2-2', 'demo-choice-38', NULL, '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-388', 'demo-session-56', 'demo-q3-2', 'demo-choice-41', NULL, '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-389', 'demo-session-56', 'demo-q4-2', 'demo-choice-48', NULL, '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-390', 'demo-session-56', 'demo-q7-2', NULL, '首のこりも見てもらいたいです。', '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-391', 'demo-session-56', 'demo-q5b-2', 'demo-choice-57', NULL, '2026-02-13T05:22:09.889Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-392', 'demo-session-56', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-02-13T05:22:09.889Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-57', 'demo-survey-2', 'スタッフの皆さんが明るくて、通うのが楽しみになっています。', 'completed', false, '2026-01-18T07:33:42.463Z', '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-393', 'demo-session-57', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-394', 'demo-session-57', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-395', 'demo-session-57', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-396', 'demo-session-57', 'demo-q4-2', 'demo-choice-46', NULL, '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-397', 'demo-session-57', 'demo-q7-2', NULL, 'スタッフの皆さんが優しくて安心します。', '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-398', 'demo-session-57', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-18T07:33:42.463Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-399', 'demo-session-57', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-18T07:33:42.463Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-58', 'demo-survey-2', '施術後は体が軽くなります。定期的に通いたいと思える整骨院です。', 'completed', false, '2026-03-04T23:43:31.443Z', '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-400', 'demo-session-58', 'demo-q1-2', 'demo-choice-33', NULL, '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-401', 'demo-session-58', 'demo-q2-2', 'demo-choice-36', NULL, '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-402', 'demo-session-58', 'demo-q3-2', 'demo-choice-41', NULL, '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-403', 'demo-session-58', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-404', 'demo-session-58', 'demo-q7-2', NULL, '自宅ケアの資料があると嬉しいです。', '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-405', 'demo-session-58', 'demo-q5a-2', 'demo-choice-52', NULL, '2026-03-04T23:43:31.443Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-406', 'demo-session-58', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-03-04T23:43:31.443Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-59', 'demo-survey-2', '姿勢の矯正をしてもらいました。普段の姿勢のアドバイスも丁寧にくれます。', 'completed', false, '2026-02-04T13:47:51.388Z', '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-407', 'demo-session-59', 'demo-q1-2', 'demo-choice-32', NULL, '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-408', 'demo-session-59', 'demo-q2-2', 'demo-choice-36', NULL, '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-409', 'demo-session-59', 'demo-q3-2', 'demo-choice-41', NULL, '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-410', 'demo-session-59', 'demo-q4-2', 'demo-choice-46', NULL, '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-411', 'demo-session-59', 'demo-q7-2', NULL, '首のこりも見てもらいたいです。', '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-412', 'demo-session-59', 'demo-q5a-2', 'demo-choice-52', NULL, '2026-02-04T13:47:51.388Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-413', 'demo-session-59', 'demo-q6a-2', 'demo-choice-63', NULL, '2026-02-04T13:47:51.388Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-60', 'demo-survey-2', '交通事故の後遺症で通い始めましたが、少しずつ改善しています。', 'completed', false, '2026-01-27T02:57:15.138Z', '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-414', 'demo-session-60', 'demo-q1-2', 'demo-choice-32', NULL, '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-415', 'demo-session-60', 'demo-q2-2', 'demo-choice-37', NULL, '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-416', 'demo-session-60', 'demo-q3-2', 'demo-choice-42', NULL, '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-417', 'demo-session-60', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-418', 'demo-session-60', 'demo-q7-2', NULL, 'ストレッチのアドバイスが参考になりました。', '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-419', 'demo-session-60', 'demo-q5a-2', 'demo-choice-52', NULL, '2026-01-27T02:57:15.138Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-420', 'demo-session-60', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-01-27T02:57:15.138Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-61', 'demo-survey-2', '料金が明確で安心して通えます。施術の効果も実感できています。', 'completed', false, '2026-03-19T14:32:40.313Z', '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-421', 'demo-session-61', 'demo-q1-2', 'demo-choice-31', NULL, '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-422', 'demo-session-61', 'demo-q2-2', 'demo-choice-37', NULL, '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-423', 'demo-session-61', 'demo-q3-2', 'demo-choice-41', NULL, '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-424', 'demo-session-61', 'demo-q4-2', 'demo-choice-47', NULL, '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-425', 'demo-session-61', 'demo-q7-2', NULL, '駐車場がもう少し広いと嬉しいです。', '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-426', 'demo-session-61', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-03-19T14:32:40.313Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-427', 'demo-session-61', 'demo-q6a-2', 'demo-choice-62', NULL, '2026-03-19T14:32:40.313Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-62', 'demo-survey-2', '首の痛みで来院しましたが、原因を丁寧に説明してくれて納得の施術でした。', 'completed', false, '2026-02-19T05:28:48.666Z', '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-428', 'demo-session-62', 'demo-q1-2', 'demo-choice-32', NULL, '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-429', 'demo-session-62', 'demo-q2-2', 'demo-choice-36', NULL, '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-430', 'demo-session-62', 'demo-q3-2', 'demo-choice-41', NULL, '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-431', 'demo-session-62', 'demo-q4-2', 'demo-choice-47', NULL, '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-432', 'demo-session-62', 'demo-q7-2', NULL, '自宅ケアの資料があると嬉しいです。', '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-433', 'demo-session-62', 'demo-q5b-2', 'demo-choice-57', NULL, '2026-02-19T05:28:48.666Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-434', 'demo-session-62', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-02-19T05:28:48.666Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-63', 'demo-survey-2', '夜遅くまでやっているので、仕事帰りに通えて助かっています。', 'completed', false, '2026-03-18T14:15:13.974Z', '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-435', 'demo-session-63', 'demo-q1-2', 'demo-choice-31', NULL, '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-436', 'demo-session-63', 'demo-q2-2', 'demo-choice-38', NULL, '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-437', 'demo-session-63', 'demo-q3-2', 'demo-choice-41', NULL, '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-438', 'demo-session-63', 'demo-q4-2', 'demo-choice-46', NULL, '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-439', 'demo-session-63', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-440', 'demo-session-63', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-03-18T14:15:13.974Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-441', 'demo-session-63', 'demo-q6b-2', 'demo-choice-67', NULL, '2026-03-18T14:15:13.974Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-64', 'demo-survey-2', '施術だけでなく、自宅でのストレッチも教えてもらえるのが嬉しいです。', 'completed', false, '2026-01-17T07:20:57.050Z', '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-442', 'demo-session-64', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-443', 'demo-session-64', 'demo-q2-2', 'demo-choice-38', NULL, '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-444', 'demo-session-64', 'demo-q3-2', 'demo-choice-42', NULL, '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-445', 'demo-session-64', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-446', 'demo-session-64', 'demo-q7-2', NULL, '施術時間がちょうど良かったです。', '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-447', 'demo-session-64', 'demo-q5a-2', 'demo-choice-52', NULL, '2026-01-17T07:20:57.050Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-448', 'demo-session-64', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-17T07:20:57.050Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-65', 'demo-survey-2', '友人の紹介で来ました。評判通り、腕の良い先生です。紹介して正解でした。', 'completed', false, '2026-02-01T21:27:14.038Z', '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-449', 'demo-session-65', 'demo-q1-2', 'demo-choice-31', NULL, '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-450', 'demo-session-65', 'demo-q2-2', 'demo-choice-38', NULL, '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-451', 'demo-session-65', 'demo-q3-2', 'demo-choice-42', NULL, '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-452', 'demo-session-65', 'demo-q4-2', 'demo-choice-47', NULL, '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-453', 'demo-session-65', 'demo-q7-2', NULL, 'スタッフの皆さんが優しくて安心します。', '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-454', 'demo-session-65', 'demo-q5a-2', 'demo-choice-53', NULL, '2026-02-01T21:27:14.038Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-455', 'demo-session-65', 'demo-q6b-2', 'demo-choice-66', NULL, '2026-02-01T21:27:14.038Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-66', 'demo-survey-2', '膝の痛みが改善しました。先生の説明がわかりやすく、通うモチベーションが上がります。', 'completed', false, '2026-01-17T00:14:27.156Z', '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-456', 'demo-session-66', 'demo-q1-2', 'demo-choice-31', NULL, '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-457', 'demo-session-66', 'demo-q2-2', 'demo-choice-36', NULL, '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-458', 'demo-session-66', 'demo-q3-2', 'demo-choice-41', NULL, '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-459', 'demo-session-66', 'demo-q4-2', 'demo-choice-47', NULL, '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-460', 'demo-session-66', 'demo-q7-2', NULL, 'ストレッチのアドバイスが参考になりました。', '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-461', 'demo-session-66', 'demo-q5a-2', 'demo-choice-51', NULL, '2026-01-17T00:14:27.156Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-462', 'demo-session-66', 'demo-q6a-2', 'demo-choice-61', NULL, '2026-01-17T00:14:27.156Z');

-- ============================================
-- Shop 3: デモ美容室
-- ============================================
INSERT INTO "User" (id, email, "loginId", password, name, role, "shopName", address, industry, "noContractLimit", "planType", "planReviewLimit", "createdAt", "updatedAt")
VALUES ('demo-user-3', 'demo3@kuchikomi.jp', 'AG-000003', '$2a$10$V5h/b24p0tNw34DJ9T7TkOxGaOubUwBnvLOALbMPZFtvr2wsIJi0y', 'デモ美容室管理者', 'admin', 'デモ美容室', '東京都渋谷区demo3', '美容室', true, 'premium', 0, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z');

INSERT INTO "Survey" (id, title, "openingMessage", "closingMessage", "completionMessage", keywords, "toneRandom", "googleBusinessUrl", "minRandomQuestions", "maxRandomQuestions", "isActive", "monthlyReviewLimit", "monthlyReviewCount", "createdAt", "updatedAt", "userId")
VALUES ('demo-survey-3', 'デモ美容室アンケート', 'ご来店ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。', 'アンケートにご協力いただきありがとうございました。', 'ご回答ありがとうございました。またのご来店をお待ちしております。', 'カット,カラー,仕上がり,接客,おしゃれ', true, 'https://g.page/demo-biyoushitsu', 1, 1, true, 100, 0, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z', 'demo-user-3');

INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-3-1', '敬体（です・ます調）', true, 1, 'demo-survey-3');
INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-3-2', 'カジュアルな口調', true, 2, 'demo-survey-3');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q1-3', '仕上がりには満足していますか？', 1, 'choice', false, NULL, 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-71', '非常に満足', 1, 2, 'demo-q1-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-72', '満足', 2, 1, 'demo-q1-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-73', 'どちらとも言えない', 3, 0, 'demo-q1-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-74', 'やや不満', 4, -1, 'demo-q1-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-75', '不満', 5, -2, 'demo-q1-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q2-3', 'スタイリストの技術はいかがでしたか？', 2, 'choice', false, NULL, 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-76', '非常に満足', 1, 2, 'demo-q2-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-77', '満足', 2, 1, 'demo-q2-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-78', 'どちらとも言えない', 3, 0, 'demo-q2-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-79', 'やや不満', 4, -1, 'demo-q2-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-80', '不満', 5, -2, 'demo-q2-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q3-3', 'カウンセリングは十分でしたか？', 3, 'choice', false, NULL, 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-81', '非常に満足', 1, 2, 'demo-q3-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-82', '満足', 2, 1, 'demo-q3-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-83', 'どちらとも言えない', 3, 0, 'demo-q3-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-84', 'やや不満', 4, -1, 'demo-q3-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-85', '不満', 5, -2, 'demo-q3-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q4-3', '店内の雰囲気はいかがでしたか？', 4, 'choice', false, NULL, 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-86', '非常に満足', 1, 2, 'demo-q4-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-87', '満足', 2, 1, 'demo-q4-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-88', 'どちらとも言えない', 3, 0, 'demo-q4-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-89', 'やや不満', 4, -1, 'demo-q4-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-90', '不満', 5, -2, 'demo-q4-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5a-3', 'ヘッドスパやトリートメントに興味はありますか？', 5, 'choice', true, 'サービス', 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-91', '非常に満足', 1, 2, 'demo-q5a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-92', '満足', 2, 1, 'demo-q5a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-93', 'どちらとも言えない', 3, 0, 'demo-q5a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-94', 'やや不満', 4, -1, 'demo-q5a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-95', '不満', 5, -2, 'demo-q5a-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5b-3', 'カラーやパーマの仕上がりは？', 6, 'choice', true, 'サービス', 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-96', '非常に満足', 1, 2, 'demo-q5b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-97', '満足', 2, 1, 'demo-q5b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-98', 'どちらとも言えない', 3, 0, 'demo-q5b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-99', 'やや不満', 4, -1, 'demo-q5b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-100', '不満', 5, -2, 'demo-q5b-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q6a-3', '次回も指名したいですか？', 7, 'choice', true, 'リピート', 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-101', '非常に満足', 1, 2, 'demo-q6a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-102', '満足', 2, 1, 'demo-q6a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-103', 'どちらとも言えない', 3, 0, 'demo-q6a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-104', 'やや不満', 4, -1, 'demo-q6a-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-105', '不満', 5, -2, 'demo-q6a-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q6b-3', '友人や家族に紹介したいですか？', 8, 'choice', true, 'リピート', 'demo-survey-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-106', '非常に満足', 1, 2, 'demo-q6b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-107', '満足', 2, 1, 'demo-q6b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-108', 'どちらとも言えない', 3, 0, 'demo-q6b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-109', 'やや不満', 4, -1, 'demo-q6b-3');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-110', '不満', 5, -2, 'demo-q6b-3');
INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q7-3', 'その他ご要望があればお聞かせください', 9, 'text', false, NULL, 'demo-survey-3');

-- Sessions for デモ美容室
INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-67', 'demo-survey-3', 'いつも理想通りの仕上がりにしてくれます。カウンセリングが丁寧で安心です。', 'completed', false, '2026-01-20T11:04:06.261Z', '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-463', 'demo-session-67', 'demo-q1-3', 'demo-choice-71', NULL, '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-464', 'demo-session-67', 'demo-q2-3', 'demo-choice-76', NULL, '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-465', 'demo-session-67', 'demo-q3-3', 'demo-choice-82', NULL, '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-466', 'demo-session-67', 'demo-q4-3', 'demo-choice-86', NULL, '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-467', 'demo-session-67', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-468', 'demo-session-67', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-01-20T11:04:06.261Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-469', 'demo-session-67', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-01-20T11:04:06.261Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-68', 'demo-survey-3', '初めて伺いましたが、希望通りのヘアスタイルになりました。とても満足しています。', 'completed', false, '2026-03-22T14:32:06.143Z', '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-470', 'demo-session-68', 'demo-q1-3', 'demo-choice-71', NULL, '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-471', 'demo-session-68', 'demo-q2-3', 'demo-choice-77', NULL, '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-472', 'demo-session-68', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-473', 'demo-session-68', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-474', 'demo-session-68', 'demo-q7-3', NULL, '特にありません。いつも満足しています。', '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-475', 'demo-session-68', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-03-22T14:32:06.143Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-476', 'demo-session-68', 'demo-q6b-3', 'demo-choice-108', NULL, '2026-03-22T14:32:06.143Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-69', 'demo-survey-3', 'カラーの色味が絶妙で、友人からも褒められました。次回もお願いしたいです。', 'completed', false, '2026-02-27T07:48:52.618Z', '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-477', 'demo-session-69', 'demo-q1-3', 'demo-choice-72', NULL, '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-478', 'demo-session-69', 'demo-q2-3', 'demo-choice-76', NULL, '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-479', 'demo-session-69', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-480', 'demo-session-69', 'demo-q4-3', 'demo-choice-87', NULL, '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-481', 'demo-session-69', 'demo-q7-3', NULL, 'ドリンクサービスが嬉しかったです。', '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-482', 'demo-session-69', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-02-27T07:48:52.618Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-483', 'demo-session-69', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-02-27T07:48:52.618Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-70', 'demo-survey-3', 'スタイリストさんの技術が高く、毎回満足のいく仕上がりです。', 'completed', false, '2026-01-26T23:12:31.942Z', '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-484', 'demo-session-70', 'demo-q1-3', 'demo-choice-71', NULL, '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-485', 'demo-session-70', 'demo-q2-3', 'demo-choice-76', NULL, '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-486', 'demo-session-70', 'demo-q3-3', 'demo-choice-81', NULL, '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-487', 'demo-session-70', 'demo-q4-3', 'demo-choice-87', NULL, '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-488', 'demo-session-70', 'demo-q7-3', NULL, 'ドリンクサービスが嬉しかったです。', '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-489', 'demo-session-70', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-01-26T23:12:31.942Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-490', 'demo-session-70', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-01-26T23:12:31.942Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-71', 'demo-survey-3', '店内の雰囲気がおしゃれでリラックスできます。施術中も楽しい時間でした。', 'completed', false, '2026-01-12T11:33:01.600Z', '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-491', 'demo-session-71', 'demo-q1-3', 'demo-choice-71', NULL, '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-492', 'demo-session-71', 'demo-q2-3', 'demo-choice-77', NULL, '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-493', 'demo-session-71', 'demo-q3-3', 'demo-choice-81', NULL, '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-494', 'demo-session-71', 'demo-q4-3', 'demo-choice-87', NULL, '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-495', 'demo-session-71', 'demo-q7-3', NULL, 'トリートメントの効果が長持ちしました。', '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-496', 'demo-session-71', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-01-12T11:33:01.600Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-497', 'demo-session-71', 'demo-q6a-3', 'demo-choice-103', NULL, '2026-01-12T11:33:01.600Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-72', 'demo-survey-3', 'トリートメントをしてもらいました。髪がツヤツヤになって嬉しいです。', 'completed', false, '2026-02-11T17:38:52.397Z', '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-498', 'demo-session-72', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-499', 'demo-session-72', 'demo-q2-3', 'demo-choice-78', NULL, '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-500', 'demo-session-72', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-501', 'demo-session-72', 'demo-q4-3', 'demo-choice-87', NULL, '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-502', 'demo-session-72', 'demo-q7-3', NULL, '次回はパーマに挑戦したいです。', '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-503', 'demo-session-72', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-02-11T17:38:52.397Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-504', 'demo-session-72', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-02-11T17:38:52.397Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-73', 'demo-survey-3', '予約が取りやすく、待ち時間もないので助かります。仕上がりも毎回満足。', 'completed', false, '2026-03-22T20:54:39.191Z', '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-505', 'demo-session-73', 'demo-q1-3', 'demo-choice-72', NULL, '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-506', 'demo-session-73', 'demo-q2-3', 'demo-choice-77', NULL, '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-507', 'demo-session-73', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-508', 'demo-session-73', 'demo-q4-3', 'demo-choice-88', NULL, '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-509', 'demo-session-73', 'demo-q7-3', NULL, 'スタイリング剤のおすすめが参考になりました。', '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-510', 'demo-session-73', 'demo-q5b-3', 'demo-choice-98', NULL, '2026-03-22T20:54:39.191Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-511', 'demo-session-73', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-03-22T20:54:39.191Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-74', 'demo-survey-3', 'ヘッドスパが最高に気持ちよかったです。髪だけでなく頭皮ケアも大切ですね。', 'completed', false, '2026-03-14T19:13:35.278Z', '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-512', 'demo-session-74', 'demo-q1-3', 'demo-choice-72', NULL, '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-513', 'demo-session-74', 'demo-q2-3', 'demo-choice-76', NULL, '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-514', 'demo-session-74', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-515', 'demo-session-74', 'demo-q4-3', 'demo-choice-88', NULL, '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-516', 'demo-session-74', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-517', 'demo-session-74', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-03-14T19:13:35.278Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-518', 'demo-session-74', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-03-14T19:13:35.278Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-75', 'demo-survey-3', 'パーマをかけてもらいました。思い通りのウェーブで大満足です。', 'completed', false, '2026-03-03T15:21:32.394Z', '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-519', 'demo-session-75', 'demo-q1-3', 'demo-choice-71', NULL, '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-520', 'demo-session-75', 'demo-q2-3', 'demo-choice-77', NULL, '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-521', 'demo-session-75', 'demo-q3-3', 'demo-choice-83', NULL, '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-522', 'demo-session-75', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-523', 'demo-session-75', 'demo-q7-3', NULL, '髪質改善メニューに興味があります。', '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-524', 'demo-session-75', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-03-03T15:21:32.394Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-525', 'demo-session-75', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-03-03T15:21:32.394Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-76', 'demo-survey-3', '子供のカットもお願いしましたが、上手にあやしながら切ってくれました。', 'completed', false, '2026-03-22T06:06:26.379Z', '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-526', 'demo-session-76', 'demo-q1-3', 'demo-choice-72', NULL, '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-527', 'demo-session-76', 'demo-q2-3', 'demo-choice-76', NULL, '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-528', 'demo-session-76', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-529', 'demo-session-76', 'demo-q4-3', 'demo-choice-87', NULL, '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-530', 'demo-session-76', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-531', 'demo-session-76', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-03-22T06:06:26.379Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-532', 'demo-session-76', 'demo-q6a-3', 'demo-choice-101', NULL, '2026-03-22T06:06:26.379Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-77', 'demo-survey-3', '的確なアドバイスをくれるので、毎回新しい発見があります。信頼しています。', 'completed', false, '2026-02-23T20:56:29.485Z', '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-533', 'demo-session-77', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-534', 'demo-session-77', 'demo-q2-3', 'demo-choice-76', NULL, '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-535', 'demo-session-77', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-536', 'demo-session-77', 'demo-q4-3', 'demo-choice-87', NULL, '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-537', 'demo-session-77', 'demo-q7-3', NULL, 'ドリンクサービスが嬉しかったです。', '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-538', 'demo-session-77', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-02-23T20:56:29.485Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-539', 'demo-session-77', 'demo-q6a-3', 'demo-choice-101', NULL, '2026-02-23T20:56:29.485Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-78', 'demo-survey-3', '髪の悩みを相談したら、適切なケア方法を教えてもらえました。', 'completed', false, '2026-01-11T04:29:12.704Z', '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-540', 'demo-session-78', 'demo-q1-3', 'demo-choice-71', NULL, '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-541', 'demo-session-78', 'demo-q2-3', 'demo-choice-76', NULL, '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-542', 'demo-session-78', 'demo-q3-3', 'demo-choice-82', NULL, '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-543', 'demo-session-78', 'demo-q4-3', 'demo-choice-88', NULL, '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-544', 'demo-session-78', 'demo-q7-3', NULL, '次回はパーマに挑戦したいです。', '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-545', 'demo-session-78', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-01-11T04:29:12.704Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-546', 'demo-session-78', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-01-11T04:29:12.704Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-79', 'demo-survey-3', '長年通っていますが、いつも期待以上の仕上がりです。他の美容室は考えられません。', 'completed', false, '2026-04-03T05:59:34.423Z', '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-547', 'demo-session-79', 'demo-q1-3', 'demo-choice-72', NULL, '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-548', 'demo-session-79', 'demo-q2-3', 'demo-choice-78', NULL, '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-549', 'demo-session-79', 'demo-q3-3', 'demo-choice-81', NULL, '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-550', 'demo-session-79', 'demo-q4-3', 'demo-choice-87', NULL, '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-551', 'demo-session-79', 'demo-q7-3', NULL, 'スタイリング剤のおすすめが参考になりました。', '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-552', 'demo-session-79', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-04-03T05:59:34.423Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-553', 'demo-session-79', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-04-03T05:59:34.423Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-80', 'demo-survey-3', '縮毛矯正をしてもらいました。自然な仕上がりで大満足です。', 'completed', false, '2026-03-21T04:47:30.771Z', '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-554', 'demo-session-80', 'demo-q1-3', 'demo-choice-71', NULL, '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-555', 'demo-session-80', 'demo-q2-3', 'demo-choice-77', NULL, '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-556', 'demo-session-80', 'demo-q3-3', 'demo-choice-81', NULL, '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-557', 'demo-session-80', 'demo-q4-3', 'demo-choice-87', NULL, '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-558', 'demo-session-80', 'demo-q7-3', NULL, '髪質改善メニューに興味があります。', '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-559', 'demo-session-80', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-03-21T04:47:30.771Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-560', 'demo-session-80', 'demo-q6a-3', 'demo-choice-103', NULL, '2026-03-21T04:47:30.771Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-81', 'demo-survey-3', 'スタッフの皆さんが明るくて、居心地の良いサロンです。技術も間違いないです。', 'completed', false, '2026-02-09T12:54:36.701Z', '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-561', 'demo-session-81', 'demo-q1-3', 'demo-choice-72', NULL, '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-562', 'demo-session-81', 'demo-q2-3', 'demo-choice-78', NULL, '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-563', 'demo-session-81', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-564', 'demo-session-81', 'demo-q4-3', 'demo-choice-86', NULL, '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-565', 'demo-session-81', 'demo-q7-3', NULL, '髪質改善メニューに興味があります。', '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-566', 'demo-session-81', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-02-09T12:54:36.701Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-567', 'demo-session-81', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-02-09T12:54:36.701Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-82', 'demo-survey-3', 'カットだけでなくスタイリングのコツも教えてくれるのが嬉しいです。', 'completed', false, '2026-02-16T23:48:56.447Z', '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-568', 'demo-session-82', 'demo-q1-3', 'demo-choice-72', NULL, '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-569', 'demo-session-82', 'demo-q2-3', 'demo-choice-76', NULL, '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-570', 'demo-session-82', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-571', 'demo-session-82', 'demo-q4-3', 'demo-choice-86', NULL, '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-572', 'demo-session-82', 'demo-q7-3', NULL, '雑誌の種類が豊富で良かったです。', '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-573', 'demo-session-82', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-02-16T23:48:56.447Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-574', 'demo-session-82', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-02-16T23:48:56.447Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-83', 'demo-survey-3', '駅近で通いやすく、仕上がりも毎回素晴らしいです。おすすめの美容室です。', 'completed', false, '2026-03-19T08:14:18.960Z', '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-575', 'demo-session-83', 'demo-q1-3', 'demo-choice-72', NULL, '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-576', 'demo-session-83', 'demo-q2-3', 'demo-choice-76', NULL, '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-577', 'demo-session-83', 'demo-q3-3', 'demo-choice-81', NULL, '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-578', 'demo-session-83', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-579', 'demo-session-83', 'demo-q7-3', NULL, 'ドリンクサービスが嬉しかったです。', '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-580', 'demo-session-83', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-03-19T08:14:18.960Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-581', 'demo-session-83', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-03-19T08:14:18.960Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-84', 'demo-survey-3', 'いつも理想通りの仕上がりにしてくれます。カウンセリングが丁寧で安心です。', 'completed', false, '2026-02-23T17:25:19.234Z', '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-582', 'demo-session-84', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-583', 'demo-session-84', 'demo-q2-3', 'demo-choice-77', NULL, '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-584', 'demo-session-84', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-585', 'demo-session-84', 'demo-q4-3', 'demo-choice-86', NULL, '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-586', 'demo-session-84', 'demo-q7-3', NULL, '特にありません。いつも満足しています。', '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-587', 'demo-session-84', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-02-23T17:25:19.234Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-588', 'demo-session-84', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-02-23T17:25:19.234Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-85', 'demo-survey-3', '初めて伺いましたが、希望通りのヘアスタイルになりました。とても満足しています。', 'completed', false, '2026-01-24T12:33:07.376Z', '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-589', 'demo-session-85', 'demo-q1-3', 'demo-choice-71', NULL, '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-590', 'demo-session-85', 'demo-q2-3', 'demo-choice-77', NULL, '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-591', 'demo-session-85', 'demo-q3-3', 'demo-choice-81', NULL, '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-592', 'demo-session-85', 'demo-q4-3', 'demo-choice-88', NULL, '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-593', 'demo-session-85', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-594', 'demo-session-85', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-01-24T12:33:07.376Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-595', 'demo-session-85', 'demo-q6a-3', 'demo-choice-103', NULL, '2026-01-24T12:33:07.376Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-86', 'demo-survey-3', 'カラーの色味が絶妙で、友人からも褒められました。次回もお願いしたいです。', 'completed', false, '2026-02-16T12:35:30.896Z', '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-596', 'demo-session-86', 'demo-q1-3', 'demo-choice-72', NULL, '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-597', 'demo-session-86', 'demo-q2-3', 'demo-choice-76', NULL, '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-598', 'demo-session-86', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-599', 'demo-session-86', 'demo-q4-3', 'demo-choice-88', NULL, '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-600', 'demo-session-86', 'demo-q7-3', NULL, '雑誌の種類が豊富で良かったです。', '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-601', 'demo-session-86', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-02-16T12:35:30.896Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-602', 'demo-session-86', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-02-16T12:35:30.896Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-87', 'demo-survey-3', 'スタイリストさんの技術が高く、毎回満足のいく仕上がりです。', 'completed', false, '2026-01-24T01:35:25.306Z', '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-603', 'demo-session-87', 'demo-q1-3', 'demo-choice-72', NULL, '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-604', 'demo-session-87', 'demo-q2-3', 'demo-choice-76', NULL, '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-605', 'demo-session-87', 'demo-q3-3', 'demo-choice-83', NULL, '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-606', 'demo-session-87', 'demo-q4-3', 'demo-choice-86', NULL, '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-607', 'demo-session-87', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-608', 'demo-session-87', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-01-24T01:35:25.306Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-609', 'demo-session-87', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-01-24T01:35:25.306Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-88', 'demo-survey-3', '店内の雰囲気がおしゃれでリラックスできます。施術中も楽しい時間でした。', 'completed', false, '2026-02-22T18:25:46.750Z', '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-610', 'demo-session-88', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-611', 'demo-session-88', 'demo-q2-3', 'demo-choice-77', NULL, '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-612', 'demo-session-88', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-613', 'demo-session-88', 'demo-q4-3', 'demo-choice-87', NULL, '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-614', 'demo-session-88', 'demo-q7-3', NULL, '新しいカラー剤を試してみたいです。', '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-615', 'demo-session-88', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-02-22T18:25:46.750Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-616', 'demo-session-88', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-02-22T18:25:46.750Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-89', 'demo-survey-3', 'トリートメントをしてもらいました。髪がツヤツヤになって嬉しいです。', 'completed', false, '2026-01-11T11:04:07.424Z', '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-617', 'demo-session-89', 'demo-q1-3', 'demo-choice-72', NULL, '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-618', 'demo-session-89', 'demo-q2-3', 'demo-choice-77', NULL, '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-619', 'demo-session-89', 'demo-q3-3', 'demo-choice-83', NULL, '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-620', 'demo-session-89', 'demo-q4-3', 'demo-choice-88', NULL, '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-621', 'demo-session-89', 'demo-q7-3', NULL, '次回はパーマに挑戦したいです。', '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-622', 'demo-session-89', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-01-11T11:04:07.424Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-623', 'demo-session-89', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-01-11T11:04:07.424Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-90', 'demo-survey-3', '予約が取りやすく、待ち時間もないので助かります。仕上がりも毎回満足。', 'completed', false, '2026-02-25T15:45:00.226Z', '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-624', 'demo-session-90', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-625', 'demo-session-90', 'demo-q2-3', 'demo-choice-77', NULL, '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-626', 'demo-session-90', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-627', 'demo-session-90', 'demo-q4-3', 'demo-choice-87', NULL, '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-628', 'demo-session-90', 'demo-q7-3', NULL, '特にありません。いつも満足しています。', '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-629', 'demo-session-90', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-02-25T15:45:00.226Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-630', 'demo-session-90', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-02-25T15:45:00.226Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-91', 'demo-survey-3', 'ヘッドスパが最高に気持ちよかったです。髪だけでなく頭皮ケアも大切ですね。', 'completed', false, '2026-01-09T03:08:44.531Z', '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-631', 'demo-session-91', 'demo-q1-3', 'demo-choice-73', NULL, '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-632', 'demo-session-91', 'demo-q2-3', 'demo-choice-77', NULL, '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-633', 'demo-session-91', 'demo-q3-3', 'demo-choice-82', NULL, '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-634', 'demo-session-91', 'demo-q4-3', 'demo-choice-87', NULL, '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-635', 'demo-session-91', 'demo-q7-3', NULL, 'ドリンクサービスが嬉しかったです。', '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-636', 'demo-session-91', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-01-09T03:08:44.531Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-637', 'demo-session-91', 'demo-q6b-3', 'demo-choice-108', NULL, '2026-01-09T03:08:44.531Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-92', 'demo-survey-3', 'パーマをかけてもらいました。思い通りのウェーブで大満足です。', 'completed', false, '2026-03-27T16:49:06.765Z', '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-638', 'demo-session-92', 'demo-q1-3', 'demo-choice-71', NULL, '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-639', 'demo-session-92', 'demo-q2-3', 'demo-choice-76', NULL, '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-640', 'demo-session-92', 'demo-q3-3', 'demo-choice-81', NULL, '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-641', 'demo-session-92', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-642', 'demo-session-92', 'demo-q7-3', NULL, '新しいカラー剤を試してみたいです。', '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-643', 'demo-session-92', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-03-27T16:49:06.765Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-644', 'demo-session-92', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-03-27T16:49:06.765Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-93', 'demo-survey-3', '子供のカットもお願いしましたが、上手にあやしながら切ってくれました。', 'completed', false, '2026-02-25T11:27:36.476Z', '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-645', 'demo-session-93', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-646', 'demo-session-93', 'demo-q2-3', 'demo-choice-78', NULL, '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-647', 'demo-session-93', 'demo-q3-3', 'demo-choice-81', NULL, '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-648', 'demo-session-93', 'demo-q4-3', 'demo-choice-86', NULL, '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-649', 'demo-session-93', 'demo-q7-3', NULL, '雑誌の種類が豊富で良かったです。', '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-650', 'demo-session-93', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-02-25T11:27:36.476Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-651', 'demo-session-93', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-02-25T11:27:36.476Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-94', 'demo-survey-3', '的確なアドバイスをくれるので、毎回新しい発見があります。信頼しています。', 'completed', false, '2026-03-07T08:09:27.118Z', '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-652', 'demo-session-94', 'demo-q1-3', 'demo-choice-72', NULL, '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-653', 'demo-session-94', 'demo-q2-3', 'demo-choice-77', NULL, '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-654', 'demo-session-94', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-655', 'demo-session-94', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-656', 'demo-session-94', 'demo-q7-3', NULL, '特にありません。いつも満足しています。', '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-657', 'demo-session-94', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-03-07T08:09:27.118Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-658', 'demo-session-94', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-03-07T08:09:27.118Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-95', 'demo-survey-3', '髪の悩みを相談したら、適切なケア方法を教えてもらえました。', 'completed', false, '2026-02-08T14:35:44.649Z', '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-659', 'demo-session-95', 'demo-q1-3', 'demo-choice-71', NULL, '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-660', 'demo-session-95', 'demo-q2-3', 'demo-choice-78', NULL, '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-661', 'demo-session-95', 'demo-q3-3', 'demo-choice-82', NULL, '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-662', 'demo-session-95', 'demo-q4-3', 'demo-choice-87', NULL, '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-663', 'demo-session-95', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-664', 'demo-session-95', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-02-08T14:35:44.649Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-665', 'demo-session-95', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-02-08T14:35:44.649Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-96', 'demo-survey-3', '長年通っていますが、いつも期待以上の仕上がりです。他の美容室は考えられません。', 'completed', false, '2026-03-05T07:05:14.808Z', '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-666', 'demo-session-96', 'demo-q1-3', 'demo-choice-72', NULL, '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-667', 'demo-session-96', 'demo-q2-3', 'demo-choice-76', NULL, '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-668', 'demo-session-96', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-669', 'demo-session-96', 'demo-q4-3', 'demo-choice-87', NULL, '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-670', 'demo-session-96', 'demo-q7-3', NULL, '特にありません。いつも満足しています。', '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-671', 'demo-session-96', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-03-05T07:05:14.808Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-672', 'demo-session-96', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-03-05T07:05:14.808Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-97', 'demo-survey-3', '縮毛矯正をしてもらいました。自然な仕上がりで大満足です。', 'completed', false, '2026-01-06T03:56:39.084Z', '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-673', 'demo-session-97', 'demo-q1-3', 'demo-choice-71', NULL, '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-674', 'demo-session-97', 'demo-q2-3', 'demo-choice-77', NULL, '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-675', 'demo-session-97', 'demo-q3-3', 'demo-choice-81', NULL, '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-676', 'demo-session-97', 'demo-q4-3', 'demo-choice-86', NULL, '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-677', 'demo-session-97', 'demo-q7-3', NULL, '髪質改善メニューに興味があります。', '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-678', 'demo-session-97', 'demo-q5a-3', 'demo-choice-92', NULL, '2026-01-06T03:56:39.084Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-679', 'demo-session-97', 'demo-q6b-3', 'demo-choice-107', NULL, '2026-01-06T03:56:39.084Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-98', 'demo-survey-3', 'スタッフの皆さんが明るくて、居心地の良いサロンです。技術も間違いないです。', 'completed', false, '2026-03-29T02:05:23.015Z', '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-680', 'demo-session-98', 'demo-q1-3', 'demo-choice-73', NULL, '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-681', 'demo-session-98', 'demo-q2-3', 'demo-choice-77', NULL, '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-682', 'demo-session-98', 'demo-q3-3', 'demo-choice-82', NULL, '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-683', 'demo-session-98', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-684', 'demo-session-98', 'demo-q7-3', NULL, '予約サイトが使いやすくて助かります。', '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-685', 'demo-session-98', 'demo-q5b-3', 'demo-choice-97', NULL, '2026-03-29T02:05:23.015Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-686', 'demo-session-98', 'demo-q6b-3', 'demo-choice-106', NULL, '2026-03-29T02:05:23.015Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-99', 'demo-survey-3', 'カットだけでなくスタイリングのコツも教えてくれるのが嬉しいです。', 'completed', false, '2026-03-22T08:07:29.863Z', '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-687', 'demo-session-99', 'demo-q1-3', 'demo-choice-71', NULL, '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-688', 'demo-session-99', 'demo-q2-3', 'demo-choice-76', NULL, '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-689', 'demo-session-99', 'demo-q3-3', 'demo-choice-83', NULL, '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-690', 'demo-session-99', 'demo-q4-3', 'demo-choice-86', NULL, '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-691', 'demo-session-99', 'demo-q7-3', NULL, '新しいカラー剤を試してみたいです。', '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-692', 'demo-session-99', 'demo-q5a-3', 'demo-choice-91', NULL, '2026-03-22T08:07:29.863Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-693', 'demo-session-99', 'demo-q6a-3', 'demo-choice-102', NULL, '2026-03-22T08:07:29.863Z');

INSERT INTO "ReviewSession" (id, "surveyId", "reviewText", status, "couponUsed", "createdAt", "updatedAt")
VALUES ('demo-session-100', 'demo-survey-3', '駅近で通いやすく、仕上がりも毎回素晴らしいです。おすすめの美容室です。', 'completed', false, '2026-04-03T17:03:26.713Z', '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-694', 'demo-session-100', 'demo-q1-3', 'demo-choice-71', NULL, '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-695', 'demo-session-100', 'demo-q2-3', 'demo-choice-77', NULL, '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-696', 'demo-session-100', 'demo-q3-3', 'demo-choice-82', NULL, '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-697', 'demo-session-100', 'demo-q4-3', 'demo-choice-87', NULL, '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-698', 'demo-session-100', 'demo-q7-3', NULL, 'ヘッドスパをもっと長くしてほしいです。', '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-699', 'demo-session-100', 'demo-q5b-3', 'demo-choice-96', NULL, '2026-04-03T17:03:26.713Z');
INSERT INTO "Answer" (id, "sessionId", "questionId", "choiceId", "textValue", "createdAt")
VALUES ('demo-answer-700', 'demo-session-100', 'demo-q6a-3', 'demo-choice-101', NULL, '2026-04-03T17:03:26.713Z');

-- ============================================
-- Shop 4: デモバー (Light plan, 18/20 used)
-- ============================================
INSERT INTO "User" (id, email, "loginId", password, name, role, "shopName", address, industry, "noContractLimit", "planType", "planReviewLimit", "createdAt", "updatedAt")
VALUES ('demo-user-4', 'demo4@kuchikomi.jp', 'AG-000004', '$2a$10$V5h/b24p0tNw34DJ9T7TkOxGaOubUwBnvLOALbMPZFtvr2wsIJi0y', 'デモバー管理者', 'admin', 'デモバー', '東京都渋谷区demo4', 'バー', true, 'light', 20, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z');

INSERT INTO "Survey" (id, title, "openingMessage", "closingMessage", "completionMessage", keywords, "toneRandom", "googleBusinessUrl", "logoUrl", "couponImageUrl", "couponEnabled", "couponExpiry", "chatIconType", "chatIconPreset", "themeMainColor", "themeUserColor", "minRandomQuestions", "maxRandomQuestions", "isActive", "monthlyReviewLimit", "monthlyReviewCount", "createdAt", "updatedAt", "userId")
VALUES ('demo-survey-4', 'デモバーアンケート', 'ご来店ありがとうございます。サービス向上のため、簡単なアンケートにご協力ください。', 'アンケートにご協力いただきありがとうございました。', 'ご回答ありがとうございました。次回のご来店をお待ちしております！', 'カクテル,雰囲気,バーテンダー,接客,落ち着く', true, 'https://g.page/demo-bar', '/demo/logo-bar.svg', '/demo/coupon-bar.svg', true, '2026-12-31', 'preset', 'utensils', '#312e81', '#4c1d95', 1, 1, true, 20, 18, '2026-04-04T17:41:07.488Z', '2026-04-04T17:41:07.488Z', 'demo-user-4');

INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-4-1', 'カジュアルな口調', true, 1, 'demo-survey-4');
INSERT INTO "Tone" (id, name, "isActive", "order", "surveyId")
VALUES ('demo-tone-4-2', '情緒的で感情豊かな表現', true, 2, 'demo-survey-4');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q1-4', 'お飲み物はいかがでしたか？', 1, 'choice', false, NULL, 'demo-survey-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-1', 'とても美味しかった', 1, 5, 'demo-q1-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-2', '美味しかった', 2, 4, 'demo-q1-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-3', '普通', 3, 3, 'demo-q1-4');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q2-4', '店内の雰囲気はいかがでしたか？', 2, 'choice', false, NULL, 'demo-survey-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-4', 'とても良い', 1, 5, 'demo-q2-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-5', '良い', 2, 4, 'demo-q2-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-6', '普通', 3, 3, 'demo-q2-4');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q3-4', 'バーテンダーの接客はいかがでしたか？', 3, 'choice', false, NULL, 'demo-survey-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-7', 'とても良い', 1, 5, 'demo-q3-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-8', '良い', 2, 4, 'demo-q3-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-9', '普通', 3, 3, 'demo-q3-4');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q4-4', 'また来たいと思いますか？', 4, 'choice', false, NULL, 'demo-survey-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-10', 'ぜひまた来たい', 1, 5, 'demo-q4-4');
INSERT INTO "Choice" (id, text, "order", score, "questionId")
VALUES ('demo-choice-4-11', '機会があれば', 2, 3, 'demo-q4-4');

INSERT INTO "Question" (id, text, "order", type, "isRandom", "groupName", "surveyId")
VALUES ('demo-q5-4', 'ご意見やご要望があればお聞かせください', 5, 'text', false, NULL, 'demo-survey-4');

COMMIT;