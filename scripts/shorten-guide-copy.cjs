const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../client/public/healthData.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const copy = {
  'hypertension-exercise': ['벽스쿼트 운동', '기전: 하체 운동으로 혈관 부담을 줄입니다.'],
  'hypertension-diet': ['저염 식단', '기전: 나트륨을 줄여 혈압을 낮춥니다.'],
  'hypertension-monitor': ['혈압 측정', '기전: 정확한 기록으로 혈압 변화를 확인합니다.'],
  'diabetes-exercise': ['식후 운동', '기전: 근육 활동으로 식후 혈당을 낮춥니다.'],
  'diabetes-diet': ['식이습관', '기전: 식사 순서로 혈당 상승을 완만하게 합니다.'],
  'diabetes-cgm': ['혈당 기록', '기전: 기록으로 생활습관과 혈당을 함께 봅니다.'],
  'dyslipidemia-diet': ['건강한 지방', '기전: 포화지방을 줄여 콜레스테롤을 관리합니다.'],
  'dyslipidemia-exercise': ['유산소 운동', '기전: 꾸준한 운동으로 중성지방을 낮춥니다.'],
  'liver-abstinence': ['금주 실천', '기전: 술을 줄여 간 회복을 돕습니다.'],
  'liver-diet': ['당 줄이기', '기전: 과당을 줄여 간 지방 축적을 막습니다.'],
  'ckd-salt-protein': ['저염 단백질', '기전: 염분과 단백질 부담을 줄입니다.'],
  'ckd-hydration': ['수분·혈압', '기전: 수분과 혈압을 균형 있게 관리합니다.'],
  'tb-symptom-check': ['기침 확인', '기전: 증상 변화를 살펴 조기 진료를 돕습니다.'],
  'tb-immunity': ['면역 영양', '기전: 균형 잡힌 영양으로 면역을 돕습니다.'],
  'obesity-aerobic-zone': ['존2·근력운동', '기전: 유산소와 근력으로 체지방을 줄입니다.'],
  'obesity-intermittent-diet': ['12:12 식사', '기전: 규칙적인 식사로 혈당 변동을 줄입니다.'],
  'heart-red-flags': ['위험 신호', '기전: 이상 신호를 알아차려 빠르게 대응합니다.'],
  'heart-aerobic-safe': ['안심 유산소', '기전: 무리 없는 운동으로 심폐 기능을 돕습니다.']
};
for (const condition of data) {
  for (const keyword of condition.keywords) {
    const next = copy[keyword.id];
    if (!next) throw new Error(`Missing concise copy for ${keyword.id}`);
    keyword.title = next[0];
    keyword.subtitle = next[1];
  }
}
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${Object.keys(copy).length} guide topics.`);
