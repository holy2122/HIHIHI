import React, { useMemo, useRef, useState } from "react";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";
import type { VideoGuide, VideoTimelineItem } from "../data/healthData";

/** "11:09" / "1:02:03" -> 초 */
function parseTime(time: string): number {
  const parts = time.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** 초 -> "11:09" (1시간 이상이면 "1:02:03") */
function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * 영상 타임라인 (모든 질환·모든 영상 공통 디자인)
 * 데이터에는 label 과 time("11:09") 또는 seconds(669) 중 하나만 있으면 됩니다.
 */
export function VideoTimeline({
  items,
  activeSeconds,
  onSelect,
}: {
  items: VideoTimelineItem[];
  activeSeconds?: number;
  onSelect: (seconds: number) => void;
}) {
  const normalized = useMemo(
    () =>
      items.map((item) => {
        const seconds = item.seconds ?? parseTime(item.time ?? "0:00");
        return { label: item.label, seconds, time: item.time ?? formatTime(seconds) };
      }),
    [items]
  );
  if (!normalized.length) return null;

  return (
    <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-b from-teal-50/70 to-white p-3.5 sm:p-5">
      <div className="mb-1.5 flex items-center gap-2 text-teal-900">
        <Clock className="h-5 w-5 text-teal-600" aria-hidden="true" />
        <h4 className="text-base font-extrabold sm:text-lg">영상 타임라인</h4>
      </div>
      <p className="mb-3 text-sm text-teal-700">시간을 누르면 해당 구간부터 재생됩니다.</p>

      <div className="rounded-xl border border-teal-100 bg-white p-3 sm:p-4">
        <h5 className="mb-2.5 text-sm font-extrabold text-teal-950">영상 타임라인</h5>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {normalized.map((item) => {
            const active = activeSeconds === item.seconds;
            return (
              <button
                key={`${item.seconds}-${item.label}`}
                type="button"
                onClick={() => onSelect(item.seconds)}
                className={`flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left shadow-sm transition active:scale-[0.99] cursor-pointer ${
                  active
                    ? "border-teal-400 bg-teal-50/60"
                    : "border-slate-100 bg-white hover:border-teal-300"
                }`}
              >
                <span className="shrink-0 rounded-full bg-teal-100 px-2.5 py-0.5 text-sm font-extrabold tabular-nums text-teal-900">
                  {item.time}
                </span>
                <span className="min-w-0 flex-1 text-sm leading-snug text-slate-800">{item.label}</span>
                <PlayCircle className="h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 영상 1개 = 메타정보 + 플레이어 + 타임라인 + 요약.
 * 메인 영상과 추가 영상 모두 이 컴포넌트를 쓰므로, 어떤 질환이든 video.timeline 만 넣으면 같은 방식으로 표시됩니다.
 */
export function VideoBlock({
  video,
  summaryTitle,
  showKeyPoints = false,
}: {
  video: VideoGuide;
  summaryTitle: string;
  showKeyPoints?: boolean;
}) {
  const [start, setStart] = useState<number | undefined>(video.startSeconds);
  const [autoplay, setAutoplay] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (seconds: number) => {
    setStart(seconds);
    setAutoplay(true);
    window.setTimeout(
      () => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      30
    );
  };

  const src =
    `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1` +
    (start ? `&start=${start}` : "") +
    (autoplay ? "&autoplay=1" : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">{video.title}</h3>
          {video.channel ? <p className="text-xs text-slate-500 sm:text-sm">제공: {video.channel}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-teal-700">난이도: {video.difficulty}</span>
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
            <Clock className="h-3 w-3" />
            {video.duration}
          </span>
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">권장: {video.targetTimePerDay}</span>
        </div>
      </div>

      <div
        ref={playerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl"
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {video.timeline?.length ? (
        <VideoTimeline items={video.timeline} activeSeconds={autoplay ? start : undefined} onSelect={handleSelect} />
      ) : null}

      <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
        <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
        <div>
          <h4 className="mb-0.5 text-xs font-bold tracking-wide text-slate-800">{summaryTitle}</h4>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{video.summary}</p>
          {showKeyPoints && video.keyPoints?.length ? (
            <ul className="mt-3 space-y-2 border-t border-slate-200 pt-3">
              {video.keyPoints.slice(0, 3).map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
