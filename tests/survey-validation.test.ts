import { describe, it, expect } from "vitest";

// Pure validation logic extracted from the API routes

function validateSurveyTitle(title: unknown): string | null {
  if (!title || typeof title !== "string" || title.trim() === "") {
    return "タイトルは必須です";
  }
  return null;
}

function validatePassword(password: unknown): string | null {
  if (!password || typeof password !== "string" || password.length < 1) {
    return "password is required";
  }
  return null;
}

function validateIndustryName(name: unknown): string | null {
  if (!name || typeof name !== "string" || (name as string).trim() === "") {
    return "業種名を入力してください";
  }
  return null;
}

function validateAgencyName(name: unknown): string | null {
  if (!name || typeof name !== "string" || (name as string).trim() === "") {
    return "name is required";
  }
  return null;
}

describe("survey validation", () => {
  it("rejects empty title", () => {
    expect(validateSurveyTitle("")).not.toBeNull();
    expect(validateSurveyTitle(null)).not.toBeNull();
    expect(validateSurveyTitle("  ")).not.toBeNull();
  });

  it("accepts valid title", () => {
    expect(validateSurveyTitle("My Survey")).toBeNull();
    expect(validateSurveyTitle("テスト店舗")).toBeNull();
  });
});

describe("password validation", () => {
  it("rejects empty or missing password", () => {
    expect(validatePassword("")).not.toBeNull();
    expect(validatePassword(null)).not.toBeNull();
    expect(validatePassword(undefined)).not.toBeNull();
  });

  it("accepts non-empty password", () => {
    expect(validatePassword("secret123")).toBeNull();
  });
});

describe("industry name validation", () => {
  it("rejects empty name", () => {
    expect(validateIndustryName("")).not.toBeNull();
    expect(validateIndustryName("  ")).not.toBeNull();
    expect(validateIndustryName(null)).not.toBeNull();
  });

  it("accepts valid industry name", () => {
    expect(validateIndustryName("飲食店")).toBeNull();
    expect(validateIndustryName("美容・サロン")).toBeNull();
  });
});

describe("agency name validation", () => {
  it("rejects empty name", () => {
    expect(validateAgencyName("")).not.toBeNull();
    expect(validateAgencyName(null)).not.toBeNull();
  });

  it("accepts valid name", () => {
    expect(validateAgencyName("コネスト")).toBeNull();
  });
});
