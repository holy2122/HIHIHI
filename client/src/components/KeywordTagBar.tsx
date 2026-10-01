import React from "react";
import { HealthCondition, HealthKeywordTopic } from "../data/healthData";
import { Tag, Sparkles, CheckCircle2 } from "lucide-react";

interface KeywordTagBarProps {
  condition: HealthCondition;
  selectedKeywordId: string | null;
  onSelectKeyword: (kw: HealthKeywordTopic) => void;
  onResetCondition: () => void;
}

export const KeywordTagBar: React.FC<KeywordTagBarProps> = ({
  condition,
  selectedKeywordId,
  onSelectKeyword,
  onResetCondition,
}) => {
  return (
    <div className="mb-1 space-y-3">
      <div className="rounded-lg border border-teal-300 bg-teal-50 p-4 text-sm leading-relaxed text-slate-800">
        <p className="font-bold text-teal-900"><span className="mr-1.5 text-teal-600" aria-hidden="true">●</span>[질환은 없으나 의심 소견 및 확진 필요한 경우]</p>
        <p className="mt-1.5 text-slate-700"><span className="mr-1 text-xs align-middle text-teal-700">▶</span>검진 결과상 의심되는 부분이 있어 정확한 진단을 위한 병원 정밀 검사(확진 검사)를 먼저 받으시길 권고드립니다.<br />현재 상태를 개선할 수 있는 아래 가이드북을 참고해 건강관리를 시작해 주세요!</p>
      </div>
      <div className="rounded-lg border border-indigo-300 bg-indigo-50 p-4 text-sm leading-relaxed text-slate-800">
        <p className="font-bold text-indigo-900"><span className="mr-1.5 text-indigo-600" aria-hidden="true">●</span>[질환으로 진단받은 경우]</p>
        <p className="mt-1.5 text-slate-700"><span className="mr-1 text-xs align-middle text-indigo-700">▶</span>질환으로 진단받아 전문 치료와 관리가 필요한 단계입니다. 병원 정기 진찰 및 전문의 치료를 반드시 병행하시고, 아래 일상 관리를 철저히 준수하세요!</p>
      </div>
      <div className="rounded-2xl border border-teal-200/90 bg-white p-4 shadow-sm transition-all sm:p-6">
        {/* Interactive Keyword Tags */}
        <div>
        <div className="mb-3 flex items-center justify-center gap-2 text-center">
          <Tag className="w-4 h-4 text-teal-600" />
          <span className="text-xl font-semibold text-teal-800">
            세부 관리 가이드
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {condition.keywords.map((kw) => {
            const isKwActive = selectedKeywordId === kw.id;
            return (
              <button
                key={kw.id}
                onClick={() => onSelectKeyword(kw)}
                className={`group relative justify-center px-4 py-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                  isKwActive
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-transparent shadow-md shadow-teal-600/25 scale-[1.02]"
                    : "bg-slate-50 hover:bg-teal-50/80 text-slate-700 hover:text-teal-800 border-slate-200/80 hover:border-teal-300"
                }`}
              >
                {isKwActive ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-100" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-teal-500 group-hover:scale-110 transition-transform" />
                )}
                <span>{kw.tag}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    isKwActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 text-slate-600 group-hover:bg-teal-200/50 group-hover:text-teal-900"
                  }`}
                >
                  가이드 보기
                </span>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};
