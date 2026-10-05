from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
roles=json.loads((ROOT/'docs/data/roles.json').read_text(encoding='utf-8'))['roles']
out=ROOT/'content/roles'; out.mkdir(parents=True,exist_ok=True)
for r in roles:
    lines=[f"# {r.get('icon','')} {r['title']}","",f"- English: **{r['englishTitle']}**",f"- 분야: **{r['domain']}**","",r['summary'],"","## 주로 하는 일",""]
    lines += [f"- {x}" for x in r['responsibilities']]
    lines += ["","## 필요한 기술·능력·지식",""]+[f"- {x}" for x in r['skills']]+["","## 알아야 하는 지식 영역",""]
    for a in r['knowledgeAreas']:
        lines += [f"### {a['name']}",""]+[f"- {x}" for x in a['topics']]+[""]
    lines += ["## 대표 산출물",""]+[f"- {x}" for x in r['outputs']]+[""]
    (out/f"{r['id']}.md").write_text("\n".join(lines),encoding='utf-8')
print(f"synced {len(roles)} role markdown files")
