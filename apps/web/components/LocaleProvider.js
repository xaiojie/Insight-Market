"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import messages from "../lib/messages";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState("zh");

  useEffect(() => {
    const saved = window.localStorage.getItem("locale");
    if (saved) {
      setLocale(saved);
    }
  }, []);

  const value = {
    locale,
    setLocale: (next) => {
      setLocale(next);
      window.localStorage.setItem("locale", next);
    },
    t: (key) => messages[locale]?.[key] || key
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("LocaleProvider 未初始化");
  }
  return ctx;
}
