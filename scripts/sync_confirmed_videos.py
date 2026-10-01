import json
from pathlib import Path

path = Path('/home/ubuntu/health-care-guide/client/public/healthData.json')
data = json.loads(path.read_text())

for disease in data:
    for keyword in disease.get('keywords', []):
        if keyword['id'] == 'hypertension-exercise':
            keyword['actionSteps'] = [
                {'title': '1. 벽에 등·엉덩이 밀착', 'desc': '등·허리·엉덩이를 벽에 붙이고 벽을 따라 내려가 무릎 약 90도의 자세를 만듭니다.', 'metric': '무릎 부담 없는 깊이'},
                {'title': '2. 벽 스쿼트 2분 유지', 'desc': '손을 가슴 앞에 교차하거나 허벅지에 두고 자세를 2분간 유지합니다.', 'metric': '2분 유지'},
                {'title': '3. 2분 휴식하기', 'desc': '일어나서 2분간 쉽니다. 영상은 이 휴식도 혈관 확장에 중요하다고 설명합니다.', 'metric': '2분 회복'},
                {'title': '4. 4세트·주 3회 반복', 'desc': '2분 운동과 2분 휴식을 4회 반복해 총 16분 실시합니다. 무릎 통증이 있으면 깊이와 시간을 줄여 점진적으로 늘립니다.', 'metric': '총 16분·주 3회'},
            ]
            keyword['keyRules'] = ['무릎 통증이 있거나 자세가 부담스러우면 억지로 90도까지 내려가지 말고 가능한 높이에서 시작하세요.']
            keyword['video']['summary'] = '벽 스쿼트 2분과 휴식 2분을 4세트 반복하는 고혈압 운동 루틴입니다.'
        elif keyword['id'] == 'diabetes-exercise':
            keyword['video']['duration'] = '약 5분 37초'
            keyword['video']['summary'] = '의자를 잡고 스트레칭·스쿼트·뒤로 다리 뻗기·카프레이즈를 순서대로 따라 하세요.'
            keyword['actionSteps'] = [
                {'title': '1. 허벅지·종아리 스트레칭', 'desc': '의자를 잡고 허벅지 앞과 종아리를 좌우 각 15초씩 스트레칭합니다.', 'metric': '좌우 각 15초'},
                {'title': '2. 의자 스쿼트 12회', 'desc': '발끝을 약 15도 바깥으로 향하고 허벅지가 바닥과 평행해질 때까지 앉았다 일어납니다. 힘들면 횟수를 줄입니다.', 'metric': '12회'},
                {'title': '3. 뒤로 다리 뻗기 12회', 'desc': '의자를 잡고 한쪽 다리를 길게 뒤로 뻗습니다. 복부에 힘을 주어 허리가 꺾이지 않게 합니다.', 'metric': '좌우 각 12회'},
                {'title': '4. 카프레이즈·햄스트링 스트레칭', 'desc': '카프레이즈 12회 후 의자에 앉아 햄스트링을 좌우 각 15초씩 스트레칭합니다.', 'metric': '12회·좌우 각 15초'},
            ]
        elif keyword['id'] == 'ckd-salt-protein':
            keyword['video']['title'] = '만성콩팥병 식습관과 칼륨 조절'
            keyword['video']['duration'] = '약 16분 55초'
            keyword['video']['summary'] = '신장 건강 식품, 칼륨 줄이는 조리법, 피해야 할 음식과 보충제 주의를 확인하세요.'
            keyword['actionSteps'] = [
                {'title': '1. 저칼륨 식품 고르기', 'desc': '영상이 예시로 든 배추·오이·콩나물·가지·당근과 사과·배·귤·포도·딸기 등을 확인합니다.', 'metric': '개인 칼륨 수치 우선'},
                {'title': '2. 채소 칼륨 줄여 조리하기', 'desc': '만성콩팥병이 있다면 과일·채소를 약 2시간 물에 담그거나 가열·데쳐 먹는 방법을 고려합니다.', 'metric': '2시간 담그기·데치기'},
                {'title': '3. 달고 짠 음식 줄이기', 'desc': '달고 짠 자극적인 음식, 칼륨이 많은 과일·채소 주스, 인·과당이 많은 인스턴트 음료와 지나친 육식을 줄입니다.', 'metric': '주스·과단백 주의'},
                {'title': '4. 보충제는 상담 후 복용', 'desc': '비타민 D·칼슘·크레아틴·철분·고용량 비타민 C의 과용을 피하고 의료진과 상의합니다.', 'metric': '임의 복용 금지'},
            ]
            keyword['keyRules'] = ['칼륨 제한과 보충제 복용 여부는 신장 기능·혈중 칼륨·투석 여부에 따라 달라지므로 의료진 지시를 우선하세요.']
        elif keyword['id'] == 'ckd-hydration':
            keyword['video']['title'] = '만성콩팥병 피해야 할 식습관'
            keyword['video']['duration'] = '약 16분 55초'
            keyword['video']['summary'] = '달고 짠 음식, 칼륨이 많은 주스, 과도한 육식과 보충제 과용을 피하는 방법입니다.'
            keyword['actionSteps'] = [
                {'title': '1. 달고 짠 자극식 줄이기', 'desc': '달고 짠 자극적인 음식과 인·과당이 많은 인스턴트 음료를 줄입니다.', 'metric': '저염·저당'},
                {'title': '2. 칼륨 주스 주의하기', 'desc': '칼륨이 많은 과일·채소 주스는 혈중 칼륨 상태에 따라 제한하고 의료진과 상의합니다.', 'metric': '주스 주의'},
                {'title': '3. 지나친 육식 줄이기', 'desc': '과도한 육식과 단백질 섭취를 줄이고 개인 신장 기능에 맞는 양을 확인합니다.', 'metric': '과단백 제한'},
                {'title': '4. 보충제 과용 피하기', 'desc': '비타민 D·칼슘·크레아틴·철분·고용량 비타민 C를 임의로 과용하지 않습니다.', 'metric': '복용 전 상담'},
            ]
            keyword['keyRules'] = ['칼륨·단백질 제한과 보충제 복용은 신장 전문의 또는 영양사와 개인별로 조정하세요.']

path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print('synchronized confirmed video guides')
