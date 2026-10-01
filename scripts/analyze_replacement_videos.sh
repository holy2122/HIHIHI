#!/usr/bin/env bash
set -u
mkdir -p /home/ubuntu/health-care-guide/video_replacement_analysis
analyze() {
  local id="$1" url="$2" topic="$3"
  manus-analyze-video "$url" "이 영상이 ${topic} 건강관리 가이드에 실제로 맞는지 분석해 주세요. 실제 영상에서 확인되는 단계별 순서, 시간, 동작·식품·주의사항만 한국어로 정리하세요. 영상 내용에 없는 사항은 추정하지 말고, 가이드 주제와 불일치하면 명확히 표시하세요." > "/home/ubuntu/health-care-guide/video_replacement_analysis/${id}.md" 2>&1
}
analyze hypertension-monitor 'https://www.youtube.com/watch?v=76_x7fdLkec' '고혈압 자가혈압측정' &
analyze diabetes-diet 'https://www.youtube.com/watch?v=7pdHHSkTJKI' '당뇨병 식이습관' &
analyze diabetes-cgm 'https://www.youtube.com/watch?v=zOT0VmadmcE' '당뇨병 혈당 측정과 기록' &
analyze dyslipidemia-diet 'https://www.youtube.com/watch?v=t0g6xg_GfAY' '이상지질혈증 포화지방·트랜스지방 절제' &
analyze dyslipidemia-exercise 'https://www.youtube.com/watch?v=bR9Rp0FP0FM' '이상지질혈증 중강도 유산소 150분' &
analyze liver-abstinence 'https://www.youtube.com/watch?v=53EZ8830nZI' '간질환 절주·금주' &
analyze liver-diet 'https://www.youtube.com/watch?v=tGfRNIfgPKU' '간질환 단순당·과당 제한' &
analyze heart-red-flags 'https://www.youtube.com/watch?v=jouwrfr7_S0' '심장질환 심근경색 위험 징후' &
wait
printf 'replacement analyses complete\n'
