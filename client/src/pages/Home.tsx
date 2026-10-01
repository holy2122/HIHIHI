import React, { useEffect, useMemo, useState } from "react";
import { HealthCondition, HealthKeywordTopic, loadHealthConditions } from "../data/healthData";
import { Navbar } from "../components/Navbar";
import { logActivity } from "../lib/activity";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { ConditionCard } from "../components/ConditionCard";
import { KeywordTagBar } from "../components/KeywordTagBar";
import { KeywordDetailView } from "../components/KeywordDetailView";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Search,
  ShieldCheck,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "ALL", label: "전체" },
  { id: "심뇌혈관", label: "심뇌혈관" },
  { id: "내분비", label: "내분비·대사" },
  { id: "소화기", label: "소화기" },
  { id: "신장", label: "신장" },
  { id: "호흡기", label: "호흡기" },
];

function ListView({
  conditions,
  onSelectCondition,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
}: {
  conditions: HealthCondition[];
  onSelectCondition: (condition: HealthCondition) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}) {
  const filteredConditions = useMemo(() => {
    return conditions.filter((item) => {
      const matchCategory = categoryFilter === "ALL" || item.category.includes(categoryFilter);
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCategory;
      const matchesSearch = [
        item.name,
        item.shortDesc,
        ...item.keywords.flatMap((keyword) => [keyword.tag, keyword.title]),
      ].some((value) => value.toLowerCase().includes(q));
      return matchCategory && matchesSearch;
    });
  }, [categoryFilter, conditions, searchQuery]);

  // 검색어 입력이 멈추고 1.2초 뒤 한 번만 기록
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    const t = window.setTimeout(() => logActivity("search", { meta: { q: q.slice(0, 100) } }), 1200);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  return (
    <>
      <Navbar
        onReset={() => {
          setSearchQuery("");
          setCategoryFilter("ALL");
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedConditionId={null}
      />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        <section className="mx-auto mb-9 max-w-4xl text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-bold text-teal-800 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            질환별 맞춤 건강관리
          </div>
          <h1 className="font-display mb-4 text-3xl font-light leading-[1.45] tracking-tight text-slate-800 sm:text-5xl">
            <span>나의 </span><span className="font-light text-blue-900">질환</span><span>을 선택하고</span>
            <br />
            <span className="font-bold">찾아가는 </span><span className="font-bold text-teal-600">나만의 </span><span className="font-bold text-emerald-600">건강습관</span>
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            질환을 선택하면 해당 질환의 기준 설명과 생활관리 키워드, 근거 기반 가이드가 한 화면에 순서대로 열립니다.
          </p>
        </section>

        <section aria-labelledby="condition-list-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <h2 id="condition-list-title" className="text-xl font-bold text-slate-900">질환 목록</h2>
            </div>
            <div className="relative md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="질환 또는 관리법 검색"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/15"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  categoryFilter === tab.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredConditions.map((condition) => (
              <div key={condition.id} id={`condition-card-${condition.id}`}>
                <ConditionCard
                  condition={condition}
                  isSelected={false}
                  onSelect={onSelectCondition}
                />
              </div>
            ))}
          </div>

          {filteredConditions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Info className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-slate-700">검색 결과가 없습니다.</p>
              <button onClick={() => setSearchQuery("")} className="mt-3 text-sm font-bold text-teal-700 underline cursor-pointer">검색 초기화</button>
            </div>
          )}
        </section>
      </main>
      <footer className="mt-auto border-t border-slate-200 bg-white/80 px-4 py-7 text-center text-[11px] leading-relaxed text-slate-400">
        본 서비스는 건강검진 사후관리를 돕기 위한 보조 프로토타입이며, 실제 진단과 치료는 의료진 상담을 통해 결정해야 합니다.
      </footer>
    </>
  );
}

