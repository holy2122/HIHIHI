import { supabase, supabaseReady } from "./supabase";

interface ActivityData {
  conditionId?: string;
  keywordId?: string;
  meta?: Record<string, unknown>;
}

/** 로그인한 사용자의 활동을 DB에 저장. 비로그인이면 저장하지 않고, 실패해도 화면은 막지 않음. */
export async function logActivity(action: string, data: ActivityData = {}) {
  if (!supabaseReady) return;
  try {
    const { data: s } = await supabase.auth.getSession();
    const uid = s.session?.user.id;
    if (!uid) return;
    await supabase.from("activity_logs").insert({
      user_id: uid,
      action,
      condition_id: data.conditionId ?? null,
      keyword_id: data.keywordId ?? null,
      meta: data.meta ?? null,
    });
  } catch {
    /* ignore */
  }
}
