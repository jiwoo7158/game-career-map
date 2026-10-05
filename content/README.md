# 역할 콘텐츠

이 폴더는 `docs/data/roles.json`을 사람이 읽기 쉬운 Markdown으로 펼친 사본입니다.

- 구조화 데이터 수정: `docs/data/roles.json`
- Markdown 재생성: `python scripts/sync_role_markdown.py`
- 데이터 검사: `python scripts/validate_data.py`

직무 지식을 깊게 조사해 추가할 때는 먼저 JSON schema를 확장하고, UI와 Markdown 동기화 스크립트가 새 필드를 처리하도록 함께 수정하세요.
