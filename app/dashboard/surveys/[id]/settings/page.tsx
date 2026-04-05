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
  couponExpiry?: string | null;
  chatIconType?: string | null;
  chatIconPreset?: string | null;
  themeMainColor?: string | null;
  themeUserColor?: string | null;
  minRandomQuestions?: number;
  maxRandomQuestions?: number;
  themeTextColor?: string | null;
  selectedToneId?: string | null;
  toneRandom?: boolean;
  tones: Tone[];
  questions: Question[];
};

type Tab = "basic" | "ai" | "questions" | "logo" | "color";

const COLOR_THEMES = [
  { name: "\u30c7\u30d5\u30a9\u30eb\u30c8", main: "#06B6D4", user: "#8B5CF6", text: "#FFFFFF" },
  { name: "\u30b7\u30f3\u30d7\u30eb\u30db\u30ef\u30a4\u30c8", main: "#FFFFFF", user: "#E5E7EB", text: "#374151" },
  { name: "\u30b7\u30f3\u30d7\u30eb\u30b0\u30ec\u30fc", main: "#6B7280", user: "#9CA3AF", text: "#FFFFFF" },
  { name: "\u30b7\u30f3\u30d7\u30eb\u30d6\u30e9\u30c3\u30af", main: "#1F2937", user: "#374151", text: "#FFFFFF" },
  { name: "\u30b7\u30f3\u30d7\u30eb\u30df\u30f3\u30c8", main: "#10B981", user: "#34D399", text: "#FFFFFF" },
  { name: "\u30d6\u30eb\u30fc\u7cfb", main: "#2563EB", user: "#3B82F6", text: "#FFFFFF" },
  { name: "\u30ec\u30c3\u30c9\u7cfb", main: "#DC2626", user: "#EF4444", text: "#FFFFFF" },
  { name: "\u30d1\u30fc\u30d7\u30eb\u7cfb", main: "#7C3AED", user: "#8B5CF6", text: "#FFFFFF" },
  { name: "\u30aa\u30ec\u30f3\u30b8\u7cfb", main: "#EA580C", user: "#F97316", text: "#FFFFFF" },
  { name: "\u30c6\u30a3\u30fc\u30eb\u7cfb", main: "#0D9488", user: "#14B8A6", text: "#FFFFFF" },
];

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

