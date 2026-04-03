"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEFAULT_PROMPT_TEMPLATE = `以下のアンケート回答をもとに、Googleビジネスプロフィールに投稿する口コミ文章を作成してください。

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

type Choice = {
  text: string;
  order: number;
  score: number;
};

type Question = {
  text: string;
  order: number;
  type: "choice" | "text";
  choices: Choice[];
  isRandom: boolean;
};

type Tone = {
  id: string;
  name: string;
};

const DEFAULT_CHOICES: Choice[] = [
  { text: "非常に満足", order: 0, score: 2 },
  { text: "満足", order: 1, score: 1 },
  { text: "どちらとも言えない", order: 2, score: 0 },
  { text: "やや不満", order: 3, score: -1 },
  { text: "不満", order: 4, score: -2 },
];

function newQuestion(order: number): Question {
  return {
    text: "",
    order,
    type: "choice",
    choices: DEFAULT_CHOICES.map((c) => ({ ...c })),
    isRandom: false,
  };
}

let toneCounter = 0;
function newToneId() {
  return `tone-${++toneCounter}`;
}

export default function NewSurveyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState("");
  const [openingMessage, setOpeningMessage] = useState("");
  const [closingMessage, setClosingMessage] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [monthlyReviewLimit, setMonthlyReviewLimit] = useState(100);

  // AI settings
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [tones, setTones] = useState<Tone[]>([
    { id: newToneId(), name: "敬体（です・ます調）" },
    { id: newToneId(), name: "情緒的で感情豊かな表現" },
  ]);

  // Questions
  const [questions, setQuestions] = useState<Question[]>([newQuestion(0)]);

  // ---- Tone helpers ----
  const addTone = () => {
    setTones((prev) => [...prev, { id: newToneId(), name: "" }]);
  };

  const removeTone = (id: string) => {
    setTones((prev) => prev.filter((t) => t.id !== id));
  };

  const updateToneName = (id: string, name: string) => {
    setTones((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  // ---- Question helpers ----
  const addQuestion = () => {
    setQuestions((prev) => [...prev, newQuestion(prev.length)]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((q, i) => ({ ...q, order: i }))
    );
  };

  const updateQuestion = (idx: number, patch: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== idx) return q;
        const updated = { ...q, ...patch };
        if (patch.type === "choice" && q.type !== "choice" && updated.choices.length === 0) {
          updated.choices = DEFAULT_CHOICES.map((c) => ({ ...c }));
        }
        return updated;
      })
    );
  };

  // ---- Choice helpers ----
  const addChoice = (qIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          choices: [...q.choices, { text: "", order: q.choices.length, score: 0 }],
        };
      })
    );
  };

  const removeChoice = (qIdx: number, cIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          choices: q.choices
            .filter((_, ci) => ci !== cIdx)
            .map((c, ci) => ({ ...c, order: ci })),
        };
      })
    );
  };

  const updateChoice = (qIdx: number, cIdx: number, patch: Partial<Choice>) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          choices: q.choices.map((c, ci) => (ci === cIdx ? { ...c, ...patch } : c)),
        };
      })
    );
  };

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("アンケートタイトルを入力してください");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setError(`質問${i + 1}の文章を入力してください`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          googleBusinessUrl: googleBusinessUrl.trim(),
          openingMessage: openingMessage.trim(),
          closingMessage: closingMessage.trim(),
          completionMessage: completionMessage.trim(),
          keywords: keywords.trim(),
          monthlyReviewLimit,
          promptTemplate: promptTemplate.trim(),
          tones: tones
            .filter((t) => t.name.trim())
            .map((t, i) => ({ name: t.name.trim(), order: i, isActive: true })),
          questions,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "作成に失敗しました");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">新規アンケート作成</h1>
          <p className="text-sm text-gray-500 mt-1">アンケートの基本情報と質問を設定してください</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== 基本情報 ===== */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">基本情報</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                アンケートタイトル<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：サービス満足度アンケート"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">説明文</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="アンケートの説明を入力してください（任意）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GoogleビジネスプロフィールURL
              </label>
              <input
                type="url"
                value={googleBusinessUrl}
                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始挨拶文</label>
              <textarea
                value={openingMessage}
                onChange={(e) => setOpeningMessage(e.target.value)}
                rows={3}
                placeholder="アンケート開始時に表示するメッセージ（任意）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">終了挨拶文</label>
              <textarea
                value={closingMessage}
                onChange={(e) => setClosingMessage(e.target.value)}
                rows={3}
                placeholder="アンケート終了時に表示するメッセージ（任意）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                レビュー確認メッセージ
              </label>
              <p className="text-xs text-gray-400 mb-1">アンケート完了後に口コミ画面で表示するメッセージ</p>
              <textarea
                value={completionMessage}
                onChange={(e) => setCompletionMessage(e.target.value)}
                rows={3}
                placeholder="口コミ投稿を促すメッセージ（任意）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">キーワード</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="例：親切,丁寧,スピーディ"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Googleビジネス月間レビュー制限
              </label>
              <input
                type="number"
                min={0}
                value={monthlyReviewLimit}
                onChange={(e) => setMonthlyReviewLimit(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* ===== AI設定 ===== */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">AI設定</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AIプロンプトテンプレート
              </label>
              <p className="text-xs text-gray-400 mb-1">
                変数: &#123;tone&#125;, &#123;keywords&#125;, &#123;formattedResponses&#125;
              </p>
              <textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-y font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">口調設定</label>
              <div className="space-y-2">
                {tones.map((tone) => (
                  <div key={tone.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tone.name}
                      onChange={(e) => updateToneName(tone.id, e.target.value)}
                      placeholder="例：丁寧な敬体"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeTone(tone.id)}
                      disabled={tones.length <= 1}
                      className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30"
                      title="削除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addTone}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors mt-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                口調を追加
              </button>
            </div>
          </div>

          {/* ===== Questions ===== */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800">質問リスト</h2>

            {questions.map((question, qIdx) => (
              <QuestionBlock
                key={qIdx}
                question={question}
                index={qIdx}
                onUpdate={(patch) => updateQuestion(qIdx, patch)}
                onRemove={() => removeQuestion(qIdx)}
                canRemove={questions.length > 1}
                onAddChoice={() => addChoice(qIdx)}
                onRemoveChoice={(cIdx) => removeChoice(qIdx, cIdx)}
                onUpdateChoice={(cIdx, patch) => updateChoice(qIdx, cIdx, patch)}
              />
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-violet-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              質問を追加する
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? "作成中..." : "アンケートを作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Sub-component for a single question block ---
type QuestionBlockProps = {
  question: Question;
  index: number;
  onUpdate: (patch: Partial<Question>) => void;
  onRemove: () => void;
  canRemove: boolean;
  onAddChoice: () => void;
  onRemoveChoice: (cIdx: number) => void;
  onUpdateChoice: (cIdx: number, patch: Partial<Choice>) => void;
};

function QuestionBlock({
  question,
  index,
  onUpdate,
  onRemove,
  canRemove,
  onAddChoice,
  onRemoveChoice,
  onUpdateChoice,
}: QuestionBlockProps) {
  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4 border border-gray-100">
      {/* Question header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-violet-600 bg-violet-500/20 px-2.5 py-0.5 rounded-full">
          質問 {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="この質問を削除"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Question text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          質問文<span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="例：スタッフの対応はいかがでしたか？"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />
      </div>

      {/* Question type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">回答タイプ</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`q-type-${index}`}
              value="choice"
              checked={question.type === "choice"}
              onChange={() => onUpdate({ type: "choice" })}
              className="text-violet-500 focus:ring-violet-400"
            />
            <span className="text-sm text-gray-700">選択式</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`q-type-${index}`}
              value="text"
              checked={question.type === "text"}
              onChange={() => onUpdate({ type: "text" })}
              className="text-violet-500 focus:ring-violet-400"
            />
            <span className="text-sm text-gray-700">テキスト入力</span>
          </label>
        </div>
      </div>

      {/* isRandom checkbox */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={question.isRandom}
            onChange={(e) => onUpdate({ isRandom: e.target.checked })}
            className="rounded border-gray-300 text-violet-500 focus:ring-violet-400"
          />
          <span className="text-sm text-gray-700">ランダム表示</span>
        </label>
      </div>

      {/* Choices (only for "choice" type) */}
      {question.type === "choice" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">選択肢</label>
          {question.choices.map((choice, cIdx) => (
            <div key={cIdx} className="flex items-center gap-2">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => onUpdateChoice(cIdx, { text: e.target.value })}
                placeholder={`選択肢 ${cIdx + 1}`}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <label className="text-xs text-gray-500 whitespace-nowrap">スコア</label>
                <select
                  value={choice.score}
                  onChange={(e) => onUpdateChoice(cIdx, { score: Number(e.target.value) })}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
                >
                  <option value={2}>+2（非常に満足）</option>
                  <option value={1}>+1（満足）</option>
                  <option value={0}>0（どちらとも）</option>
                  <option value={-1}>-1（やや不満）</option>
                  <option value={-2}>-2（不満）</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => onRemoveChoice(cIdx)}
                disabled={question.choices.length <= 1}
                className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddChoice}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors mt-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            選択肢を追加
          </button>
        </div>
      )}
    </div>
  );
}
