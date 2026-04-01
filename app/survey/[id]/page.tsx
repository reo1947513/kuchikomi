"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChatMessage from "@/components/ChatMessage";

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
  choices: Choice[];
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  googleBusinessUrl: string | null;
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
  | { type: "questioning"; questionIndex: number }
  | { type: "text_input"; questionIndex: number }
  | { type: "generating" }
  | { type: "done"; reviewText: string; googleBusinessUrl: string | null; completionMessage: string | null }
  | { type: "error"; message: string };

export default function SurveyPage({
  params,
}: {
  params: { id: string };
}) {
  const surveyId = params.id;

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
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ surveyId }),
        });

        if (!res.ok) {
          const data = await res.json();
          setPhase({ type: "error", message: data.error ?? "エラーが発生しました" });
          return;
        }

        const data: Session = await res.json();
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

    const nextIndex = questionIndex + 1;

    if (nextIndex < questions.length) {
      const nextQ = questions[nextIndex];
      const botMsg: Message = { role: "bot", text: nextQ.text };

      setMessages((prev) => [...prev, userMsg, botMsg]);

      if (nextQ.type === "text") {
        setPhase({ type: "text_input", questionIndex: nextIndex });
      } else {
        setPhase({ type: "questioning", questionIndex: nextIndex });
      }
    } else {
      // All questions answered — generate review
      const thankMsg: Message = {
        role: "bot",
        text: "ありがとうございました！回答内容をもとに口コミ文章を作成しています...",
      };
      setMessages((prev) => [...prev, userMsg, thankMsg]);
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
        setPhase({
          type: "error",
          message: data.error ?? "口コミの生成に失敗しました",
        });
        return;
      }

      const data: {
        reviewText: string;
        googleBusinessUrl: string | null;
        completionMessage: string | null;
      } = await res.json();

      // Add completionMessage as a bot message if present
      if (data.completionMessage) {
        const completionMsg: Message = {
          role: "bot",
          text: data.completionMessage,
        };
        setMessages((prev) => [...prev, completionMsg]);
      }

      setReviewEditText(data.reviewText);
      setPhase({
        type: "done",
        reviewText: data.reviewText,
        googleBusinessUrl: data.googleBusinessUrl,
        completionMessage: data.completionMessage ?? null,
      });
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFFBEB" }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-semibold text-gray-800 truncate">
              {session?.survey.title ?? "アンケート"}
            </h1>
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "#F5C518",
              }}
            />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-32">
        {phase.type === "loading_session" && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#F5C518", borderTopColor: "transparent" }}
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
          <ChatMessage key={i} type={msg.role} message={msg.text} />
        ))}

        {/* Generating spinner */}
        {phase.type === "generating" && (
          <div className="flex items-start gap-2 mb-4">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: "#F5C518" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </div>
            <div className="flex items-center gap-1 px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm">
              <span
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#F5C518", animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#F5C518", animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#F5C518", animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {/* Done: show generated review */}
        {phase.type === "done" && (
          <div className="mt-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#F5C518" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  生成された口コミ文章
                </span>
              </div>

              {/* Editable textarea */}
              <textarea
                className="w-full min-h-[120px] resize-y rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                value={reviewEditText}
                onChange={(e) => setReviewEditText(e.target.value)}
              />

              {/* Character count */}
              <p className="text-xs text-gray-400 text-right mt-1">
                {reviewEditText.length}文字
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {phase.googleBusinessUrl && (
                <button
                  onClick={() => handleGooglePost(phase.googleBusinessUrl!)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#4285F4" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-white flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 11h8.533c.044.385.067.78.067 1.184 0 2.734-.98 5.047-2.683 6.61C16.32 20.218 14.32 21 12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9c2.43 0 4.467.884 6.025 2.33L16.5 6.852C15.346 5.77 13.753 5.1 12 5.1 7.965 5.1 4.7 8.365 4.7 12s3.265 6.9 7.3 6.9c3.486 0 5.93-2.328 6.36-5.4H12v-2.5Z" />
                  </svg>
                  Google Mapで口コミを投稿
                </button>
              )}

              <button
                onClick={copyReview}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-gray-700 text-sm font-semibold shadow-sm border border-gray-200 bg-white transition-colors hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    コピーしました！
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.469 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.149Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    コピーする
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href={`/survey/${surveyId}`}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  アンケートへ戻る
                </Link>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Sticky bottom input area */}
      {(phase.type === "questioning" || phase.type === "text_input") && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="max-w-lg mx-auto px-4 py-3">
            {phase.type === "questioning" && (
              <div className="flex flex-col gap-2">
                {questions[phase.questionIndex]?.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() =>
                      submitAnswer(phase.questionIndex, choice.id, undefined)
                    }
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-800 font-medium border-2 transition-colors bg-white hover:bg-yellow-50"
                    style={{ borderColor: "#F5C518" }}
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
                      "--tw-ring-color": "#F5C518",
                    } as React.CSSProperties
                  }
                  rows={2}
                  placeholder="ご回答を入力してください..."
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
                  style={{ backgroundColor: "#F5C518" }}
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
