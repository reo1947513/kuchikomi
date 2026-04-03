"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ---- Types ----
type Tone = {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
};

type Choice = {
  id?: string;
  text: string;
  order: number;
  score: number;
};

type Question = {
  id: string;
  text: string;
  type: "choice" | "text";
  order: number;
  isRandom: boolean;
  groupName: string | null;
  choices: Choice[];
};

type Survey = {
  id: string;
  title: string;
  description?: string | null;
  googleBusinessUrl?: string | null;
  isActive: boolean;
  openingMessage?: string | null;
  closingMessage?: string | null;
  completionMessage?: string | null;
  keywords?: string | null;
  monthlyReviewLimit: number;
  promptTemplate?: string | null;
  logoUrl?: string | null;
  couponImageUrl?: string | null;
  couponEnabled: boolean;
  tones: Tone[];
  questions: Question[];
};

type Tab = "basic" | "ai" | "questions" | "logo";

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

let localToneCounter = 0;
function newLocalToneId() {
  return `local-tone-${++localToneCounter}`;
}

const DEFAULT_CHOICES: Choice[] = [
  { text: "非常に満足", order: 0, score: 2 },
  { text: "満足", order: 1, score: 1 },
  { text: "どちらとも言えない", order: 2, score: 0 },
  { text: "やや不満", order: 3, score: -1 },
  { text: "不満", order: 4, score: -2 },
];

