"use client";

import { useState } from "react";
import Image from "next/image";

type Phase = "input" | "confirm" | "complete";

const CATEGORY_KEYS = ["contact.cat.service", "contact.cat.pricing", "contact.cat.intro", "contact.cat.other"];

function RequiredBadge({ label }: { label: string }) {
  return <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-red-500 text-white">{label}</span>;
}

function CheckIcon() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function PublicContactPage() {
  const ja: Record<string, string> = {
    "contact.title": "お問い合わせ",
    "contact.subtitle": "ComiStaに関するお問い合わせはこちらからお気軽にどうぞ。",
    "contact.backToTop": "← トップに戻る",
    "contact.required": "必須",
    "contact.category": "お問い合わせ項目",
    "contact.selectPlaceholder": "選択してください",
    "contact.cat.service": "サービスについて",
    "contact.cat.pricing": "料金について",
    "contact.cat.intro": "導入について",
    "contact.cat.other": "その他",
    "contact.company": "会社名 / 店舗名",
    "contact.name": "名前",
    "contact.lastName": "姓",
    "contact.firstName": "名",
    "contact.email": "メールアドレス",
    "contact.phone": "連絡先",
    "contact.content": "お問い合わせ内容",
    "contact.toConfirm": "確認画面へ",
    "contact.confirmTitle": "お問い合わせ内容の確認",
    "contact.confirmDesc": "送信前に入力内容をご確認ください。",
    "contact.submitting": "送信中...",
    "contact.submit": "送信する",
    "contact.back": "戻る",
    "contact.completeTitle": "送信が完了しました",
    "contact.completeDesc": "お問い合わせいただきありがとうございます。担当者より折り返しご連絡いたします。",
    "contact.backToHome": "トップページに戻る",
    "contact.sendFailed": "送信に失敗しました。もう一度お試しください。",
    "contact.notContracted": "未契約",
  };
  const t = (key: string) => ja[key] ?? key;
  const [phase, setPhase] = useState<Phase>("input");
  const [category, setCategory] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));
  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhonePartValid = (v: string) => /^\d+$/.test(v);

  const isValid = category && companyName && lastName && firstName && isEmailValid(email) && isPhonePartValid(phone1) && isPhonePartValid(phone2) && isPhonePartValid(phone3) && content;

  const validCls = (field: string, value: string) => {
    if (!touched[field] || !value) return "border-gray-300";
    if (field === "email") return isEmailValid(value) ? "border-green-500 ring-1 ring-green-500" : "border-red-400 ring-1 ring-red-400";
    if (field === "phone1" || field === "phone2" || field === "phone3") return isPhonePartValid(value) ? "border-green-500 ring-1 ring-green-500" : "border-red-400 ring-1 ring-red-400";
    return "border-green-500 ring-1 ring-green-500";
  };

  const handleConfirm = () => {
    if (!isValid) return;
    setPhase("confirm");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          contractStatus: t("contact.notContracted"),
          companyName,
          lastName,
          firstName,
          email,
          phone: `${phone1}-${phone2}-${phone3}`,
          content,
          source: "hp",
        }),
      });
      if (!res.ok) throw new Error();
      setPhase("complete");
      window.scrollTo(0, 0);
    } catch {
      alert(t("contact.sendFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <a href="/"><Image src="/logo.png" alt="ComiSta" width={140} height={42} /></a>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">{t("contact.backToTop")}</a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-10 px-4">
        {phase === "complete" && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("contact.completeTitle")}</h2>
            <p className="text-sm text-gray-500 mb-6">{t("contact.completeDesc")}</p>
            <a href="/" className="inline-block px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl text-sm hover:from-cyan-600 hover:to-violet-600 transition-colors">{t("contact.backToHome")}</a>
          </div>
        )}

        {phase === "confirm" && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">{t("contact.confirmTitle")}</h1>
            <p className="text-sm text-gray-600 mb-8">{t("contact.confirmDesc")}</p>
            <div className="divide-y divide-gray-200">
              {[
                [t("contact.category"), category],
                [t("contact.company"), companyName],
                [t("contact.name"), `${lastName} ${firstName}`],
                [t("contact.email"), email],
                [t("contact.phone"), `${phone1}-${phone2}-${phone3}`],
                [t("contact.content"), content],
              ].map(([label, value]) => (
                <div key={label} className="flex py-4">
                  <span className="w-40 shrink-0 text-sm font-bold text-gray-700">{label}</span>
                  <span className="text-sm text-gray-800 whitespace-pre-wrap">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <button onClick={handleSubmit} disabled={submitting} className="w-full py-3.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 transition-colors disabled:opacity-60">
                {submitting ? t("contact.submitting") : t("contact.submit")}
              </button>
              <button onClick={() => { setPhase("input"); window.scrollTo(0, 0); }} className="w-full py-3 rounded-xl text-gray-700 font-medium text-sm border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                {t("contact.back")}
              </button>
            </div>
          </div>
        )}

        {phase === "input" && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{t("contact.title")}</h1>
            <p className="text-sm text-gray-500 text-center mb-6">{t("contact.subtitle")}</p>
            <hr className="mb-6" />
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">{t("contact.category")}<RequiredBadge label={t("contact.required")} /></label>
                <div className="relative">
                  <select value={category} onChange={(e) => { setCategory(e.target.value); touch("category"); }} className={`w-full sm:w-72 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white ${validCls("category", category)}`}>
                    <option value="">{t("contact.selectPlaceholder")}</option>
                    {CATEGORY_KEYS.map((key) => <option key={key} value={t(key)}>{t(key)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">{t("contact.company")}<RequiredBadge label={t("contact.required")} /></label>
                <div className="relative">
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onBlur={() => touch("companyName")} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("companyName", companyName)}`} />
                  {touched.companyName && companyName && <CheckIcon />}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">{t("contact.name")}<RequiredBadge label={t("contact.required")} /></label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input type="text" placeholder={t("contact.lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => touch("lastName")} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("lastName", lastName)}`} />
                    {touched.lastName && lastName && <CheckIcon />}
                  </div>
                  <div className="relative flex-1">
                    <input type="text" placeholder={t("contact.firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => touch("firstName")} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("firstName", firstName)}`} />
                    {touched.firstName && firstName && <CheckIcon />}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">{t("contact.email")}<RequiredBadge label={t("contact.required")} /></label>
                <div className="relative">
                  <input type="email" placeholder="info@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => touch("email")} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("email", email)}`} />
                  {touched.email && email && isEmailValid(email) && <CheckIcon />}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">{t("contact.phone")}<RequiredBadge label={t("contact.required")} /></label>
                <div className="flex items-center gap-2">
                  <input type="tel" inputMode="numeric" placeholder="090" value={phone1} onChange={(e) => setPhone1(e.target.value.replace(/\D/g, ""))} onBlur={() => touch("phone1")} className={`w-20 border rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("phone1", phone1)}`} />
                  <span className="text-gray-400">-</span>
                  <input type="tel" inputMode="numeric" placeholder="0000" value={phone2} onChange={(e) => setPhone2(e.target.value.replace(/\D/g, ""))} onBlur={() => touch("phone2")} className={`w-24 border rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("phone2", phone2)}`} />
                  <span className="text-gray-400">-</span>
                  <input type="tel" inputMode="numeric" placeholder="0000" value={phone3} onChange={(e) => setPhone3(e.target.value.replace(/\D/g, ""))} onBlur={() => touch("phone3")} className={`w-24 border rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-violet-400 ${validCls("phone3", phone3)}`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">{t("contact.content")}<RequiredBadge label={t("contact.required")} /></label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} onBlur={() => touch("content")} rows={5} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-y ${validCls("content", content)}`} />
              </div>
              <button onClick={handleConfirm} disabled={!isValid} className="w-full py-3.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 transition-colors disabled:opacity-40">
                {t("contact.toConfirm")}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-6">
        © 2026 ComiSta. All Rights Reserved.
      </footer>
    </div>
  );
}
