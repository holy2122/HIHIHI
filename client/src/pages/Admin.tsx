import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth, type Profile } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/activity";

interface Log {
  id: number;
  action: string;
  condition_id: string | null;
  keyword_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  profiles: { email: string | null } | null;
}

const fmt = (s: string) => new Date(s).toLocaleString("ko-KR");

export default function Admin() {
  const { profile, loading, isAdmin } = useAuth();
  const [tab, setTab] = useState<"users" | "logs">("users");
  const [users, setUsers] = useState<Profile[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const load = useCallback(async () => {
    setFetching(true);
    const [u, l] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("id,action,condition_id,keyword_id,meta,created_at,profiles(email)")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (u.error || l.error) toast.error("데이터를 불러오지 못했습니다.");
    setUsers((u.data as Profile[]) ?? []);
    setLogs((l.data as unknown as Log[]) ?? []);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const update = async (u: Profile, patch: Partial<Pick<Profile, "role" | "status">>) => {
    const label = patch.status
      ? patch.status === "suspended" ? "이용 정지" : "정지 해제"
      : patch.role === "admin" ? "관리자 지정" : "관리자 해제";
    if (!window.confirm(`${u.email} 계정을 "${label}" 하시겠습니까?`)) return;
    setBusyId(u.id);
    const { data, error } = await supabase.from("profiles").update(patch).eq("id", u.id).select();
    if (error || !data?.length) {
      toast.error("변경에 실패했습니다. 권한을 확인해 주세요.");
    } else {
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...patch } : x)));
      toast.success(`${label} 완료`);
      logActivity(patch.status ? "admin_set_status" : "admin_set_role", { meta: { target: u.id, email: u.email, ...patch } });
    }
    setBusyId(null);
  };

  if (loading) return <div className="min-h-screen grid place-items-center text-sm text-slate-500">확인 중…</div>;
  if (!isAdmin)
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="font-bold text-slate-900">관리자만 접근할 수 있습니다.</p>
          <Link href={profile ? "/" : "/login"} className="mt-3 inline-block text-sm font-bold text-teal-700 underline">
            {profile ? "홈으로" : "로그인하기"}
          </Link>
        </div>
      </div>
    );

  const th = "px-3 py-2 text-left text-xs font-bold text-slate-500 whitespace-nowrap";
  const td = "px-3 py-2 text-xs text-slate-700 whitespace-nowrap";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" /> 사이트로
          </Link>
          <h1 className="text-sm font-extrabold text-slate-900">Hi Care 관리자</h1>
          <button onClick={load} disabled={fetching} className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 cursor-pointer disabled:opacity-50">
            <RefreshCw className={`h-3.5 w-3.5 ${fetching ? "animate-spin" : ""}`} /> 새로고침
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex gap-2">
          {([["users", `회원 (${users.length})`], ["logs", `활동 로그 (최근 ${logs.length})`]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`rounded-xl border px-3.5 py-2 text-xs font-bold cursor-pointer ${tab === id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          {tab === "users" ? (
            <table className="w-full">
              <thead className="bg-slate-50"><tr>
                <th className={th}>이메일</th><th className={th}>이름</th><th className={th}>가입일</th><th className={th}>권한</th><th className={th}>상태</th><th className={th}>관리</th>
              </tr></thead>
              <tbody>
                {users.map((u) => {
                  const self = u.id === profile?.id;
                  return (
                    <tr key={u.id} className="border-t border-slate-100">
                      <td className={td}>{u.email}</td>
                      <td className={td}>{u.name || "-"}</td>
                      <td className={td}>{fmt(u.created_at)}</td>
                      <td className={td}>{u.role === "admin" ? "관리자" : "일반"}</td>
                      <td className={`${td} font-bold ${u.status === "active" ? "text-emerald-700" : "text-rose-600"}`}>{u.status === "active" ? "정상" : "정지"}</td>
                      <td className={`${td} space-x-1.5`}>
                        <button disabled={self || busyId === u.id} onClick={() => update(u, { status: u.status === "active" ? "suspended" : "active" })} className="rounded-lg border border-slate-200 px-2 py-1 font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer">
                          {u.status === "active" ? "정지" : "해제"}
                        </button>
                        <button disabled={self || busyId === u.id} onClick={() => update(u, { role: u.role === "admin" ? "user" : "admin" })} className="rounded-lg border border-slate-200 px-2 py-1 font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer">
                          {u.role === "admin" ? "관리자 해제" : "관리자 지정"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50"><tr>
                <th className={th}>시각</th><th className={th}>회원</th><th className={th}>활동</th><th className={th}>질환</th><th className={th}>키워드</th><th className={th}>상세</th>
              </tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-t border-slate-100">
                    <td className={td}>{fmt(l.created_at)}</td>
                    <td className={td}>{l.profiles?.email ?? "(삭제됨)"}</td>
                    <td className={`${td} font-bold`}>{l.action}</td>
                    <td className={td}>{l.condition_id ?? "-"}</td>
                    <td className={td}>{l.keyword_id ?? "-"}</td>
                    <td className={`${td} max-w-[240px] truncate`}>{l.meta ? JSON.stringify(l.meta) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
