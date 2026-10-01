from pathlib import Path
path = Path('/home/ubuntu/health-care-guide/client/public/healthData.json')
text = path.read_text()
old = '"title": "의자 식후 혈당 운동"'
new = '"title": "식후 의자 운동"'
if old not in text:
    raise SystemExit('target title not found')
path.write_text(text.replace(old, new, 1))
print('corrected diabetes exercise title')
