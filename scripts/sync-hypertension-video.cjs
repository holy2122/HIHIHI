const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "../client/public/healthData.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const condition = data.find((item) => item.id === "hypertension");
if (!condition) throw new Error("hypertension condition not found");
const keyword = condition.keywords.find((item) => item.id === "hypertension-exercise");
if (!keyword) throw new Error("hypertension-exercise keyword not found");

keyword.title = "약없이 고혈압 낮추는 방법! 벽스쿼트의 마법";
keyword.subtitle = "기전: 하체 근육 수축과 휴식의 반복을 통해 혈관을 확장하고 탄력성을 회복하여 심장 부담 감소";
keyword.shortActionSummary = "하루 16분 벽 스쿼트로 혈압을 안정시키세요.";
keyword.actionSteps = [
  {
    title: "1. 벽 스쿼트 버티기 (2분)",
    desc: "벽에 엉덩이, 허리, 등을 완전히 밀착한 후 무릎이 아프지 않은 깊이만큼 내려가 2분 동안 버팁니다."
  },
  {
    title: "2. 완벽한 휴식 및 혈관 확장 (2분)",
    desc: "자리에서 일어나 2분간 온전히 쉽니다. 이 순간 쥐어짜였던 혈관이 확 확장되며 혈류 대사가 촉진됩니다."
  },
  {
    title: "3. 4회 반복 세트 완료 (총 16분)",
    desc: "2분 운동과 2분 휴식을 한 세트로 묶어 총 4회 반복합니다. 일주일에 3회 격일 실천이 기준입니다."
  }
];
keyword.keyRules = [
  "벽 스쿼트 후 일어났을 때 노는 것이 아니라 '풀어내는 휴식' 또한 혈관 확장이 일어나는 핵심 치료 운동 과정이므로 반드시 2분 휴식 시간을 철저히 준수해야 합니다."
];
keyword.video = {
  title: "약없이 고혈압 낮추는 방법! 벽스쿼트의 마법",
  channel: "부부한의사 · 노원 다담한의원",
  youtubeId: "pDanNfJo_vU",
  duration: "16분",
  summary: "벽에 등을 밀착한 벽 스쿼트 2분과 2분 휴식을 4세트 반복하는 등척성 혈압 관리 루틴",
  difficulty: "초급",
  targetTimePerDay: "16분, 주 3회 격일"
};

if (Array.from(keyword.shortActionSummary).length > 25) {
  throw new Error(`shortActionSummary exceeds 25 characters: ${Array.from(keyword.shortActionSummary).length}`);
}
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${condition.name} / ${keyword.tag}; summary length ${Array.from(keyword.shortActionSummary).length}.`);