export default function SurveySettingsPage() {
  const params = useParams();
  const surveyId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---- Basic tab state ----
  const [title, setTitle] = useState("");
  const [openingMessage, setOpeningMessage] = useState("");
  const [closingMessage, setClosingMessage] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState("");
  const [monthlyReviewLimit, setMonthlyReviewLimit] = useState(100);
  const [isActive, setIsActive] = useState(true);

  // ---- AI tab state ----
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [tones, setTones] = useState<Array<{ localId: string; name: string; id?: string }>>([]);

  // ---- Questions tab state ----
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQText, setNewQText] = useState("");
  const [newQType, setNewQType] = useState<"choice" | "text">("choice");
  const [newQIsRandom, setNewQIsRandom] = useState(false);
  const [newQChoices, setNewQChoices] = useState<Choice[]>(DEFAULT_CHOICES.map((c) => ({ ...c })));
  const [questionsSaving, setQuestionsSaving] = useState(false);
  const [useGrouping, setUseGrouping] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupQuestions, setGroupQuestions] = useState<{text:string;type:"choice"|"text";choices:Choice[]}[]>([{text:"",type:"text",choices:[]}]);

  // ---- Logo/Coupon tab state ----
  const [logoUrl, setLogoUrl] = useState("");
  const [couponImageUrl, setCouponImageUrl] = useState("");
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [logoDragging, setLogoDragging] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [couponDragging, setCouponDragging] = useState(false);
  const [couponUploading, setCouponUploading] = useState(false);
  const [couponUploadError, setCouponUploadError] = useState<string | null>(null);

  // ---- Fetch survey ----
  const fetchSurvey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/surveys/${surveyId}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      const data: Survey = await res.json();

      setTitle(data.title ?? "");
      setOpeningMessage(data.openingMessage ?? "");
      setClosingMessage(data.closingMessage ?? "");
      setCompletionMessage(data.completionMessage ?? "");
      setKeywords(data.keywords ?? "");
      setGoogleBusinessUrl(data.googleBusinessUrl ?? "");
      setMonthlyReviewLimit(data.monthlyReviewLimit ?? 100);
      setIsActive(data.isActive ?? true);
      setPromptTemplate(data.promptTemplate ?? DEFAULT_PROMPT_TEMPLATE);
      setTones(
        (data.tones ?? []).map((t) => ({ localId: newLocalToneId(), name: t.name, id: t.id }))
      );
      setQuestions(data.questions ?? []);
      setLogoUrl(data.logoUrl ?? "");
      setCouponImageUrl(data.couponImageUrl ?? "");
      setCouponEnabled(data.couponEnabled ?? false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  // ---- Generic save helper ----
  const saveSurvey = async (payload: Record<string, unknown>) => {
    setSaving(true);
    setSaveMsg(null);
    setError(null);
    try {
      const res = await fetch(`/api/surveys/${surveyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "保存に失敗しました");
      }
      setSaveMsg("保存しました");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  // ---- Tab save handlers ----
  const saveBasic = () =>
    saveSurvey({
      title,
      openingMessage,
      closingMessage,
      completionMessage,
      keywords,
      googleBusinessUrl,
      monthlyReviewLimit,
      isActive,
    });

  const saveAI = () =>
    saveSurvey({
      promptTemplate,
      tones: tones
        .filter((t) => t.name.trim())
        .map((t, i) => ({ id: t.id, name: t.name.trim(), order: i, isActive: true })),
    });

  const saveLogoCoupon = () =>
    saveSurvey({
      logoUrl,
      couponImageUrl,
      couponEnabled,
    });

  // ---- Logo upload ----
  const uploadLogoFile = async (file: File) => {
    setLogoUploading(true);
    setLogoUploadError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "アップロード失敗");
      setLogoUrl(data.url);
    } catch (e) {
      setLogoUploadError(e instanceof Error ? e.message : "アップロード失敗");
    } finally {
      setLogoUploading(false);
    }
  };

  const uploadCouponFile = async (file: File) => {
    setCouponUploading(true);
    setCouponUploadError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "アップロード失敗");
      setCouponImageUrl(data.url);
    } catch (e) {
      setCouponUploadError(e instanceof Error ? e.message : "アップロード失敗");
    } finally {
      setCouponUploading(false);
    }
  };

  // ---- Tone helpers ----
  const addTone = () =>
    setTones((prev) => [...prev, { localId: newLocalToneId(), name: "" }]);
  const removeTone = (localId: string) =>
    setTones((prev) => prev.filter((t) => t.localId !== localId));
  const updateToneName = (localId: string, name: string) =>
    setTones((prev) => prev.map((t) => (t.localId === localId ? { ...t, name } : t)));

  // ---- Questions tab ----
  const toggleQuestionRandom = (id: string, val: boolean) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isRandom: val } : q)));
  };

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setQuestions((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(idx, 0, moved);
      return updated.map((q, i) => ({ ...q, order: i }));
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("この質問を削除しますか？")) return;
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        alert("削除に失敗しました");
      }
    } catch {
      alert("ネットワークエラーが発生しました");
    }
  };

  const handleSaveQuestions = async () => {
    setQuestionsSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setSaveMsg("質問を保存しました");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setQuestionsSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (useGrouping) {
      if (!groupName.trim()) { alert("\u30b0\u30eb\u30fc\u30d7\u540d\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044"); return; }
      const validQs = groupQuestions.filter((gq) => gq.text.trim());
      if (validQs.length === 0) { alert("\u8cea\u554f\u30921\u3064\u4ee5\u4e0a\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044"); return; }
      try {
        const added = [];
        for (let i = 0; i < validQs.length; i++) {
          const gq = validQs[i];
          const res = await fetch(`/api/surveys/${surveyId}/questions`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: gq.text.trim(), type: gq.type, isRandom: true, groupName: groupName.trim(), order: questions.length + i, choices: gq.type === "choice" ? gq.choices : [] }),
          });
          if (!res.ok) throw new Error("\u8ffd\u52a0\u306b\u5931\u6557\u3057\u307e\u3057\u305f");
          added.push(await res.json());
        }
        setQuestions((prev) => [...prev, ...added]);
        setShowAddQuestion(false); setUseGrouping(false); setGroupName(""); setGroupQuestions([{text:"",type:"text",choices:[]}]);
      } catch (e) { alert(e instanceof Error ? e.message : "\u30a8\u30e9\u30fc"); }
      return;
    }
    if (!newQText.trim()) return;
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newQText.trim(),
          type: newQType,
          isRandom: newQIsRandom,
          order: questions.length,
          choices: newQType === "choice" ? newQChoices : [],
        }),
      });
      if (!res.ok) throw new Error("追加に失敗しました");
      const added: Question = await res.json();
      setQuestions((prev) => [...prev, added]);
      setShowAddQuestion(false);
      setNewQText("");
      setNewQType("choice");
      setNewQIsRandom(false);
      setNewQChoices(DEFAULT_CHOICES.map((c) => ({ ...c })));
    } catch (e) {
      alert(e instanceof Error ? e.message : "エラーが発生しました");
    }
  };

  // ---- Copy URL ----
  const [copying, setCopying] = useState(false);
  const surveyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/survey/${surveyId}`
      : `/survey/${surveyId}`;

  const handleCopyUrl = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(surveyUrl);
    } catch {
      // ignore
    } finally {
      setTimeout(() => setCopying(false), 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "basic", label: "基本設定" },
    { key: "ai", label: "AI設定" },
    { key: "questions", label: "質問管理" },
    { key: "logo", label: "ロゴ・クーポン" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">アンケート設定</h1>
            <p className="text-sm text-gray-500 mt-1 truncate">{title}</p>
          </div>
          <a
            href={`/survey/${surveyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            プレビュー
          </a>
        </div>

        {/* Global messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        {saveMsg && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {saveMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-violet-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ===== Tab: 基本設定 ===== */}
        {activeTab === "basic" && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <Field label="アンケートタイトル" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="開始挨拶文">
              <textarea
                value={openingMessage}
                onChange={(e) => setOpeningMessage(e.target.value)}
                rows={3}
                className={textareaCls}
              />
            </Field>
            <Field label="終了挨拶文">
              <textarea
                value={closingMessage}
                onChange={(e) => setClosingMessage(e.target.value)}
                rows={3}
                className={textareaCls}
              />
            </Field>
            <Field label="レビュー確認メッセージ">
              <textarea
                value={completionMessage}
                onChange={(e) => setCompletionMessage(e.target.value)}
                rows={3}
                className={textareaCls}
              />
            </Field>
            <Field label="キーワード">
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="例：親切,丁寧,スピーディ"
                className={inputCls}
              />
            </Field>
            <Field label="GoogleビジネスプロフィールURL">
              <input
                type="url"
                value={googleBusinessUrl}
                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className={inputCls}
              />
            </Field>
            <Field label="月間レビュー上限">
              <input
                type="number"
                min={0}
                value={monthlyReviewLimit}
                onChange={(e) => setMonthlyReviewLimit(Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="公開設定">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="text-violet-500 focus:ring-violet-400"
                  />
                  <span className="text-sm text-gray-700">公開中</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="text-violet-500 focus:ring-violet-400"
                  />
                  <span className="text-sm text-gray-700">非公開</span>
                </label>
              </div>
            </Field>
            <div className="pt-2 flex justify-end">
              <SaveButton onClick={saveBasic} saving={saving} />
            </div>
          </div>
        )}

        {/* ===== Tab: AI設定 ===== */}
        {activeTab === "ai" && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <Field label="AIプロンプトテンプレート">
              <p className="text-xs text-gray-400 mb-1">
                変数: &#123;tone&#125;, &#123;keywords&#125;, &#123;formattedResponses&#125;
              </p>
              <textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                rows={12}
                className={`${textareaCls} font-mono`}
              />
            </Field>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">口調リスト</label>
              <div className="space-y-2">
                {tones.map((tone) => (
                  <div key={tone.localId} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tone.name}
                      onChange={(e) => updateToneName(tone.localId, e.target.value)}
                      placeholder="例：丁寧な敬体"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => removeTone(tone.localId)}
                      disabled={tones.length <= 1}
                      className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30 shrink-0"
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

            <div className="pt-2 flex justify-end">
              <SaveButton onClick={saveAI} saving={saving} />
            </div>
          </div>
        )}

        {/* ===== Tab: 質問管理 ===== */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
              {questions.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-400">質問がありません</p>
              )}
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 flex items-start gap-3 transition-colors ${
                    dragIdx === idx ? "opacity-40" : ""
                  } ${dragOverIdx === idx && dragIdx !== idx ? "bg-violet-50" : ""}`}
                >
                  {/* Drag handle */}
                  <button
                    type="button"
                    className="shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 mt-0.5"
                    title="ドラッグして並べ替え"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    </svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-800 truncate">{q.text}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          q.type === "choice"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {q.type === "choice" ? "選択式" : "テキスト"}
                      </span>
                      {q.groupName && (<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">{q.groupName}</span>)}
                    </div>
                    <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={q.isRandom}
                        onChange={(e) => toggleQuestionRandom(q.id, e.target.checked)}
                        className="rounded border-gray-300 text-violet-500 focus:ring-violet-400"
                      />
                      <span className="text-xs text-gray-500">ランダム表示</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(q.id)}
                    className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add question inline form */}
            {showAddQuestion ? (
              <div className="bg-white rounded-xl shadow p-5 space-y-3 border border-violet-500/50">
                <h3 className="text-sm font-semibold text-gray-800">質問を追加</h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={useGrouping} onChange={(e) => setUseGrouping(e.target.checked)} className="rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
                  <span className="text-sm text-gray-700">グルーピングランダム質問設定を行う</span>
                </label>
                {useGrouping ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">グループ名</label>
                      <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="グループ名を入力してください" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">質問（複数入力できます）</label>
                      <div className="space-y-3">
                        {groupQuestions.map((gq, gi) => (
                          <div key={gi} className="border border-gray-200 rounded-lg p-3 space-y-2">
                            <div className="flex gap-2">
                              <textarea value={gq.text} onChange={(e) => setGroupQuestions((prev) => prev.map((q, i) => i === gi ? { ...q, text: e.target.value } : q))} placeholder={`質問文 ${gi + 1}`} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none" rows={2} />
                              {groupQuestions.length > 1 && (
                                <button type="button" onClick={() => setGroupQuestions((prev) => prev.filter((_, i) => i !== gi))} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors self-start mt-1">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">質問の種類:</span>
                              <select value={gq.type} onChange={(e) => setGroupQuestions((prev) => prev.map((q, i) => i === gi ? { ...q, type: e.target.value as "choice" | "text" } : q))} className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
                                <option value="text">記述式</option>
                                <option value="choice">選択式</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setGroupQuestions((prev) => [...prev, { text: "", type: "text", choices: [] }])} className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-500 transition-colors mt-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        質問を追加
                      </button>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={handleAddQuestion} disabled={!groupName.trim() || groupQuestions.every((gq) => !gq.text.trim())} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">追加</button>
                      <button type="button" onClick={() => { setShowAddQuestion(false); setUseGrouping(false); }} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">キャンセル</button>
                    </div>
                  </div>
                ) : (
                <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">質問文</label>
                  <input
                    type="text"
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="例：スタッフの対応はいかがでしたか？"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">回答タイプ</label>
                  <div className="flex gap-4">
                    {(["choice", "text"] as const).map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="newQType"
                          value={t}
                          checked={newQType === t}
                          onChange={() => setNewQType(t)}
                          className="text-violet-500 focus:ring-violet-400"
                        />
                        <span className="text-sm text-gray-700">
                          {t === "choice" ? "選択式" : "テキスト入力"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newQIsRandom}
                    onChange={(e) => setNewQIsRandom(e.target.checked)}
                    className="rounded border-gray-300 text-violet-500 focus:ring-violet-400"
                  />
                  <span className="text-sm text-gray-700">ランダム表示</span>
                </label>
                {newQType === "choice" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-600">選択肢</label>
                    {newQChoices.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={c.text}
                          onChange={(e) =>
                            setNewQChoices((prev) =>
                              prev.map((ch, i) => (i === ci ? { ...ch, text: e.target.value } : ch))
                            )
                          }
                          placeholder={`選択肢 ${ci + 1}`}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                        />
                        <select
                          value={c.score}
                          onChange={(e) =>
                            setNewQChoices((prev) =>
                              prev.map((ch, i) =>
                                i === ci ? { ...ch, score: Number(e.target.value) } : ch
                              )
                            )
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
                        >
                          <option value={2}>+2</option>
                          <option value={1}>+1</option>
                          <option value={0}>0</option>
                          <option value={-1}>-1</option>
                          <option value={-2}>-2</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setNewQChoices((prev) =>
                              prev.filter((_, i) => i !== ci).map((ch, i) => ({ ...ch, order: i }))
                            )
                          }
                          disabled={newQChoices.length <= 1}
                          className="text-gray-300 hover:text-red-400 disabled:opacity-30"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setNewQChoices((prev) => [
                          ...prev,
                          { text: "", order: prev.length, score: 0 },
                        ])
                      }
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      選択肢を追加
                    </button>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    disabled={!newQText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddQuestion(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
                </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddQuestion(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-violet-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                質問を追加
              </button>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveQuestions}
                disabled={questionsSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
              >
                {questionsSaving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        )}

        {/* ===== Tab: ロゴ・クーポン ===== */}
        {activeTab === "logo" && (
          <div className="bg-white rounded-xl shadow p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ロゴ画像</label>
              <p className="text-xs text-gray-400 mb-2">推奨サイズ 200x50px / JPEG・PNG・WebP・GIF・SVG / 5MBまで</p>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
                onDragLeave={() => setLogoDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setLogoDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) uploadLogoFile(file);
                }}
                onClick={() => document.getElementById("logo-file-input")?.click()}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                  logoDragging ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50"
                }`}
              >
                {logoUploading ? (
                  <span className="text-sm text-gray-500">アップロード中...</span>
                ) : logoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt="ロゴプレビュー" className="h-14 object-contain" />
                    <span className="text-xs text-gray-400">クリックまたはドラッグで変更</span>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500">クリックまたはドラッグ&ドロップで画像をアップロード</span>
                  </>
                )}
              </div>
              <input
                id="logo-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogoFile(f); }}
              />
              {logoUploadError && <p className="text-xs text-red-500 mt-1">{logoUploadError}</p>}
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => { setLogoUrl(""); setLogoUploadError(null); }}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                >
                  画像を削除
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">クーポン有効化</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={couponEnabled}
                  onChange={(e) => setCouponEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-violet-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                <span className="ml-3 text-sm text-gray-700">
                  {couponEnabled ? "有効" : "無効"}
                </span>
              </label>
              <p className="text-xs text-gray-400 mt-1">
                クーポンON時、アンケート完了後にクーポン画像が表示されます
              </p>
            </div>

            {/* Coupon image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">クーポン画像</label>
              <p className="text-xs text-gray-400 mb-2">推奨サイズ 384x192px / JPEG・PNG・WebP・GIF / 2MBまで</p>
              <div
                onDragOver={(e) => { e.preventDefault(); setCouponDragging(true); }}
                onDragLeave={() => setCouponDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setCouponDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) uploadCouponFile(file);
                }}
                onClick={() => document.getElementById("coupon-file-input")?.click()}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                  couponDragging ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50"
                }`}
              >
                {couponUploading ? (
                  <span className="text-sm text-gray-500">アップロード中...</span>
                ) : couponImageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={couponImageUrl} alt="クーポン画像プレビュー" className="max-h-32 object-contain rounded" />
                    <span className="text-xs text-gray-400">クリックまたはドラッグで変更</span>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="text-sm text-gray-500">クリックまたはドラッグ&ドロップでクーポン画像をアップロード</span>
                  </>
                )}
              </div>
              <input
                id="coupon-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCouponFile(f); }}
              />
              {couponUploadError && <p className="text-xs text-red-500 mt-1">{couponUploadError}</p>}
              {couponImageUrl && (
                <button
                  type="button"
                  onClick={() => { setCouponImageUrl(""); setCouponUploadError(null); }}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                >
                  画像を削除
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">アンケートURL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={surveyUrl}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {copying ? "コピー済み!" : "コピー"}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <SaveButton onClick={saveLogoCoupon} saving={saving} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Helper components ----
const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";
const textareaCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
    >
      {saving ? "保存中..." : "保存"}
    </button>
  );
}