const CHAT_ICON_PATHS: Record<string, { d: string; stroke?: boolean }> = {
  home: { d: "M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" },
  store: { d: "M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" },
  heart: { d: "M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" },
  star: { d: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" },
  smile: { d: "M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z", stroke: true },
  utensils: { d: "M4 4v8h3v8h2V4H7v6H5V4H4Zm10 0v6.5c0 1.38 1.12 2.5 2.5 2.5H18v7h2V4h-2v7h-1.5c-.28 0-.5-.22-.5-.5V4h-2Z" },
  scissors: { d: "M9.75 9.362a.75.75 0 0 0-1.08.673v2.929a.75.75 0 0 0 1.08.674L12 12.576V14.5a2.5 2.5 0 1 1-5 0V12l-2.22 1.11a.75.75 0 0 0 .67 1.34L7.5 13.5v1a4 4 0 0 0 8 0v-1l2.05 1.025a.75.75 0 0 0 .67-1.34L16 12v-2.5a2.5 2.5 0 0 0-5 0v1.924l-1.25-.562Z" },
  medical: { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-4H7v-2h4V7h2v4h4v2h-4v4Z" },
};

function ChatIconPreview({ iconKey }: { iconKey: string }) {
  const icon = CHAT_ICON_PATHS[iconKey] || CHAT_ICON_PATHS.home;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"
      fill={icon.stroke ? "none" : "white"}
      stroke={icon.stroke ? "white" : "none"}
      strokeWidth={icon.stroke ? 1.5 : 0}
    >
      <path d={icon.d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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

  const [activeTab, setActiveTab] = useState<Tab>("logo");
  const [chatIconType, setChatIconType] = useState<string>("preset");
  const [chatIconPreset, setChatIconPreset] = useState<string>("home");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [userPlanType, setUserPlanType] = useState<string | null>(null);
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
  const [selectedToneId, setSelectedToneId] = useState("");
  const [toneRandom, setToneRandom] = useState(true);
  const [tones, setTones]  = useState<Array<{ localId: string; name: string; id?: string }>>([]);

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
  const [couponExpiry, setCouponExpiry] = useState("");
  const [minRandomQuestions, setMinRandomQuestions] = useState(0);
  const [maxRandomQuestions, setMaxRandomQuestions] = useState(0);
  const [themeMainColor, setThemeMainColor] = useState("#06B6D4");
  const [themeUserColor, setThemeUserColor] = useState("#8B5CF6");
  const [themeTextColor, setThemeTextColor] = useState("#FFFFFF");
  const [logoDragging, setLogoDragging] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [couponDragging, setCouponDragging] = useState(false);
  const [couponUploading, setCouponUploading] = useState(false);
  const [couponUploadError, setCouponUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      setUserRole(d.role ?? "");
      setUserPlanType(d.planType ?? null);
      if (d.role === "super") setActiveTab("basic");
    }).catch(() => {});
  }, []);

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
      setSelectedToneId(data.selectedToneId ?? "");
      setToneRandom(data.toneRandom ?? true);
      setTones(
        (data.tones ?? []).map((t) => ({ localId: newLocalToneId(), name: t.name, id: t.id }))
      );
      setQuestions(data.questions ?? []);
      setLogoUrl(data.logoUrl ?? "");
      setCouponImageUrl(data.couponImageUrl ?? "");
      setCouponEnabled(data.couponEnabled ?? false);
      setCouponExpiry(data.couponExpiry ?? "");
      setChatIconType(data.chatIconType ?? "preset");
      setChatIconPreset(data.chatIconPreset ?? "home");
      setMinRandomQuestions(data.minRandomQuestions ?? 0);
      setMaxRandomQuestions(data.maxRandomQuestions ?? 0);
      setThemeMainColor(data.themeMainColor ?? "#06B6D4");
      setThemeUserColor(data.themeUserColor ?? "#8B5CF6");
      setThemeTextColor(data.themeTextColor ?? "#FFFFFF");
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
      couponExpiry: couponExpiry || null,
      chatIconType,
      chatIconPreset,
      minRandomQuestions,
      maxRandomQuestions,
      themeMainColor,
      themeUserColor,
      themeTextColor,
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
        const added: Question[] = [];
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

  // ---- Copy URL & QR ----
  const [copying, setCopying] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrGenerating, setQrGenerating] = useState(false);

  const generateQR = async () => {
    setQrGenerating(true);
    try {
      const size = 300;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(surveyUrl)}&format=png`;
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      setQrDataUrl(URL.createObjectURL(blob));
    } catch { alert("QRコードの生成に失敗しました"); }
    finally { setQrGenerating(false); }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `survey-qr-${surveyId}.png`;
    a.click();
  };
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
    ...(userRole === "super" ? [
      { key: "basic" as Tab, label: "基本設定" },
      { key: "ai" as Tab, label: "AI設定" },
      { key: "questions" as Tab, label: "質問管理" },
    ] : []),
    { key: "logo", label: "ロゴ・クーポン" },
    { key: "color", label: "カラー設定" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">アンケート設定</h1>
            <p className="text-sm text-gray-500 mt-1 truncate">{title}</p>
          </div>
          <a
            href={`/survey/${surveyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 rounded-xl text-sm text-white font-semibold shadow-sm transition-colors"
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

        {/* Survey URL & QR Code */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">アンケートURL</label>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input type="text" value={surveyUrl} readOnly className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 select-all" />
            <div className="flex gap-2">
              <button type="button" onClick={handleCopyUrl} className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">{copying ? "コピー済み!" : "コピー"}</button>
              <button type="button" onClick={generateQR} disabled={qrGenerating} className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap disabled:opacity-50">{qrGenerating ? "生成中..." : "QRコード作成"}</button>
            </div>
          </div>
          {qrDataUrl && (
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <img src={qrDataUrl} alt="QR Code" className="w-32 h-32 rounded" />
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600 mb-2">QRコードが生成されました</p>
                <button type="button" onClick={downloadQR} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-medium rounded-lg transition-colors">ダウンロード</button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
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
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
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
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
            {/* 固定プロンプト表示 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">固定部分（編集不可）</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 font-mono whitespace-pre-line">
                {`アンケート回答：\n{formattedResponses}\n\nこの情報を基に、魅力的な口コミを生成してください。`}
              </div>
            </div>

            <Field label="AIプロンプトテンプレート（カスタム部分）">
              {(userPlanType === "premium" || userPlanType === "lifetime_premium" || userRole === "super") ? (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    変数: &#123;tone&#125;, &#123;keywords&#125;
                  </p>
                  <textarea
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    rows={12}
                    className={`${textareaCls} font-mono`}
                  />
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <svg className="w-6 h-6 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm text-gray-500">プレミアムプランでカスタマイズ可能</p>
                  <a href="/dashboard/billing" className="text-xs text-violet-500 hover:underline">プランをアップグレード</a>
                </div>
              )}
            </Field>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">使用する口調</label>
              <p className="text-xs text-gray-400 mb-2">固定の口調を使用するか、ランダムに選択するかを設定します。</p>
              <select
                value={selectedToneId}
                onChange={(e) => setSelectedToneId(e.target.value)}
                disabled={toneRandom}
                className={`${inputCls} mb-2 ${toneRandom ? "opacity-50" : ""}`}
              >
                <option value="">口調を選択してください</option>
                {tones.map((t) => (
                  <option key={t.localId} value={t.id || t.localId}>{t.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 cursor-pointer select-none mb-4">
                <input type="checkbox" checked={toneRandom} onChange={(e) => setToneRandom(e.target.checked)} className="rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
                <span className="text-sm text-gray-700">口調をランダムに選択する</span>
              </label>
            </div>

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

            {/* Random question count settings */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <label className="block text-sm font-semibold text-gray-700">ランダム質問表示数設定</label>
              <p className="text-xs text-gray-500">ランダム対象の質問数: {questions.filter((q: any) => q.isRandom || q.groupName).length}件</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">最小値</span>
                  <input type="number" min={0} value={minRandomQuestions} onChange={(e) => setMinRandomQuestions(Number(e.target.value))} className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">最大値</span>
                  <input type="number" min={0} value={maxRandomQuestions} onChange={(e) => setMaxRandomQuestions(Number(e.target.value))} className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400" />
                </div>
              </div>
              <p className="text-xs text-gray-400">ランダム表示がONの質問とグルーピング質問から、指定した範囲の数だけランダムに表示します。0の場合は全件表示。</p>
            </div>

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
                              <select value={gq.type} onChange={(e) => setGroupQuestions((prev) => prev.map((q, i) => i === gi ? { ...q, type: e.target.value as "choice" | "text", choices: e.target.value === "choice" ? [{text:"非常に満足",order:0,score:2},{text:"満足",order:1,score:1},{text:"どちらとも言えない",order:2,score:0},{text:"やや不満",order:3,score:-1},{text:"不満",order:4,score:-2}] : [] } : q))} className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
                                <option value="text">記述式</option>
                                <option value="choice">選択式</option>
                              </select>
                            </div>
                            {gq.type === "choice" && (
                              <div className="space-y-1.5 mt-2">
                                <label className="block text-xs font-medium text-gray-500">選択肢</label>
                                {(gq.choices || []).map((ch, ci) => (
                                  <div key={ci} className="flex items-center gap-2">
                                    <input type="text" value={ch.text} onChange={(e) => setGroupQuestions((prev) => prev.map((q, i) => i === gi ? { ...q, choices: q.choices.map((c2, j) => j === ci ? { ...c2, text: e.target.value } : c2) } : q))} placeholder={`選択肢 ${ci + 1}`} className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                                    <button type="button" onClick={() => setGroupQuestions((prev) => prev.map((q, i) => i === gi ? { ...q, choices: q.choices.filter((_, j) => j !== ci) } : q))} disabled={(gq.choices || []).length <= 1} className="text-gray-300 hover:text-red-400 disabled:opacity-30"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                  </div>
                                ))}
                                <button type="button" onClick={() => setGroupQuestions((prev) => prev.map((q, i) => i === gi ? { ...q, choices: [...q.choices, { text: "", order: q.choices.length, score: 0 }] } : q))} className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-500 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>選択肢を追加</button>
                              </div>
                            )}
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
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-5">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">クーポン有効期限</label>
              <input
                type="date"
                value={couponExpiry}
                onChange={(e) => setCouponExpiry(e.target.value)}
                className={inputCls}
              />
              <p className="text-xs text-gray-400 mt-1">設定すると結果ページのクーポン画像の下に有効期限が表示されます</p>
            </div>

            {/* Chat Icon Setting */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">チャットアイコン</h3>
              <p className="text-xs text-gray-500 mb-4">アンケート画面でボットメッセージの横に表示されるアイコンを設定します</p>

              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="chatIconType" value="preset" checked={chatIconType === "preset"} onChange={() => setChatIconType("preset")} className="text-violet-500 focus:ring-violet-400" />
                  <span className="text-sm text-gray-700">プリセットアイコン</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="chatIconType" value="logo" checked={chatIconType === "logo"} onChange={() => setChatIconType("logo")} className="text-violet-500 focus:ring-violet-400" />
                  <span className="text-sm text-gray-700">ショップロゴを使用</span>
                </label>
              </div>

              {chatIconType === "preset" && (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {[
                    { key: "home", label: "ホーム" },
                    { key: "store", label: "ショップ" },
                    { key: "heart", label: "ハート" },
                    { key: "star", label: "スター" },
                    { key: "smile", label: "スマイル" },
                    { key: "utensils", label: "飲食" },
                    { key: "scissors", label: "美容" },
                    { key: "medical", label: "医療" },
                  ].map((icon) => (
                    <button
                      key={icon.key}
                      type="button"
                      onClick={() => setChatIconPreset(icon.key)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${chatIconPreset === icon.key ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-300"}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                        <ChatIconPreview iconKey={icon.key} />
                      </div>
                      <span className="text-xs text-gray-600">{icon.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {chatIconType === "logo" && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  {logoUrl ? (
                    <>
                      <img src={logoUrl} alt="logo" className="w-9 h-9 rounded-full object-cover" />
                      <span className="text-sm text-gray-600">アップロード済みのロゴが使用されます</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">ロゴをアップロードしてください（上のロゴ設定から）</span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <SaveButton onClick={saveLogoCoupon} saving={saving} />
            </div>
          </div>
        )}

        {activeTab === "color" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-1">カラーテーマを選択</h3>
              <p className="text-xs text-gray-400 mb-4">テンプレートを選択すると、関連するカラーが自動的に設定されます</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {COLOR_THEMES.map((theme) => {
                  const isSel = themeMainColor === theme.main && themeUserColor === theme.user && themeTextColor === theme.text;
                  return (
                    <button key={theme.name} type="button" onClick={() => { setThemeMainColor(theme.main); setThemeUserColor(theme.user); setThemeTextColor(theme.text); }} className={`relative border-2 rounded-xl p-3 text-center transition-colors ${isSel ? "border-violet-500" : "border-gray-200 hover:border-gray-300"}`}>
                      {isSel && (<div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>)}
                      <div className="h-8 rounded-md mb-2" style={{ backgroundColor: theme.main }} />
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: theme.user }}>サンプル</span>
                      <p className="text-xs text-gray-600 mt-2">{theme.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メインカラー</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeMainColor} onChange={(e) => setThemeMainColor(e.target.value)} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
                    <input type="text" value={themeMainColor} onChange={(e) => setThemeMainColor(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">ヘッダー、ボタン等</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ユーザーカラー</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeUserColor} onChange={(e) => setThemeUserColor(e.target.value)} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
                    <input type="text" value={themeUserColor} onChange={(e) => setThemeUserColor(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">ユーザーメッセージの背景と強調テキスト</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">テキストカラー</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeTextColor} onChange={(e) => setThemeTextColor(e.target.value)} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
                    <input type="text" value={themeTextColor} onChange={(e) => setThemeTextColor(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">テキスト</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4">カラープレビュー</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 font-bold text-sm" style={{ backgroundColor: themeMainColor, color: themeTextColor }}>アンケートヘッダー（メインカラー）</div>
                <div className="p-4 space-y-3 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: themeMainColor }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-2.234a4.75 4.75 0 0 1-1.661-1.57 4.668 4.668 0 0 1-.752-2.584V6.386c.114-1.866 1.483-3.478 3.405-3.727Z" /></svg></div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm shadow-sm" style={{ color: themeTextColor }}>AIメッセージです。次の質問に回答してください。</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-sm shadow-sm" style={{ backgroundColor: themeUserColor, color: themeTextColor }}>ユーザー回答</div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-white">
                  <p className="text-xs text-gray-400 mb-2">アンケート送信エリア</p>
                  <div className="py-2.5 rounded-lg text-center text-sm font-bold" style={{ backgroundColor: themeMainColor, color: themeTextColor }}>アンケートを送信</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
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
