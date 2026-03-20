"use client";

import { createContext, useContext } from "react";

export type ConsentStatus = "pending" | "accepted" | "rejected";

const STORAGE_KEY = "rk_cookie_consent";

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "accepted" || stored === "rejected") return stored;
  return "pending";
}

export function setConsent(status: "accepted" | "rejected") {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, status);
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "accepted";
}

export const ConsentContext = createContext<{
  consent: ConsentStatus;
  accept: () => void;
  reject: () => void;
}>({
  consent: "pending",
  accept: () => {},
  reject: () => {},
});

export function useConsent() {
  return useContext(ConsentContext);
}
