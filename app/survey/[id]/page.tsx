"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChatMessage from "@/components/ChatMessage";
import { useLang, LangToggle } from "@/lib/i18n";
import { surveyDict } from "@/lib/dictionaries/lp";

interface Choice {
  id: string;
  text: string;
  order: number;
  score: number;
}

interface Question {
  id: string;
  text: string;
  order: number;
  type: "choice" | "text";
  groupName: string | null;
  choices: Choice[];
  parentQuestionId?: string | null;
  triggerChoiceId?: string | null;
  branchQuestions?: Question[];
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  googleBusinessUrl: string | null;
  logoUrl: string | null;
  chatIconType: string | null;
  chatIconPreset: string | null;
  themeMainColor: string | null;
  themeUserColor: string | null;
  closingMessage: string | null;
  minRandomQuestions: number;
  maxRandomQuestions: number;
  themeTextColor: string | null;
  questions: Question[];
}

interface Session {
  id: string;
  survey: Survey;
}

type Message =
  | { role: "bot"; text: string }
  | { role: "user"; text: string };

type Phase =
  | { type: "loading_session" }
  | { type: "waiting" }
  | { type: "questioning"; questionIndex: number }
  | { type: "text_input"; questionIndex: number }
  | { type: "generating" }
  | { type: "done"; reviewText: string; googleBusinessUrl: string | null; completionMessage: string | null; sessionId: string }
  | { type: "error"; message: string };

