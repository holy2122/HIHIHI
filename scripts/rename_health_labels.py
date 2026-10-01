import json
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'client' / 'public' / 'healthData.json'
data = json.loads(path.read_text())

renamed = {
    'condition': False,
    'diet': False,
    'exercise': False,
}

for condition in data:
    if condition.get('id') == 'heart':
        condition['name'] = '뇌심혈관질환'
        renamed['condition'] = True
    if condition.get('id') == 'dyslipidemia':
        for keyword in condition.get('keywords', []):
            if keyword.get('tag') == '포화지방/트랜스지방 절제':
                keyword['tag'] = '식이습관'
                renamed['diet'] = True
            elif keyword.get('tag') == '중강도 유산소 150분':
                keyword['tag'] = '운동방법'
                renamed['exercise'] = True

if not all(renamed.values()):
    raise SystemExit(f'labels not found: {renamed}')

path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print('renamed condition and dyslipidemia keyword labels')
