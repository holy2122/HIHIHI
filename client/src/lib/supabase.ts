import { createClient } from "@supabase/supabase-js";

// Publishable key(sb_publishable_...)는 브라우저에 공개되도록 설계된 키입니다.
// 환경변수가 있으면 그것을 쓰고, 없으면 아래 기본값을 씁니다.
// ⚠️ sb_secret_... / service_role 키는 절대 여기나 GitHub에 넣지 마세요.
const DEFAULT_URL = "https://qgszvmlrqcafrgenusdj.supabase.co";
const DEFAULT_KEY = "sb_publishable_OpH1whU4L8sgPMo-2LrZww_C9ic0pXr";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_KEY;

export const supabaseReady = Boolean(url && key);
export const supabase = createClient(url, key);
