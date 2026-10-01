import json
from pathlib import Path

path = Path('/home/ubuntu/health-care-guide/client/public/healthData.json')
data = json.loads(path.read_text())

for condition in data:
    if condition.get('id') != 'diabetes':
        continue
    for keyword in condition.get('keywords', []):
        if keyword.get('id') == 'diabetes-diet':
            keyword['additionalVideos'] = [
                {
                    'title': '당뇨 식이관리 참고 영상',
                    'channel': '제공 영상',
                    'youtubeId': 'FihLathwM3Y',
                    'duration': '영상 가이드',
                    'summary': '당뇨병 식이관리를 위한 추가 참고 영상입니다.',
                    'difficulty': '초급',
                    'targetTimePerDay': '참고 시청',
                }
            ]
            break
    break
else:
    raise SystemExit('diabetes condition not found')

path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print('added diabetes-diet additional video')
