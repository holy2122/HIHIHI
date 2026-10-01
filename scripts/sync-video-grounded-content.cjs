const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "../client/public/healthData.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const summaries = {
  "hypertension-exercise": "빠르게 걷고 벽스쿼트로 혈압을 관리하세요.",
  "hypertension-diet": "싱겁게 먹고 채소와 잡곡을 챙기세요.",
  "hypertension-monitor": "아침·저녁 혈압을 재고 평균을 기록하세요.",
  "diabetes-exercise": "식후 30분, 의자 운동 5분으로 혈당 관리",
  "diabetes-diet": "채소, 단백질, 탄수화물 순서로 드세요.",
  "diabetes-cgm": "7시간 숙면과 혈당 기록을 실천하세요.",
  "dyslipidemia-diet": "기름진 음식 대신 생선과 견과를 드세요.",
  "dyslipidemia-exercise": "주 5회 30분 유산소를 실천하세요.",
  "liver-abstinence": "4주 금주로 간 건강을 회복하세요.",
  "liver-diet": "단 음료를 끊고 통곡물을 선택하세요.",
  "ckd-salt-protein": "짠 음식과 과한 단백질을 줄이세요.",
  "ckd-hydration": "수분과 혈압을 나에게 맞게 관리하세요.",
  "tb-symptom-check": "2주 기침과 이상 증상은 즉시 검사하세요.",
  "tb-immunity": "규칙적인 식사와 햇빛을 챙기세요.",
  "obesity-aerobic-zone": "대화 가능한 속도로 40분 걸으세요.",
  "obesity-intermittent-diet": "저녁 후 12시간 공복을 실천하세요.",
  "heart-red-flags": "가슴 통증과 호흡곤란은 즉시 119입니다.",
  "heart-aerobic-safe": "준비운동 후 따뜻한 시간에 걸으세요."
};
const diabetesSteps = [
  { title: "1. 허벅지 앞 스트레칭 (좌우 15초)", desc: "안정된 의자 등받이를 한 손으로 잡고 발목을 뒤로 잡아 허벅지 앞을 늘립니다. 무릎은 아래를 향하게 유지하세요.", metric: "좌우 각 15초" },
  { title: "2. 종아리 스트레칭 (좌우 15초)", desc: "의자 등받이를 두 손으로 잡고 한 발을 뒤로 크게 내딛습니다. 뒤꿈치를 바닥에 붙이고 앞무릎을 살짝 굽히세요.", metric: "뒤꿈치 고정" },
  { title: "3. 의자 스쿼트 (12회)", desc: "발을 어깨너비로 벌리고 발끝을 약 15도 바깥으로 향합니다. 의자를 잡고 허벅지가 바닥과 평행할 때까지 앉았다 일어나세요.", metric: "힘들면 횟수 감소" },
  { title: "4. 둔근 킥백 (좌우 12회)", desc: "의자를 잡고 다리를 무릎 굽힘 없이 뒤로 뻗습니다. 허리가 꺾이지 않도록 복부에 힘을 주고 엉덩이 수축을 느끼세요.", metric: "좌우 각 12회" },
  { title: "5. 카프레이즈 (12회)", desc: "의자를 잡고 양발 뒤꿈치를 천천히 높이 올렸다가 내립니다. 발목에 충격이 가지 않도록 통제된 속도로 움직이세요.", metric: "천천히 12회" },
  { title: "6. 앉은 햄스트링 스트레칭 (좌우 15초)", desc: "의자 끝에 앉아 한쪽 다리를 뻗고 뒤꿈치만 바닥에 둡니다. 등을 곧게 편 채 천천히 상체를 숙이세요.", metric: "좌우 각 15초" }
];

for (const condition of data) {
  for (const keyword of condition.keywords || []) {
    if (summaries[keyword.id]) keyword.shortActionSummary = summaries[keyword.id];
    if (condition.id === "diabetes" && keyword.id === "diabetes-exercise") {
      keyword.title = "의자를 활용하여 식후 혈당 잡는 5분 운동";
      keyword.shortActionSummary = summaries[keyword.id];
      keyword.actionSteps = diabetesSteps;
      keyword.keyRules = [
        "바퀴 없는 안정된 의자를 미끄럼 없는 바닥에 두고 진행하세요.",
        "통증이나 어지럼이 생기면 즉시 멈추고, 무리하면 횟수를 줄이세요.",
        "꾸준한 운동이 혈당 관리에 중요하며 개인 상태에 따라 의료진과 상의하세요."
      ];
      keyword.video.summary = "안정된 의자를 활용해 스트레칭, 스쿼트, 둔근 킥백, 카프레이즈를 따라 하는 저강도 루틴";
      keyword.video.targetTimePerDay = "식후 5분 루틴";
    }
  }
}

const invalid = [];
for (const condition of data) for (const keyword of condition.keywords || []) {
  if (keyword.shortActionSummary.length > 25) invalid.push(`${keyword.id}:${keyword.shortActionSummary.length}`);
}
if (invalid.length) throw new Error(`Summaries over 25 characters: ${invalid.join(", ")}`);
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${Object.keys(summaries).length} summaries; all are <=25 characters.`);
