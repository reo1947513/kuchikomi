"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

type LoginFormValues = {
  identifier: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const ja: Record<string, string> = {
    "login.title": "アカウントにログイン",
    "login.identifier": "メールアドレス / ログインID",
    "login.identifierRequired": "メールアドレスまたはログインIDを入力してください",
    "login.password": "パスワード",
    "login.passwordPlaceholder": "パスワードを入力",
    "login.passwordRequired": "パスワードを入力してください",
    "login.hidePassword": "パスワードを隠す",
    "login.showPassword": "パスワードを表示する",
    "login.submitting": "ログイン中...",
    "login.submit": "ログイン",
    "login.failed": "ログインに失敗しました",
    "login.serverError": "サーバーに接続できませんでした。しばらくしてから再度お試しください。",
  };
  const t = (key: string) => ja[key] ?? key;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || t("login.failed"));
        return;
      }

      if (redirectTo && redirectTo.startsWith("/api/")) {
        window.location.href = redirectTo;
      } else if (redirectTo) {
        router.push(redirectTo);
      } else if (json.user?.role === "super") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setServerError(t("login.serverError"));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10">
      <div className="flex flex-col items-center mb-8">
        <img src="/logo.png" alt="ComiSta" className="h-28 w-auto mb-3" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent tracking-tight">
          ComiSta
        </h1>
        <p className="text-sm text-slate-400 mt-1">{t("login.title")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
            {t("login.identifier")}
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="example@example.com または AG-XXXXXX"
            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition ${
              errors.identifier ? "border-red-400" : "border-gray-300"
            }`}
            {...register("identifier", { required: t("login.identifierRequired") })}
          />
          {errors.identifier && (
            <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t("login.password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("login.passwordPlaceholder")}
              className={`w-full rounded-lg border px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
              {...register("password", { required: t("login.passwordRequired") })}
            />
            <button
              type="button"
              aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 active:from-cyan-700 active:to-violet-700 text-white font-semibold py-2.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? t("login.submitting") : t("login.submit")}
        </button>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-gray-400 hover:text-violet-500 transition-colors">
            パスワードをお忘れの方
          </a>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4">
      <Suspense fallback={<div className="text-white">読み込み中...</div>}>
        <LoginForm />
      </Suspense>
      <footer className="text-center text-xs text-white/60 mt-6">
        &copy; 2026 ComiSta. All Rights Reserved.
      </footer>
    </main>
  );
}
