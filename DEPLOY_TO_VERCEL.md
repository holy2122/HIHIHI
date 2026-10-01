# Hi Care — GitHub + Vercel + Supabase 배포 순서

Supabase 프로젝트: `https://qgszvmlrqcafrgenusdj.supabase.co`
(URL과 publishable key는 `client/src/lib/supabase.ts`에 기본값으로 들어 있어 Vercel 환경변수 없이도 동작합니다.)

## 1. Supabase — SQL 2개 실행 (처음 1회, 순서 중요)
Supabase 대시보드 → **SQL Editor** → New query
1. `supabase/schema.sql` 전체 붙여넣고 **Run** (테이블 + 보안 규칙 생성)
2. `supabase/seed_health_content.sql` 전체 붙여넣고 **Run** (건강 콘텐츠를 DB에 등록)

## 2. Supabase — 인증 설정
**Authentication → URL Configuration**
- Site URL: 배포된 Vercel 주소 (예: `https://xxx.vercel.app`)
- Redirect URLs: 같은 주소 추가 (`http://localhost:5173`도 추가하면 로컬 테스트 가능)

**Authentication → Sign In / Providers → Email**
- `Confirm email` 을 **반드시 꺼 주세요** (이 버전은 이메일 인증을 사용하지 않습니다. 꺼야 가입 즉시 로그인됩니다.)

## 3. GitHub → Vercel
- 저장소에 push → Vercel에서 Import (Framework: Vite, 설정은 `vercel.json`에 포함)
- push 할 때마다 GitHub **Actions 탭**에서 빌드 검사가 자동 실행됩니다.

## 4. 회원가입 / 관리자 만들기
회원가입 화면에서 **이용자 회원가입** 또는 **관리자 회원가입**을 선택합니다.
- 이용자: 이름·이메일·비밀번호만 입력
- 관리자: 위 항목 + **관리자 코드** 입력 (코드가 맞아야 가입되며, 검증은 DB 트리거가 서버에서 처리)
- 관리자 코드는 `supabase/schema.sql`에 SHA-256 해시로 저장되어 있습니다. 바꾸려면 해시를 새로 계산해 해당 SQL을 다시 Run 하세요.

로그인도 **이용자 로그인 / 관리자 로그인**으로 나뉩니다. 이용자 계정은 이용자 로그인, 관리자 계정은 관리자 로그인에서만 들어갈 수 있습니다.
(기존에 가입했다가 인증 대기 중이던 계정은 `schema.sql`을 다시 Run 하면 자동으로 인증 완료 처리됩니다.)

관리자로 가입해 로그인하면 상단에 **관리자** 버튼이 생기고 `/admin`에서 회원 정지/해제, 관리자 지정, 활동 로그를 관리합니다.

## 영상 타임라인 넣는 방법 (모든 질환 공통)
`client/public/healthData.json`에서 해당 키워드의 `video`(또는 `additionalVideos`의 영상)에 `timeline`만 추가하면, 어느 질환이든 같은 디자인(시간 버튼 → 해당 구간부터 재생)으로 표시됩니다.
```json
"timeline": [
  { "time": "11:09", "label": "원 그리기 운동" },
  { "time": "12:53", "label": "횟수 및 방법" }
]
```
- `time`은 `분:초`(예: `11:09`, 1시간 넘으면 `1:02:03`)로 적으면 재생 초가 자동 계산됩니다. (`seconds`를 직접 적어도 됩니다.)
- 수정 후에는 아래 "콘텐츠를 수정하려면" 순서대로 seed SQL을 다시 Run 해야 사이트에 반영됩니다.

## 관리자 로그인이 안 될 때 점검 (Supabase SQL Editor)
```sql
-- 1) 내 계정의 권한 확인 (role 이 admin 이어야 관리자 로그인 가능)
select email, role, status from public.profiles;
-- 2) role 이 user 로 되어 있다면 관리자로 변경
update public.profiles set role = 'admin' where email = '내이메일@example.com';
-- 3) 관리자 코드 검증 트리거가 설치되어 있는지 (1행이 나와야 정상)
select tgname from pg_trigger where tgname = 'on_auth_user_prepare';
```

## 콘텐츠를 수정하려면
1. `client/public/healthData.json` 수정 (기존 `scripts/`로 수정해도 동일)
2. `npm run seed:content` → `supabase/seed_health_content.sql` 재생성
3. 그 SQL을 Supabase SQL Editor에서 Run
> `healthData.json`은 repo에만 있고 배포 결과물에서는 자동 제거됩니다. (로그인 없이 직접 URL로 받아갈 수 없게 하기 위함)

## 주의
- **`sb_secret_...` / `service_role` 키는 절대 GitHub·코드에 넣지 마세요.** (publishable key만 코드에 있습니다)
- 실제 보안은 DB의 Row Level Security(`schema.sql`)가 담당합니다.
- 로그인 사용자의 "어떤 질환을 조회했는가" 기록은 건강 관련 민감 정보가 될 수 있으니, 정식 운영 전 개인정보처리방침을 마련하세요.
