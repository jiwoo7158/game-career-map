from pathlib import Path
import json, sys
ROOT = Path(__file__).resolve().parents[1]
roles = json.loads((ROOT/'docs/data/roles.json').read_text(encoding='utf-8'))['roles']
relations = json.loads((ROOT/'docs/data/relations.json').read_text(encoding='utf-8'))['relations']
errors=[]
ids=[r.get('id') for r in roles]
if len(ids)!=len(set(ids)): errors.append('중복 role id가 있습니다.')
required=['id','title','englishTitle','domain','summary','responsibilities','skills','knowledgeAreas','outputs']
for r in roles:
    for key in required:
        if key not in r or r[key] in ('',None,[]): errors.append(f"{r.get('id','<unknown>')}: {key} 누락/비어 있음")
    if len(r.get('skills',[])) < 1: errors.append(f"{r.get('id')}: skills가 비어 있음")
    for area in r.get('knowledgeAreas',[]):
        if not area.get('name') or not area.get('topics'): errors.append(f"{r.get('id')}: 잘못된 knowledgeAreas 항목")
idset=set(ids); seen=set()
for i,rel in enumerate(relations):
    s,t=rel.get('source'),rel.get('target')
    if s not in idset: errors.append(f"relation[{i}] source 없음: {s}")
    if t not in idset: errors.append(f"relation[{i}] target 없음: {t}")
    if s==t: errors.append(f"relation[{i}] 자기 자신 연결: {s}")
    key=tuple(sorted((s,t)))+(rel.get('type'),rel.get('label'))
    if key in seen: errors.append(f"relation[{i}] 중복 가능 관계: {key}")
    seen.add(key)
    if not rel.get('reason'): errors.append(f"relation[{i}] reason 비어 있음")
    if rel.get('weight') not in (1,2,3): errors.append(f"relation[{i}] weight는 1~3이어야 함")
if errors:
    print('VALIDATION FAILED')
    for e in errors: print('-',e)
    sys.exit(1)
print(f'OK: {len(roles)} roles, {len(relations)} relations')
