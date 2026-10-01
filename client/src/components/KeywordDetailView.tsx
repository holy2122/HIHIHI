import React, { useEffect, useState } from "react";
import { HealthCondition, HealthKeywordTopic } from "../data/healthData";
import {
  Compass,
  FileText,
  PlayCircle,
  ExternalLink,
  Check,
  AlertCircle,
  Share2,
  Bookmark,
  Printer,
  ShieldCheck,
  Award,
  Video,
  Flame,
  ArrowRight,
  Dumbbell,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "../lib/activity";
import { VideoBlock } from "./VideoBlock";

interface KeywordDetailViewProps {
  condition: HealthCondition;
  keyword: HealthKeywordTopic;
  onReturnToViewedCondition: () => void;
}

export const KeywordDetailView: React.FC<KeywordDetailViewProps> = ({
  condition,
  keyword,
  onReturnToViewedCondition,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    logActivity("view_keyword", { conditionId: condition.id, keywordId: keyword.id });
  }, [condition.id, keyword.id]);

  const toggleStep = (idx: number) => {
    logActivity("step_check", { conditionId: condition.id, keywordId: keyword.id, meta: { idx, done: !completedSteps.includes(idx) } });
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("가이드 링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    logActivity("bookmark", { conditionId: condition.id, keywordId: keyword.id, meta: { on: !isBookmarked } });
    toast(isBookmarked ? "북마크가 해제되었습니다." : "가이드가 보관함에 저장되었습니다.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 animate-in fade-in-50 duration-300 pb-16">
      {/* Detail Page Breadcrumb & Header Title */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60">
              {condition.name}
            </span>
            <span>&gt;</span>
            <span className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
              {keyword.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                isBookmarked
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="북마크"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
              <span className="hidden sm:inline">{isBookmarked ? "저장됨" : "저장"}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition cursor-pointer"
              title="공유"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">공유</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition cursor-pointer"
              title="인쇄"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">인쇄</span>
            </button>
          </div>
        </div>

        <h1 className="whitespace-pre-line text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {keyword.title}
        </h1>
        <p className="text-center text-base text-slate-600 font-medium leading-relaxed">
          {keyword.subtitle}
        </p>
      </div>

      {/* ======================================================== */}
      {/* 1. 영상 시청 및 따라 하기 (항상 맨 위) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-teal-800 via-cyan-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Video className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">시청하고 직접 따라하기</h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
            <PlayCircle className="w-3.5 h-3.5 text-teal-300" />
            <span>플레이어 임베드</span>
          </span>
        </div>

        <div className="p-4 sm:p-8 space-y-8">
          <VideoBlock video={keyword.video} summaryTitle="영상 시청 포인트 & 홈트 요약" />

          {keyword.additionalVideos?.map((video) => (
            <div key={video.youtubeId} className="border-t border-slate-200 pt-6">
              <VideoBlock video={video} summaryTitle="추가 영상 안내" showKeyPoints />
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 실천 수칙 및 한 줄 요약 */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl border-2 border-teal-500/80 shadow-md shadow-teal-500/5 overflow-hidden transition-all">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Compass className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">실천 수칙 및 한 줄 요약</h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
            오늘부터 바로 실천
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Highlight Callout Box: Short intuitive summary */}
          <div className="p-4 sm:p-5 rounded-xl bg-teal-50/70 border-l-4 border-teal-600 text-slate-800">
            <div className="flex items-start gap-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-teal-800 mb-1">
                  한 줄 핵심 실천 요약
                </h4>
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  "{keyword.shortActionSummary}"
                </p>
              </div>
            </div>
          </div>

          {/* Action Steps Interactive Checklist */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              <span>단계별 세부 실천 순서</span>
              <span className="mt-1 block text-xs font-normal text-slate-500">
                완료한 항목을 클릭해 체크해보세요 ({completedSteps.length}/{keyword.actionSteps.length})
              </span>
            </h4>

            <div className="grid gap-3 sm:grid-cols-1">
              {keyword.actionSteps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isDone
                        ? "bg-slate-50 border-teal-300 text-slate-400"
                        : "bg-white border-slate-200/90 hover:border-teal-400 hover:shadow-xs"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                        isDone
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "border-slate-300 text-transparent group-hover:border-teal-500"
                      }`}
                    >
                      {isDone && <Check className="w-4 h-4" strokeWidth={3} />}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span
                          className="font-bold text-base sm:text-lg text-slate-900"
                        >
                          {step.title}
                        </span>
                        {step.metric && (
                          <span className="px-2 py-0.5 rounded-md text-sm font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/60">
                            {step.metric}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm sm:text-base leading-relaxed text-slate-600"
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Safety Rules */}
          {keyword.keyRules && keyword.keyRules.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-sm sm:text-base">
              <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>안전 주의사항</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-900/90">
                {keyword.keyRules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 학술 논문 및 근거 */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">학술 논문 및 근거</h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>근거중심의학 (EBM)</span>
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {/* Paper Meta Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {keyword.evidence.journal} ({keyword.evidence.year})
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                {keyword.evidence.evidenceGrade}
              </span>
              {keyword.evidence.sampleSizeOrMethod && (
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-200 text-slate-700">
                  {keyword.evidence.sampleSizeOrMethod}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1">
              {keyword.evidence.paperTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              저자: {keyword.evidence.authors}
            </p>

            {/* Core Summary Callout */}
            <div className="p-3 rounded-lg bg-white border border-blue-200/70 text-slate-800 shadow-2xs">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>논문 핵심 요약문 (Clinical Findings)</span>
              </h4>
              <p className="text-sm leading-relaxed text-slate-700">
                {keyword.evidence.coreSummary}
              </p>
            </div>
          </div>

          {/* Hyperlink Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="text-xs text-slate-500">
              * 학술 출처는 PubMed, NEJM, Lancet, 대한의학회 공인 학술지 등 공신력 있는 임상 데이터를 기준으로 추출되었습니다.
            </div>

            <a
              href={keyword.evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <span>원문 논문 및 학술 출처 확인</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="flex justify-center">
        <button
          onClick={onReturnToViewedCondition}
          className="inline-flex items-center gap-2 rounded-xl border border-teal-300 bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-sm transition hover:border-teal-500 hover:bg-teal-50 cursor-pointer"
        >
          다른 질환 선택하기
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Completion & Next Action Banner */}
      <div className="-mt-2 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 rounded-2xl border border-teal-200 p-4 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-full">
          <h4 className="text-sm sm:text-base font-bold text-slate-900">
            오늘의 {keyword.tag} 가이드 확인했나요?
          </h4>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            꾸준한 4주간의 생활습관 개선으로<br />
            Body Up! 건강 Up!
          </p>
        </div>
        <button
          onClick={() => {
            setShowCompletionModal(true);
            toast.success("건강관리 실천 다이어리에 기록되었습니다.");
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer shrink-0 transition-transform hover:scale-[1.02]"
        >
          <span>오늘 실천 완료 체크</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showCompletionModal && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="completion-title">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-teal-200 bg-white p-6 text-center shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button onClick={() => setShowCompletionModal(false)} className="absolute right-3 top-3 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer" aria-label="팝업 닫기"><X className="h-5 w-5" /></button>
            <div className="mb-3 flex justify-center gap-1.5" aria-label={`완료한 실천 ${completedSteps.length}개`}>
              {keyword.actionSteps.map((_, index) => (
                <span key={index} className={`grid h-10 w-10 place-items-center rounded-full border-2 text-lg transition-all duration-300 ${completedSteps.includes(index) ? "scale-110 border-amber-400 bg-amber-100 animate-bounce" : "border-slate-200 bg-slate-50 grayscale opacity-40"}`}>🏅</span>
              ))}
            </div>
            {completedSteps.length === keyword.actionSteps.length ? (
              <>
                <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-700 animate-pulse"><Dumbbell className="h-10 w-10" /></div>
                <h2 id="completion-title" className="text-lg font-extrabold leading-relaxed text-slate-900">오늘도 정말 고생 많으셨어요! 👏<br />꾸준한 노력이 건강한 내일을 만듭니다! 💪</h2>
                <p className="mt-3 text-base font-extrabold text-teal-700">🎉 나의 건강관리 Level Up 완료! 🎉</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-500"><span className="text-3xl">👏</span></div>
                <h2 id="completion-title" className="text-lg font-extrabold text-slate-900">참 잘했어요!</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">오늘 {completedSteps.length}개 항목을 완료했어요. 남은 실천도 천천히 이어가 보세요.</p>
              </>
            )}
            <button onClick={() => setShowCompletionModal(false)} className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 cursor-pointer">확인</button>
          </div>
        </div>
      )}
    </div>
  );
};
