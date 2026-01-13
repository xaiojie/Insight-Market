import "../styles/globals.css";
import Link from "next/link";
import { LocaleProvider, useLocale } from "../components/LocaleProvider";

function Navbar() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
      <div className="flex gap-4 text-sm">
        <Link href="/" className="hover:text-emerald-400">
          {t("navHome")}
        </Link>
        <Link href="/portfolio" className="hover:text-emerald-400">
          {t("navPortfolio")}
        </Link>
        <Link href="/leaderboard" className="hover:text-emerald-400">
          {t("navLeaderboard")}
        </Link>
        <Link href="/admin" className="hover:text-emerald-400">
          {t("navAdmin")}
        </Link>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/login" className="hover:text-emerald-400">
          {t("login")}
        </Link>
        <Link href="/register" className="hover:text-emerald-400">
          {t("register")}
        </Link>
        <Link href="/settings" className="hover:text-emerald-400">
          {t("settings")}
        </Link>
        <button
          className="rounded border border-slate-700 px-2 py-1"
          onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
        >
          {locale === "zh" ? "EN" : "中文"}
        </button>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <LocaleProvider>
          <Navbar />
          <main className="px-6 py-6">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
