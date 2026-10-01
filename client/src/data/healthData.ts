import { supabase } from "../lib/supabase";

export interface ActionGuideStep {
  title: string;
  desc: string;
  metric?: string;
}

export interface MedicalEvidence {
  paperTitle: string;
  journal: string;
  year: number;
  authors: string;
  coreSummary: string;
  sourceUrl: string;
  evidenceGrade: string;
  sampleSizeOrMethod?: string;
}

/** time("11:09") 또는 seconds(669) 중 하나만 적어도 됩니다. 나머지는 화면에서 자동 계산됩니다. */
export interface VideoTimelineItem {
  label: string;
  time?: string;
  seconds?: number;
}

export interface VideoGuide {
  title: string;
  channel: string;
  youtubeId: string;
  startSeconds?: number;
  duration: string;
  summary: string;
  difficulty: "초급" | "중급" | "고급";
  targetTimePerDay: string;
  keyPoints?: string[];
  timeline?: VideoTimelineItem[];
}

export interface HealthKeywordTopic {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  shortActionSummary: string;
  actionSteps: ActionGuideStep[];
  keyRules: string[];
  evidence: MedicalEvidence;
  video: VideoGuide;
  additionalVideos?: VideoGuide[];
}

export interface HealthCondition {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  badge: string;
  normalRangeLabel: string;
  observationThreshold: string;
  urgency: "관리필요" | "주의요망" | "적극개선";
  colorTone: {
    primary: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
  };
  keywords: HealthKeywordTopic[];
}

export async function loadHealthConditions(signal?: AbortSignal): Promise<HealthCondition[]> {
  let query = supabase.from("health_content").select("data").eq("id", "main");
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle();

  if (signal?.aborted) throw new DOMException("aborted", "AbortError");
  if (error) throw new Error(`건강관리 데이터 로딩 실패: ${error.message}`);
  if (!data) throw new Error("콘텐츠가 아직 등록되지 않았거나 접근 권한이 없습니다.");

  const list: unknown = data.data;
  if (!Array.isArray(list) || list.length !== 8) {
    throw new Error("건강관리 콘텐츠는 8개의 질환 데이터를 포함해야 합니다.");
  }
  return list as HealthCondition[];
}
