import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseReady } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  status: "active" | "suspended";
  created_at: string;
}

interface AuthValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    adminCode?: string
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string, as?: "user" | "admin") => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

function toKorean(message: string) {
  if (/invalid login/i.test(message)) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (/already registered|already exists/i.test(message)) return "이미 가입된 이메일입니다.";
  if (/not confirmed/i.test(message))
    return "아직 이메일 인증이 안 된 계정입니다. 관리자가 schema.sql을 다시 실행하면 해결됩니다. (또는 Supabase 'Confirm email' 설정 OFF 확인)";
  if (/database error saving new user/i.test(message)) return "회원가입 처리 중 오류가 발생했습니다. 입력 내용을 확인해 주세요.";
  if (/at least \d+ characters|weak password|password should/i.test(message)) return "비밀번호는 8자 이상이어야 합니다.";
  if (/rate limit|too many/i.test(message)) return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  if (/invalid.*email|unable to validate email/i.test(message)) return "이메일 형식이 올바르지 않습니다.";
  if (/failed to fetch|network|load failed/i.test(message)) return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
  if (/refresh token/i.test(message)) return "로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(supabaseReady);
  // 로그인 직후 역할(이용자/관리자) 검증이 끝나기 전에는 세션을 화면에 반영하지 않기 위한 플래그
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!supabaseReady) return;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        if (!data.session) setLoading(false);
      })
      .catch(async () => {
        // 만료/손상된 토큰 때문에 멈추는 것을 방지: 로컬 세션을 지우고 로그인 화면으로
        await supabase.auth.signOut({ scope: "local" }).catch(() => {});
        setSession(null);
        setLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (verifyingRef.current) return;
      setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!supabaseReady) return;
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const p = data as Profile | null;
        if (p?.status === "suspended") {
          supabase.auth.signOut();
          setProfile(null);
        } else {
          setProfile(p);
        }
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false); // 어떤 경우에도 "확인 중…" 화면에 갇히지 않게
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signUp: AuthValue["signUp"] = async (email, password, name, adminCode) => {
    // 가입이 끝나도 자동으로 로그인 상태가 되지 않도록, 가입 중 발생하는 세션 이벤트는 화면에 반영하지 않습니다.
    verifyingRef.current = true;
    try {
      // 관리자 코드는 서버(DB 트리거)에서 검증합니다. 브라우저 코드에는 정답 코드가 없습니다.
      const meta: Record<string, string> = { name };
      if (adminCode) meta.admin_code = adminCode;

      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta } });
      if (error) {
        if (adminCode && /database error saving new user/i.test(error.message)) {
          return { error: "관리자 코드가 올바르지 않습니다." };
        }
        return { error: toKorean(error.message) };
      }
      if (!data.session) {
        // 세션이 없다 = 이미 가입된 이메일이거나, Supabase 'Confirm email' 설정이 켜져 있음
        return {
          error:
            "가입을 완료하지 못했습니다. 이미 가입된 이메일이거나 Supabase의 'Confirm email' 설정이 켜져 있습니다.",
        };
      }
      await logActivity("signup", { meta: { role: adminCode ? "admin" : "user" } });
      // 가입 직후 세션은 버리고, 사용자가 로그인 화면에서 직접 로그인하게 합니다.
      await supabase.auth.signOut();
      return { error: null };
    } catch (e) {
      return { error: toKorean(e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다.") };
    } finally {
      verifyingRef.current = false;
    }
  };

  const signIn: AuthValue["signIn"] = async (email, password, as = "user") => {
    verifyingRef.current = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return toKorean(error.message);

      const { data: p, error: profileError } = await supabase
        .from("profiles")
        .select("role,status")
        .eq("id", data.user.id)
        .maybeSingle();

      const reject = async (text: string) => {
        await supabase.auth.signOut();
        return text;
      };

      if (profileError) {
        return await reject(`계정 정보를 불러오지 못했습니다. (${profileError.message})`);
      }
      if (!p) {
        return await reject(
          "로그인은 되었지만 회원 정보(profiles)가 없습니다. Supabase SQL Editor에서 최신 schema.sql을 다시 Run 한 뒤 시도해 주세요."
        );
      }
      if (p.status === "suspended") {
        return await reject("이용이 정지된 계정입니다. 관리자에게 문의해 주세요.");
      }
      if (as === "admin" && p.role !== "admin") {
        return await reject(
          "이 계정은 관리자 권한이 없는 '이용자' 계정입니다. '이용자 로그인'을 이용하거나, 관리자 회원가입 시 입력한 코드가 서버에 적용됐는지 확인해 주세요."
        );
      }
      if (as === "user" && p.role === "admin") {
        return await reject("관리자 계정입니다. '관리자 로그인'을 선택해 로그인해 주세요.");
      }

      // 검증 통과 → 이제 세션을 화면에 반영
      const { data: s } = await supabase.auth.getSession();
      setSession(s.session);
      logActivity("login", { meta: { as } });
      return null;
    } catch (e) {
      return toKorean(e instanceof Error ? e.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      verifyingRef.current = false;
    }
  };

  const signOut = async () => {
    await logActivity("logout");
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === "admin" && profile.status === "active";

  return (
    <AuthContext.Provider value={{ session, profile, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