function ConditionDetailView({
  condition,
  onBack,
  onReturnToViewedCondition,
}: {
  condition: HealthCondition;
  onBack: () => void;
  onReturnToViewedCondition: () => void;
}) {
  const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedKeywordId(null);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [condition.id]);

  const selectedKeyword = useMemo<HealthKeywordTopic | null>(() => {
    if (!selectedKeywordId) return null;
    return condition.keywords.find((keyword) => keyword.id === selectedKeywordId) || null;
  }, [condition, selectedKeywordId]);

  const handleSelectKeyword = (keyword: HealthKeywordTopic) => {
    setSelectedKeywordId(keyword.id);
    window.setTimeout(() => document.getElementById("final-guide")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <button onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-teal-700 cursor-pointer" aria-label="전체 질환 목록으로 돌아가기">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">전체 질환 보기</span>
            <span className="sm:hidden">목록</span>
          </button>
          <div className="flex items-center gap-2 text-right">
            <Activity className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-extrabold text-slate-900">{condition.name} 관리</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={onBack} className="text-teal-700 hover:underline cursor-pointer">8대 질환</button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{condition.name}</span>
        </div>

        {/* Disease criteria */}
        <section className="medical-criteria-card mb-6 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-sm font-extrabold text-white">01</span>
            <h1 className="text-xl font-extrabold sm:text-2xl">{condition.name} 기준 설명</h1>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{condition.shortDesc}</p>
          {condition.id === "hypertension" && (
            <div className="mt-5 overflow-hidden rounded-xl border-2 border-teal-500 bg-white">
              <div className="border-b border-teal-100 bg-teal-50 px-4 py-3">
                <h2 className="text-sm font-extrabold text-teal-900 sm:text-base">2026 고혈압 진단 기준</h2>
                <p className="mt-1 text-xs text-slate-600">수축기·이완기 혈압 측정값 비교</p>
              </div>
              <div>
                <table className="compact-medical-table hypertension-criteria-table w-full table-fixed border-collapse text-left text-[11px] sm:text-xs">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="w-[30%] px-1.5 py-2.5 font-bold sm:px-2">구분</th>
                      <th className="w-[35%] px-1.5 py-2.5 font-bold sm:px-2">수축기 혈압</th>
                      <th className="w-[35%] px-1.5 py-2.5 font-bold sm:px-2">이완기 혈압</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200"><th className="px-1.5 py-2.5 font-bold text-emerald-700 sm:px-2">정상</th><td className="px-1.5 py-2.5 sm:px-2">120 미만</td><td className="px-1.5 py-2.5 sm:px-2">80 미만</td></tr>
                    <tr className="border-t border-slate-200"><th className="px-1.5 py-2.5 font-bold text-sky-700 sm:px-2">주의</th><td className="px-1.5 py-2.5 sm:px-2">120~129</td><td className="px-1.5 py-2.5 sm:px-2">80 미만</td></tr>
                    <tr className="border-t border-slate-200"><th className="px-1.5 py-2.5 font-bold text-amber-700 sm:px-2">고혈압전단계</th><td className="px-1.5 py-2.5 sm:px-2">130~139</td><td className="px-1.5 py-2.5 sm:px-2">80~89</td></tr>
                    <tr className="border-t border-teal-200 bg-teal-50"><th className="px-1.5 py-2.5 font-bold text-teal-800 sm:px-2">이완기 단독 고혈압</th><td className="px-1.5 py-2.5 sm:px-2">140 미만</td><td className="px-1.5 py-2.5 sm:px-2">90 이상</td></tr>
                    <tr className="border-t border-slate-200"><th className="px-1.5 py-2.5 font-bold text-orange-700 sm:px-2">1기 고혈압</th><td className="px-1.5 py-2.5 sm:px-2">140~159</td><td className="px-1.5 py-2.5 sm:px-2">90~99</td></tr>
                    <tr className="border-t border-slate-200"><th className="px-1.5 py-2.5 font-bold text-red-700 sm:px-2">2기 고혈압</th><td className="px-1.5 py-2.5 sm:px-2">160 이상</td><td className="px-1.5 py-2.5 sm:px-2">100 이상</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {condition.id === "diabetes" && (
            <div className="mt-5 overflow-hidden rounded-xl border-2 border-emerald-400 bg-white">
              <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3">
                <h2 className="text-sm font-extrabold text-emerald-900 sm:text-base">당뇨병 기준 수치 요약</h2>
                <p className="mt-1 text-xs text-slate-600">공복·식후 2시간 혈당 및 당화혈색소 비교</p>
              </div>
              <table className="compact-medical-table diabetes-criteria-table w-full table-fixed border-collapse leading-tight">
                <thead className="bg-slate-50 text-slate-600">
                  <tr><th className="w-[38%] px-1 py-2 text-left font-bold whitespace-nowrap">검사 항목</th><th className="w-[35%] px-1 py-2 text-left font-bold whitespace-nowrap">수치</th><th className="w-[27%] px-1 py-2 text-left font-bold whitespace-nowrap">진단 결과</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200"><th rowSpan={3} className="px-1 py-2 text-left align-top font-bold text-slate-800 whitespace-nowrap">공복혈당<br /><span className="font-normal text-[8px] text-slate-500 whitespace-nowrap">(8시간 이상 공복)</span></th><td className="px-1 py-2 whitespace-nowrap">100 mg/dL 미만</td><td className="px-1 py-2 font-semibold text-emerald-700 whitespace-nowrap">정상</td></tr>
                  <tr className="border-t border-slate-100 bg-amber-50/60"><td className="px-1 py-2 whitespace-nowrap">100~125 mg/dL</td><td className="px-1 py-2 font-semibold text-amber-700 whitespace-nowrap">당뇨병 전단계</td></tr>
                  <tr className="border-t border-slate-100 bg-rose-50/60"><td className="px-1 py-2 whitespace-nowrap">126 mg/dL 이상</td><td className="px-1 py-2 font-semibold text-rose-700 whitespace-nowrap">당뇨병</td></tr>
                  <tr className="border-t-2 border-slate-200"><th rowSpan={3} className="px-1 py-2 text-left align-top font-bold text-slate-800 whitespace-nowrap">식후 2시간 혈당<br /><span className="font-normal text-[8px] text-slate-500 whitespace-nowrap">(포도당 부하 2시간 후)</span></th><td className="px-1 py-2 whitespace-nowrap">140 mg/dL 미만</td><td className="px-1 py-2 font-semibold text-emerald-700 whitespace-nowrap">정상</td></tr>
                  <tr className="border-t border-slate-100 bg-amber-50/60"><td className="px-1 py-2 whitespace-nowrap">140~199 mg/dL</td><td className="px-1 py-2 font-semibold text-amber-700 whitespace-nowrap">당뇨병 전단계</td></tr>
                  <tr className="border-t border-slate-100 bg-rose-50/60"><td className="px-1 py-2 whitespace-nowrap">200 mg/dL 이상</td><td className="px-1 py-2 font-semibold text-rose-700 whitespace-nowrap">당뇨병</td></tr>
                  <tr className="border-t-2 border-slate-200"><th rowSpan={3} className="px-1 py-2 text-left align-top font-bold text-slate-800 whitespace-nowrap">당화혈색소<br /><span className="font-normal text-[8px] text-slate-500 whitespace-nowrap">(HbA1c)</span></th><td className="px-1 py-2 whitespace-nowrap">5.6% 이하</td><td className="px-1 py-2 font-semibold text-emerald-700 whitespace-nowrap">정상</td></tr>
                  <tr className="border-t border-slate-100 bg-amber-50/60"><td className="px-1 py-2 whitespace-nowrap">5.7~6.4%</td><td className="px-1 py-2 font-semibold text-amber-700 whitespace-nowrap">당뇨병 전단계</td></tr>
                  <tr className="border-t border-slate-100 bg-rose-50/60"><td className="px-1 py-2 whitespace-nowrap">6.5% 이상</td><td className="px-1 py-2 font-semibold text-rose-700 whitespace-nowrap">당뇨병</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {condition.id === "dyslipidemia" && (
            <div className="mt-5 rounded-xl border-2 border-sky-400 bg-white p-3 sm:p-4">
              <div className="mb-4 border-b border-sky-100 bg-sky-50 px-4 py-3">
                <h2 className="text-sm font-extrabold text-sky-900 sm:text-base">이상지질혈증 수치 분류</h2>
                <p className="mt-1 text-xs text-slate-600">2022년 한국지질·동맥경화학회 지침 기준</p>
              </div>
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">LDL 콜레스테롤</h3>
                  <table className="compact-medical-table w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><th className="px-2 py-2 text-left font-bold text-emerald-700">적정</th><td className="px-2 py-2">100 mg/dL 미만</td></tr>
                      <tr className="border-t bg-sky-50/40"><th className="px-2 py-2 text-left font-bold text-sky-700">정상</th><td className="px-2 py-2">100~129 mg/dL</td></tr>
                      <tr className="border-t bg-amber-50/60"><th className="px-2 py-2 text-left font-bold text-amber-700">경계</th><td className="px-2 py-2">130~159 mg/dL</td></tr>
                      <tr className="border-t bg-orange-50/60"><th className="px-2 py-2 text-left font-bold text-orange-700">높음</th><td className="px-2 py-2">160~189 mg/dL</td></tr>
                      <tr className="border-t bg-rose-50/60"><th className="px-2 py-2 text-left font-bold text-rose-700">매우 높음</th><td className="px-2 py-2">190 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">총콜레스테롤</h3>
                  <table className="compact-medical-table w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><th className="px-2 py-2 text-left font-bold text-emerald-700">적정</th><td className="px-2 py-2">200 mg/dL 미만</td></tr>
                      <tr className="border-t bg-amber-50/60"><th className="px-2 py-2 text-left font-bold text-amber-700">경계</th><td className="px-2 py-2">200~239 mg/dL</td></tr>
                      <tr className="border-t bg-orange-50/60"><th className="px-2 py-2 text-left font-bold text-orange-700">높음</th><td className="px-2 py-2">240 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">중성지방 (TG)</h3>
                  <table className="compact-medical-table w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><th className="px-2 py-2 text-left font-bold text-emerald-700">적정</th><td className="px-2 py-2">150 mg/dL 미만</td></tr>
                      <tr className="border-t bg-amber-50/60"><th className="px-2 py-2 text-left font-bold text-amber-700">경계</th><td className="px-2 py-2">150~199 mg/dL</td></tr>
                      <tr className="border-t bg-orange-50/60"><th className="px-2 py-2 text-left font-bold text-orange-700">높음</th><td className="px-2 py-2">200~499 mg/dL</td></tr>
                      <tr className="border-t bg-rose-50/60"><th className="px-2 py-2 text-left font-bold text-rose-700">매우 높음</th><td className="px-2 py-2">500 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">HDL 콜레스테롤</h3>
                  <table className="compact-medical-table w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t bg-rose-50/60"><th className="px-2 py-2 text-left font-bold text-rose-700">낮음</th><td className="px-2 py-2">40 mg/dL 미만</td></tr>
                      <tr className="border-t bg-emerald-50/60"><th className="px-2 py-2 text-left font-bold text-emerald-700">높음</th><td className="px-2 py-2">60 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-4 border-t border-sky-100 bg-sky-50/50 px-3 py-3 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                ※ 모든 수치는 공복 상태 기준이며, 초고위험군·고위험군 등 개인의 심혈관 질환 위험도에 따라 치료 목표치는 달라질 수 있습니다.
              </p>
            </div>
          )}
        </section>

        {/* Keyword selection */}
        <section className="mb-3 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" id="keyword-section">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-extrabold text-white">02</div>
            <h2 className="text-xl font-extrabold text-slate-900">나의 상태별 건강관리</h2>
          </div>
          <KeywordTagBar
            condition={condition}
            selectedKeywordId={selectedKeywordId}
            onSelectKeyword={handleSelectKeyword}
            onResetCondition={onBack}
          />
        </section>

        {/* Final guide only after keyword selection */}
        <section id="final-guide" className="scroll-mt-20">
          {selectedKeyword ? (
            <>
              <KeywordDetailView
                condition={condition}
                keyword={selectedKeyword}
                onReturnToViewedCondition={onReturnToViewedCondition}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center sm:p-5">
              <CheckCircle2 className="mx-auto mb-1 h-7 w-7 text-teal-500" />
              <h3 className="mb-0.5 font-bold text-slate-900">키워드를 선택하면 상세 가이드가 열립니다</h3>
              <p className="text-sm text-slate-500">행동 가이드, 의학적 근거, 유튜브 영상이 선택한 주제에 맞춰 표시됩니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  const { session, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const userId = session?.user.id;
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<HealthCondition | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    const controller = new AbortController();
    loadHealthConditions(controller.signal)
      .then((data) => {
        setConditions(data);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(error instanceof Error ? error.message : "건강관리 데이터를 불러오지 못했습니다.");
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [authLoading, userId, navigate]);

  useEffect(() => {
    const conditionId = new URLSearchParams(window.location.search).get("condition");
    if (conditionId && conditions.length > 0) {
      const matchingCondition = conditions.find((condition) => condition.id === conditionId);
      if (matchingCondition) setSelectedCondition(matchingCondition);
    }
  }, [conditions]);

  const handleReturnToInitialList = () => {
    setSelectedCondition(null);
    setSearchQuery("");
    setCategoryFilter("ALL");
    window.history.replaceState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handleReturnToViewedCondition = () => {
    const conditionId = selectedCondition?.id;
    setSelectedCondition(null);
    setSearchQuery("");
    setCategoryFilter("ALL");
    window.history.replaceState({}, "", window.location.pathname);
    window.setTimeout(() => {
      if (!conditionId) return;
      document.getElementById(`condition-card-${conditionId}`)?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "nearest",
      });
    }, 0);
  };

  if (authLoading || !userId) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 text-sm font-semibold text-slate-600">로그인 상태를 확인하는 중입니다…</div>;
  }

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 text-sm font-semibold text-slate-600">건강관리 데이터를 불러오는 중입니다…</div>;
  }

  if (loadError) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 px-6 text-center"><div><p className="font-bold text-slate-900">데이터를 불러오지 못했습니다.</p><p className="mt-2 text-sm text-slate-500">{loadError}</p><button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white cursor-pointer">다시 시도</button></div></div>;
  }

  if (selectedCondition) {
    return (
      <ConditionDetailView
        condition={selectedCondition}
        onBack={handleReturnToInitialList}
        onReturnToViewedCondition={handleReturnToViewedCondition}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 gradient-mesh">
      <ListView
        conditions={conditions}
        onSelectCondition={(c) => {
          setSelectedCondition(c);
          logActivity("view_condition", { conditionId: c.id });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
    </div>
  );
}
