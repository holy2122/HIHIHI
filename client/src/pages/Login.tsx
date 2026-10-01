import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { HeartPulse, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseReady } from "@/lib/supabase";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/15";

export default function Login() {
  const { session, signIn, signUp } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [accountType, setAccountType] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (mode === "signup") {
      if (password.length < 8) return setMsg({ type: "error", text: "비밀번호는 8자 이상이어야 합니다." });
      if (accountType === "admin" && !adminCode.trim())
        return setMsg({ type: "error", text: "관리자 코드를 입력해 주세요." });
      if (!agree) return setMsg({ type: "error", text: "개인정보 수집·이용에 동의해 주세요." });
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const err = await signIn(email.trim(), password, accountType);
        if (err) setMsg({ type: "error", text: err });
      } else {
        const r = await signUp(
          email.trim(),
          password,
          name.trim(),
          accountType === "admin" ? adminCode.trim() : undefined
        );
        if (r.error) {
          setMsg({ type: "error", text: r.error });
        } else {
          // 가입 후 자동 로그인하지 않고, 로그인 화면으로 돌려보내 직접 로그인하게 합니다.
          setMode("login");
          setPassword("");
          setAdminCode("");
          setName("");
          setAgree(false);
          setMsg({
            type: "ok",
            text:
              accountType === "admin"
                ? "관리자 회원가입이 완료되었습니다. 아래에서 '관리자 로그인'으로 직접 로그인해 주세요."
                : "회원가입이 완료되었습니다. 아래에서 '이용자 로그인'으로 직접 로그인해 주세요.",
          });
        }
      }
    } catch {
      setMsg({ type: "error", text: "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="mb-6 flex items-center justify-center gap-1.5 text-teal-700">
          <HeartPulse className="h-5 w-5" />
          <span className="font-display text-xl font-extrabold">Hi <span className="text-emerald-600">Care</span></span>
        </Link>

        {!supabaseReady && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            Supabase 환경변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)가 설정되지 않았습니다.
          </p>
        )}

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-sm font-bold">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setMsg(null); }}
              className={`rounded-lg py-2 cursor-pointer ${mode === m ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"}`}
            >
              {m === "login" ? "로그인" : "회원가입"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              {([
                ["user", mode === "login" ? "이용자 로그인" : "이용자 회원가입", User],
                ["admin", mode === "login" ? "관리자 로그인" : "관리자 회원가입", ShieldCheck],
              ] as const).map(([type, label, Icon]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setAccountType(type); setMsg(null); }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 cursor-pointer ${
                    accountType === type
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
          </div>
          {mode === "signup" && (
            <input className={inputCls} placeholder="이름(닉네임)" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} required />
          )}
          <input className={inputCls} type="email" name="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <input className={inputCls} type="password" name="password" placeholder="비밀번호 (8자 이상)" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
          {mode === "signup" && accountType === "admin" && (
            <input
              className={inputCls}
              type="text"
              name="admin-signup-code"
              inputMode="numeric"
              placeholder="관리자 코드"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
              required
            />
          )}
          {mode === "signup" && (
            <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
              <span>[필수] 서비스 이용을 위한 개인정보(이메일·이름) 및 이용 활동 기록 수집·이용에 동의합니다.</span>
            </label>
          )}
          {msg && <p className={`text-xs font-semibold ${msg.type === "error" ? "text-rose-600" : "text-teal-700"}`}>{msg.text}</p>}
          <button disabled={busy || !supabaseReady} className="w-full rounded-xl bg-teal-700 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50 cursor-pointer">
            {busy ? "처리 중…" : mode === "login" ? (accountType === "admin" ? "관리자 로그인" : "이용자 로그인") : accountType === "admin" ? "관리자로 가입하기" : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
