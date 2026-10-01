import json
from pathlib import Path

path = Path('/home/ubuntu/health-care-guide/client/public/healthData.json')
data = json.loads(path.read_text())
titles = {
  'hypertension-exercise': '벽 스쿼트 16분 루틴',
  'hypertension-diet': '한국형 DASH 식단',
  'hypertension-monitor': '정확한 자가혈압 측정법',
  'diabetes-exercise': '의자 식후 혈당 운동',
  'diabetes-diet': '당뇨 7일 식단 계획',
  'diabetes-cgm': '자가혈당 측정·기록',
  'dyslipidemia-diet': 'LDL 낮추는 건강한 지방',
  'dyslipidemia-exercise': '주 150분 유산소 가이드',
  'liver-abstinence': '절주·금주 6단계',
  'liver-diet': '간을 위한 당 줄이기',
  'ckd-salt-protein': '콩팥 식습관·칼륨 조절',
  'ckd-hydration': '콩팥에 피할 식습관',
  'tb-symptom-check': '결핵 흔적과 재발 징후',
  'tb-immunity': '폐 면역 호흡 운동과 식단',
  'obesity-aerobic-zone': 'Zone 2 걷기와 홈트',
  'obesity-intermittent-diet': '12:12 현실 식사법',
  'heart-red-flags': '심근경색 위험 신호 응급대처',
  'heart-aerobic-safe': '심장 보호 20분 걷기',
}
for disease in data:
    for keyword in disease.get('keywords', []):
        kid = keyword.get('id')
        if kid in titles:
            keyword['title'] = titles[kid]
        subtitle = keyword.get('subtitle', '')
        if subtitle.startswith('기전:'):
            keyword['subtitle'] = subtitle.split(':', 1)[1].strip()
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print('refreshed video-aligned titles and removed mechanism prefixes')
