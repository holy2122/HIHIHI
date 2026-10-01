import React from "react";
import { HealthCondition } from "../data/healthData";
import {
  Gauge,
  Droplets,
  Bean,
  PersonStanding,
  Heart,
  ChevronRight,
} from "lucide-react";

const LiverLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3.2 10.4c2.1-4.1 6.4-5.8 11.3-5.1 2.8.4 4.8 1.9 6.3 4.1-.8 4-4.2 7.1-8.3 8.1-3.6.9-7.4.1-9.3-2.5-.8-1.1-.8-2.8 0-4.6Z" />
    <path d="M3.7 10.6c3.1 1.1 6.1 1.1 8.9 0 2.2-.8 4-2.1 5.5-3.7" />
    <path d="M12.6 10.8c.1 1.8-.4 3.6-1.4 5.1" />
  </svg>
);

const LungsLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 5v5" />
    <path d="M12 10c-1.8 0-2.7 1.4-3.5 3.2C7.7 15 6.7 18 4.4 18c-1.1 0-1.8-.8-1.8-2.1 0-2.8 1.2-6.7 2.7-8.5.8-.9 1.7-.7 2.3.3L9.5 11" />
    <path d="M12 10c1.8 0 2.7 1.4 3.5 3.2.8 1.8 1.8 4.8 4.1 4.8 1.1 0 1.8-.8 1.8-2.1 0-2.8-1.2-6.7-2.7-8.5-.8-.9-1.7-.7-2.3.3L14.5 11" />
    <path d="M12 10v9" />
  </svg>
);

const VesselLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3.2 15.8c2.8-6.7 7.2-9.7 13.1-8.6 2 .4 3.5 1.2 4.5 2.3" />
    <path d="M4.8 19c2.6-5.6 6.2-8 10.7-7.2 1.7.3 3 .9 4 1.8" />
    <path d="M3.2 15.8 4.8 19M16.3 7.2l-.8 4.6M20.8 9.5l-1.3 4.1" />
    <ellipse cx="8" cy="14" rx="1.2" ry="0.65" transform="rotate(-28 8 14)" />
    <ellipse cx="12" cy="11.8" rx="1.2" ry="0.65" transform="rotate(18 12 11.8)" />
    <ellipse cx="15.8" cy="13.8" rx="1.2" ry="0.65" transform="rotate(-18 15.8 13.8)" />
  </svg>
);

const GlucoseLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3.5s5 5.4 5 9.2a5 5 0 1 1-10 0c0-3.8 5-9.2 5-9.2Z" />
    <path d="M9.2 12.2h5.6M9.2 14.6h5.6" />
  </svg>
);

interface ConditionCardProps {
  condition: HealthCondition;
  isSelected: boolean;
  onSelect: (condition: HealthCondition) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({
  condition,
  isSelected,
  onSelect,
}) => {
  const getIcon = () => {
    switch (condition.id) {
      case "hypertension":
        return <VesselLineIcon className="w-8 h-8 text-blue-600" />;
      case "diabetes":
        return <GlucoseLineIcon className="w-8 h-8 text-emerald-600" />;
      case "dyslipidemia":
        return <Droplets className="w-7 h-7 text-sky-600" />;
      case "liver":
        return <LiverLineIcon className="w-7 h-7 text-teal-600" />;
      case "ckd":
        return <Bean className="w-7 h-7 text-cyan-600" />;
      case "tuberculosis":
        return <LungsLineIcon className="w-7 h-7 text-blue-700" />;
      case "obesity":
        return <PersonStanding className="w-8 h-8 text-emerald-600" />;
      case "heart":
        return <Heart className="w-7 h-7 text-blue-600" />;
      default:
        return <Gauge className="w-7 h-7 text-teal-600" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(condition)}
      className={`group relative text-left bg-white rounded-2xl p-5 transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
        isSelected
          ? "border-teal-500 shadow-md shadow-teal-500/10 ring-2 ring-teal-500/20 translate-y-[-2px] bg-gradient-to-b from-teal-50/30 to-white"
          : "border-slate-200/90 hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${condition.colorTone.iconBg}`}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors tracking-tight whitespace-nowrap">
                {condition.name}
              </h3>
            </div>
          </div>

        </div>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-slate-600 line-clamp-2 mb-3 leading-relaxed min-h-[42px]">
          {condition.shortDesc}
        </p>

      </div>

      {/* Tags Preview & CTA */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 mt-auto">
        <div className="flex items-center gap-1 flex-wrap overflow-hidden max-h-[26px]">
          {condition.keywords.map((kw) => (
            <span
              key={kw.id}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors"
            >
              #{kw.tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-xs font-semibold text-teal-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1">
          <span>관리수칙</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </div>
      </div>
    </div>
  );
};
