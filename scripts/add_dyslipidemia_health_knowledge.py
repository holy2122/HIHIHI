import json
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'client' / 'public' / 'healthData.json'
data = json.loads(path.read_text())

timeline = [
    {'label': '지방(지질)이란?', 'seconds': 239, 'time': '03:59'},
    {'label': '우리 몸을 구성하는 콜레스테롤', 'seconds': 490, 'time': '08:10'},
    {'label': '호르몬의 원료, 콜레스테롤', 'seconds': 615, 'time': '10:15'},
    {'label': '지방 소화에 관여하는 콜레스테롤', 'seconds': 826, 'time': '13:46'},
    {'label': '콜레스테롤은 어떻게 만들어지나요?', 'seconds': 1244, 'time': '20:44'},
    {'label': '콜레스테롤 생산 공장 간', 'seconds': 1512, 'time': '25:12'},
    {'label': '콜레스테롤 이동 경로', 'seconds': 1606, 'time': '26:46'},
    {'label': 'LDL 콜레스테롤의 정체', 'seconds': 2052, 'time': '34:12'},
    {'label': 'LDL 콜레스테롤이 많아지면 생기는 일', 'seconds': 2184, 'time': '36:24'},
    {'label': 'LDL 콜레스테롤과 HDL 콜레스테롤', 'seconds': 2310, 'time': '38:30'},
    {'label': '고지혈증은 병이 아닙니다', 'seconds': 2464, 'time': '41:04'},
    {'label': '간 기능이 높으면 콜레스테롤도 높다?', 'seconds': 2684, 'time': '44:44'},
    {'label': '오늘의 강의 총정리', 'seconds': 3228, 'time': '53:48'},
]

new_keyword = {
    'id': 'dyslipidemia-knowledge',
    'tag': '건강지식',
    'title': '콜레스테롤 건강교실',
    'subtitle': '지질과 콜레스테롤의 역할을 이해합니다.',
    'shortActionSummary': '콜레스테롤의 흐름을 이해해 관리하세요.',
    'actionSteps': [
        {'title': '1. 지방과 지질의 의미 이해하기', 'desc': '지방과 지질의 기본 개념을 알고 우리 몸에서 어떤 역할을 하는지 영상의 앞부분부터 확인합니다.', 'metric': '03:59부터 시청'},
        {'title': '2. LDL·HDL 이동 과정 살펴보기', 'desc': '콜레스테롤이 간에서 만들어지고 혈액을 통해 이동하는 과정과 LDL·HDL의 차이를 타임라인으로 찾아봅니다.', 'metric': '25:12~38:30'},
        {'title': '3. 강의 핵심 내용 다시보기', 'desc': '고지혈증과 간 기능 관련 설명을 확인한 뒤 마지막 총정리 구간에서 핵심 내용을 복습합니다.', 'metric': '53:48 총정리'},
    ],
    'keyRules': ['영상은 건강정보 이해를 돕는 자료이며, 검사 결과와 치료 결정은 의료진과 상담하세요.'],
    'evidence': {
        'paperTitle': '2022 Guidelines for the Management of Dyslipidemia',
        'journal': 'Journal of Lipid and Atherosclerosis',
        'year': 2023,
        'authors': 'Korean Society of Lipid and Atherosclerosis',
        'coreSummary': '이상지질혈증 관리는 LDL 콜레스테롤을 포함한 지질 수치를 개인의 심혈관 위험도에 따라 평가하고 생활습관과 필요한 치료를 함께 조정하는 방식으로 이루어집니다.',
        'sourceUrl': 'https://e-jla.org/journal/view.php?doi=10.12997/jla.2023.12.1.1',
        'evidenceGrade': '대한지질동맥경화학회 지침',
    },
    'video': {
        'title': '콜레스테롤의 모든 것: 지방·LDL·HDL·간의 역할',
        'channel': '유튜브 영상',
        'youtubeId': 'C3_s683yTAs',
        'startSeconds': 239,
        'duration': '약 55분 강의',
        'summary': '지방과 콜레스테롤의 역할부터 LDL·HDL의 이동, 간의 콜레스테롤 생산, 강의 총정리까지 순서대로 설명합니다.',
        'difficulty': '초급',
        'targetTimePerDay': '관심 구간 선택 시청',
        'timeline': timeline,
    },
}

for condition in data:
    if condition.get('id') != 'dyslipidemia':
        continue
    keywords = condition.setdefault('keywords', [])
    keywords[:] = [keyword for keyword in keywords if keyword.get('id') != new_keyword['id']]
    exercise_index = next((i for i, keyword in enumerate(keywords) if keyword.get('tag') == '운동방법'), len(keywords) - 1)
    keywords.insert(exercise_index + 1, new_keyword)
    break
else:
    raise SystemExit('dyslipidemia condition not found')

path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print('added dyslipidemia health-knowledge timeline guide')