export default function SurveyPage({
  params,
}: {
  params: { id: string };
}) {
  const surveyId = params.id;
  const { lang } = useLang();
  const t = (key: string) => surveyDict[key]?.[lang] ?? surveyDict[key]?.ja ?? key;

  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<Phase>({ type: "loading_session" });
  const [textInput, setTextInput] = useState("");
  const [answeredCount, setAnsweredCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reviewEditText, setReviewEditText] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  // Initialise: create a session on mount
  useEffect(() => {
    async function init() {
      try {
        const isPreview = new URLSearchParams(window.location.search).get("preview") === "true";
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ surveyId, isTest: isPreview }),
        });

        if (!res.ok) {
          const data = await res.json();
          setPhase({ type: "error", message: data.error ?? "エラーが発生しました" });
          return;
        }

        const data: Session = await res.json();

        // Group random: pick one question per group
        // Filter out branch questions from top-level (they are nested in branchQuestions)
        const allQuestions = (data.survey.questions as Question[]).filter((q) => !q.parentQuestionId);
        const fixedQuestions: Question[] = [];
        const randomPool: Question[] = [];
        for (const q of allQuestions) {
          if (q.groupName || (q as any).isRandom) {
            randomPool.push(q);
          } else {
            fixedQuestions.push(q);
          }
        }
        // Pick min~max from random pool
        const minR = data.survey.minRandomQuestions || 1;
        const maxR = data.survey.maxRandomQuestions || randomPool.length;
        const count = Math.min(randomPool.length, Math.max(minR, Math.floor(Math.random() * (maxR - minR + 1)) + minR));
        const shuffled = [...randomPool].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, count);
        const finalQuestions = [...fixedQuestions, ...picked];
        finalQuestions.sort((a, b) => a.order - b.order);
        data.survey.questions = finalQuestions;

        setSession(data);

        const questions = data.survey.questions;

        // Welcome message
        const intro: Message = {
          role: "bot",
          text:
            data.survey.description ??
            `${data.survey.title}のアンケートへようこそ！いくつか質問させていただきます。`,
        };

        if (questions.length === 0) {
          setMessages([intro]);
          setPhase({ type: "error", message: "質問が設定されていません。" });
          return;
        }

        const firstQ: Message = {
          role: "bot",
          text: questions[0].text,
        };

        setMessages([intro, firstQ]);

        if (questions[0].type === "text") {
          setPhase({ type: "text_input", questionIndex: 0 });
        } else {
          setPhase({ type: "questioning", questionIndex: 0 });
        }
      } catch {
        setPhase({ type: "error", message: "セッションの作成に失敗しました。" });
      }
    }

    init();
  }, [surveyId]);

  const questions = session?.survey.questions ?? [];
  const mainColor = session?.survey.themeMainColor || "#8B5CF6";
  const userColor = session?.survey.themeUserColor || "#8B5CF6";
  const textColor = session?.survey.themeTextColor || "#FFFFFF";
  const totalQuestions = questions.length;

  async function submitAnswer(
    questionIndex: number,
    choiceId?: string,
    textValue?: string
  ) {
    if (!session) return;

    const question = questions[questionIndex];
    const choiceText =
      choiceId
        ? question.choices.find((c) => c.id === choiceId)?.text ?? ""
        : textValue ?? "";

    // Add user bubble
    const userMsg: Message = { role: "user", text: choiceText };

    await fetch(`/api/sessions/${session.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        choiceId,
        textValue,
      }),
    });

    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);

    // Check for branch questions triggered by this answer
    const branchQ = (question.branchQuestions ?? []).find((bq) => {
      if (question.type === "choice" && choiceId) {
        return bq.triggerChoiceId === choiceId;
      }
      // For text questions, branch with no triggerChoiceId
      return question.type === "text" && !bq.triggerChoiceId;
    });

    if (branchQ) {
      // Show branch question next
      const botMsg: Message = { role: "bot", text: branchQ.text };
      setMessages((prev) => [...prev, userMsg]);
      setPhase({ type: "waiting" });
      await new Promise((r) => setTimeout(r, 800));
      setMessages((prev) => [...prev, botMsg]);

      // Insert branch question into the questions array right after current
      const insertIdx = questionIndex + 1;
      const branchAsQuestion: Question = {
        id: branchQ.id || `branch-${Date.now()}`,
        text: branchQ.text,
        order: 0,
        type: branchQ.type,
        groupName: null,
        choices: branchQ.choices ?? [],
        branchQuestions: [],
      };

      // Insert only if not already inserted
      if (!questions[insertIdx] || questions[insertIdx].id !== branchAsQuestion.id) {
        const updated = [...questions];
        updated.splice(insertIdx, 0, branchAsQuestion);
        if (session) {
          session.survey.questions = updated;
        }
      }

      if (branchQ.type === "text") {
        setTextInput("");
        setPhase({ type: "text_input", questionIndex: insertIdx });
      } else {
        setPhase({ type: "questioning", questionIndex: insertIdx });
      }
      return;
    }

    const nextIndex = questionIndex + 1;

    if (nextIndex < questions.length) {
      const nextQ = questions[nextIndex];
      const botMsg: Message = { role: "bot", text: nextQ.text };

      // Show user answer first
      setMessages((prev) => [...prev, userMsg]);
      setPhase({ type: "waiting" }); // temporarily disable input without showing spinner

      // Delay before showing bot's next question
      await new Promise((r) => setTimeout(r, 800));

      setMessages((prev) => [...prev, botMsg]);

      if (nextQ.type === "text") {
        setTextInput("");
        setPhase({ type: "text_input", questionIndex: nextIndex });
      } else {
        setPhase({ type: "questioning", questionIndex: nextIndex });
      }
    } else {
      // All questions answered — generate review
      const thankMsg: Message = {
        role: "bot",
        text: session?.survey?.closingMessage || "ありがとうございました！",
      };
      setMessages((prev) => [...prev, userMsg]);
      await new Promise((r) => setTimeout(r, 800));
      setMessages((prev) => [...prev, thankMsg]);
      setPhase({ type: "generating" });
      await generateReview();
    }
  }

  async function generateReview() {
    if (!session) return;

    try {
      const res = await fetch(`/api/sessions/${session.id}/generate`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        const isLimitReached = res.status === 429;
        setPhase({
          type: "error",
          message: isLimitReached
            ? t("survey.paused")
            : data.error ?? t("survey.generateFailed"),
        });
        return;
      }

      const data: {
        reviewText: string;
        googleBusinessUrl: string | null;
        completionMessage: string | null;
      } = await res.json();

      // Redirect to result page
      window.location.href = `/survey/${surveyId}/result/${session.id}`;
    } catch {
      setPhase({ type: "error", message: "口コミの生成に失敗しました。" });
    }
  }

  async function handleTextSubmit() {
    if (
      phase.type !== "text_input" ||
      textInput.trim() === ""
    )
      return;

    const qi = phase.questionIndex;
    const val = textInput.trim();
    setTextInput("");
    await submitAnswer(qi, undefined, val);
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewEditText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = reviewEditText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleGooglePost(url: string) {
    // copy the current edited text to clipboard
    try {
      await navigator.clipboard.writeText(reviewEditText);
    } catch {
      // fallback
    }
    // open Google Business URL
    window.open(url, "_blank");
  }

  const progressPercent =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  const isPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "true";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: `${mainColor}10` }}
    >
      {/* Test mode banner */}
      {isPreview && (
        <div className="bg-amber-500 text-white text-center text-xs font-bold py-1.5 z-20">
          {t("survey.testMode")}
        </div>
      )}
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {session?.survey.logoUrl && (
                <img
                  src={session.survey.logoUrl}
                  alt="logo"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <h1 className="text-base font-semibold text-gray-800 truncate">
                {session?.survey.title ?? "アンケート"}
              </h1>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <span className="text-xs text-gray-500">
                {answeredCount}/{totalQuestions}
              </span>
              <LangToggle className="border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: mainColor,
              }}
            />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-12 pb-32 relative z-0">
        {phase.type === "loading_session" && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: mainColor, borderTopColor: "transparent" }}
            />
          </div>
        )}

        {phase.type === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {phase.message}
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} type={msg.role} message={msg.text} mainColor={mainColor} userColor={userColor} chatIconType={session?.survey.chatIconType} chatIconPreset={session?.survey.chatIconPreset} logoUrl={session?.survey.logoUrl} />
        ))}





        <div ref={bottomRef} />
      </main>

      {/* Sticky bottom input area */}
      {(phase.type === "questioning" || phase.type === "text_input") && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="max-w-lg mx-auto px-4 py-2 overflow-y-auto" style={{ maxHeight: "35vh" }}>
            {phase.type === "questioning" && (
              <div className="flex flex-wrap gap-1.5">
                {questions[phase.questionIndex]?.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() =>
                      submitAnswer(phase.questionIndex, choice.id, undefined)
                    }
                    className="px-4 py-2 rounded-full text-sm text-gray-800 font-medium border-2 transition-colors bg-white hover:bg-violet-50"
                    style={{ borderColor: mainColor }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}

            {phase.type === "text_input" && (
              <div className="flex gap-2">
                <textarea
                  className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={
                    {
                      "--tw-ring-color": mainColor,
                    } as React.CSSProperties
                  }
                  rows={2}
                  placeholder={t("survey.textPlaceholder")}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleTextSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={textInput.trim() === ""}
                  className="flex-shrink-0 w-10 h-10 self-end rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40"
                  style={{ backgroundColor: mainColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
