from pathlib import Path

path = Path('/home/ubuntu/health-care-guide/client/src/pages/Home.tsx')
text = path.read_text()
start = text.index('          {condition.id === "dyslipidemia" && (')
end = text.index('        </section>', start)
new = '''          {condition.id === "dyslipidemia" && (
            <div className="mt-5 rounded-xl border-2 border-sky-400 bg-white p-3 sm:p-4">
              <div className="mb-4 border-b border-sky-100 bg-sky-50 px-4 py-3">
                <h2 className="text-sm font-extrabold text-sky-900 sm:text-base">이상지질혈증 수치 분류</h2>
                <p className="mt-1 text-xs text-slate-600">2022년 한국지질·동맥경화학회 지침 기준</p>
              </div>
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">LDL 콜레스테롤</h3>
                  <table className="w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><th className="px-2 py-2 text-left font-bold text-emerald-700">적정</th><td className="px-2 py-2">100 mg/dL 미만</td></tr>
                      <tr className="border-t bg-sky-50/40"><th className="px-2 py-2 text-left font-bold text-sky-700">정상</th><td className="px-2 py-2">100~129 mg/dL</td></tr>
                      <tr className="border-t bg-amber-50/60"><th className="px-2 py-2 text-left font-bold text-amber-700">경계</th><td className="px-2 py-2">130~159 mg/dL</td></tr>
                      <tr className="border-t bg-orange-50/60"><th className="px-2 py-2 text-left font-bold text-orange-700">높음</th><td className="px-2 py-2">160~189 mg/dL</td></tr>
                      <tr className="border-t bg-rose-50/60"><th className="px-2 py-2 text-left font-bold text-rose-700">매우 높음</th><td className="px-2 py-2">190 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">총콜레스테롤</h3>
                  <table className="w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><th className="px-2 py-2 text-left font-bold text-emerald-700">적정</th><td className="px-2 py-2">200 mg/dL 미만</td></tr>
                      <tr className="border-t bg-amber-50/60"><th className="px-2 py-2 text-left font-bold text-amber-700">경계</th><td className="px-2 py-2">200~239 mg/dL</td></tr>
                      <tr className="border-t bg-orange-50/60"><th className="px-2 py-2 text-left font-bold text-orange-700">높음</th><td className="px-2 py-2">240 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">중성지방 (TG)</h3>
                  <table className="w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t"><th className="px-2 py-2 text-left font-bold text-emerald-700">적정</th><td className="px-2 py-2">150 mg/dL 미만</td></tr>
                      <tr className="border-t bg-amber-50/60"><th className="px-2 py-2 text-left font-bold text-amber-700">경계</th><td className="px-2 py-2">150~199 mg/dL</td></tr>
                      <tr className="border-t bg-orange-50/60"><th className="px-2 py-2 text-left font-bold text-orange-700">높음</th><td className="px-2 py-2">200~499 mg/dL</td></tr>
                      <tr className="border-t bg-rose-50/60"><th className="px-2 py-2 text-left font-bold text-rose-700">매우 높음</th><td className="px-2 py-2">500 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-hidden rounded-lg border border-sky-200">
                  <h3 className="bg-sky-50 px-3 py-2 text-xs font-extrabold text-sky-900 sm:text-sm">HDL 콜레스테롤</h3>
                  <table className="w-full table-fixed border-collapse text-[11px] sm:text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr><th className="w-1/2 px-2 py-2 text-left font-bold">분류</th><th className="w-1/2 px-2 py-2 text-left font-bold">수치</th></tr></thead>
                    <tbody>
                      <tr className="border-t bg-rose-50/60"><th className="px-2 py-2 text-left font-bold text-rose-700">낮음</th><td className="px-2 py-2">40 mg/dL 미만</td></tr>
                      <tr className="border-t bg-emerald-50/60"><th className="px-2 py-2 text-left font-bold text-emerald-700">높음</th><td className="px-2 py-2">60 mg/dL 이상</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-4 border-t border-sky-100 bg-sky-50/50 px-3 py-3 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                ※ 모든 수치는 공복 상태 기준이며, 초고위험군·고위험군 등 개인의 심혈관 질환 위험도에 따라 치료 목표치는 달라질 수 있습니다.
              </p>
            </div>
          )}
'''
path.write_text(text[:start] + new + text[end:])
print('split dyslipidemia criteria into four separate tables')
