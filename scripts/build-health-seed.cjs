// client/public/healthData.json -> supabase/seed_health_content.sql
// 콘텐츠를 수정한 뒤 `npm run seed:content` 실행 -> 생성된 SQL을 Supabase SQL Editor에서 Run
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "client/public/healthData.json"), "utf8"));
if (!Array.isArray(data) || data.length !== 8) throw new Error("healthData.json must contain 8 conditions");
const json = JSON.stringify(data);
if (json.includes("$hc$")) throw new Error("content contains the reserved token $hc$");
const sql = `-- 자동 생성 파일 (scripts/build-health-seed.cjs). 먼저 schema.sql 을 실행해 두세요.
insert into public.health_content (id, data)
values ('main', $hc$${json}$hc$::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();
`;
fs.writeFileSync(path.join(root, "supabase/seed_health_content.sql"), sql);
console.log(`wrote supabase/seed_health_content.sql (${(sql.length / 1024).toFixed(1)} KB)`);
