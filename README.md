# 게임 개발 직무 지식 지도

게임 개발의 세부 직무를 **역할 / 필요한 기술·능력·지식 / 알아야 하는 지식 영역 / 직무 간 협업 관계**로 정리하는 정적 웹 프로젝트입니다.

현재 기본 데이터에는 **23개 직무**와 **61개 협업 관계**가 들어 있습니다. GitHub 저장소에 올린 뒤 GitHub Pages로 `docs/` 폴더를 배포할 수 있도록 구성했습니다.

## 포함된 직무

- 🎮 게임플레이 프로그래머 (`gameplay-programmer`)
- 🧠 AI 프로그래머 (`ai-programmer`)
- 🌐 네트워크 프로그래머 (`network-programmer`)
- 🖥️ 그래픽스/렌더링 프로그래머 (`graphics-programmer`)
- ⚙️ 엔진 프로그래머 (`engine-programmer`)
- 🛠️ 툴 프로그래머 (`tools-programmer`)
- 🚀 최적화/플랫폼 프로그래머 (`optimization-platform-programmer`)
- 🧩 UI 프로그래머 (`ui-programmer`)
- 🎨 3D/2D 아티스트 (`artist-2d-3d`)
- 🦴 애니메이터 / 리거 (`animator-rigger`)
- 🔧 테크니컬 아티스트(TA) (`technical-artist`)
- ✨ VFX 아티스트 (`vfx-artist`)
- 🗺️ 게임 디자이너 / 기획자 (`game-designer`)
- ⚔️ 전투 디자이너 (`combat-designer`)
- 🗺️ 레벨 디자이너 (`level-designer`)
- 📊 밸런스 디자이너 (`balance-designer`)
- 📖 내러티브 디자이너 / 라이터 (`narrative-designer-writer`)
- 🔊 사운드 디자이너 (`sound-designer`)
- 🎼 게임 작곡가 (`game-composer`)
- 🧪 QA / QA 엔지니어 (`qa-engineer`)
- 📋 프로듀서 / PM (`producer-pm`)
- 🔨 Build / DevOps 엔지니어 (`build-devops-engineer`)
- ☁️ 백엔드/서버 프로그래머 (`backend-server-programmer`)

## 폴더 구조

```text
game-career-map/
├─ AGENT.md                 # Codex가 우선 읽어야 할 프로젝트 지침
├─ AGENTS.md                # Codex 호환용 진입 파일
├─ README.md
├─ ROADMAP.md
├─ content/
│  └─ roles/                # 직무별 사람이 읽기 쉬운 Markdown 원본
├─ docs/                    # GitHub Pages 배포 루트
│  ├─ index.html            # 직무 목록/검색
│  ├─ role.html             # 직무 상세 화면
│  ├─ graph.html            # 정점/엣지 협업 그래프
│  ├─ data/
│  │  ├─ roles.json         # 직무 구조화 데이터
│  │  └─ relations.json     # 협업 그래프 엣지 데이터
│  └─ assets/
│     ├─ styles.css
│     ├─ common.js
│     ├─ roles.js
│     ├─ role.js
│     └─ graph.js
└─ scripts/
   ├─ validate_data.py      # 데이터 무결성 검사
   └─ sync_role_markdown.py # roles.json → content/roles/*.md 동기화
```

## 로컬에서 보기

브라우저에서 `index.html`을 직접 열기보다 로컬 HTTP 서버를 사용합니다.

```bash
python -m http.server 8000 --directory docs
```

그 다음 `http://localhost:8000`에 접속합니다.

## 데이터 검증

```bash
python scripts/validate_data.py
```

검사 항목:

- 직무 ID 중복
- 필수 필드 누락
- 기술·능력·지식 목록 누락
- 관계의 source/target이 실제 직무를 가리키는지
- 자기 자신을 가리키는 엣지 여부
- 중복 관계 여부

## GitHub Pages 배포

1. 이 폴더를 Git 저장소로 초기화하고 GitHub에 Push합니다.
2. GitHub 저장소의 **Settings → Pages**로 이동합니다.
3. `Deploy from a branch`를 선택합니다.
4. Branch는 `main`, Folder는 `/docs`로 지정합니다.

별도의 빌드 프레임워크가 없으므로 GitHub Pages에서 그대로 서비스할 수 있습니다.

## 콘텐츠 편집 원칙

- 구조화된 직무 데이터의 기준은 `docs/data/roles.json`입니다.
- 그래프 관계의 기준은 `docs/data/relations.json`입니다.
- 직무 Markdown은 `python scripts/sync_role_markdown.py`로 재생성할 수 있습니다.
- 실제 기업 채용 공고나 공식 문서를 조사해 내용을 추가할 경우 **출처 URL, 확인 날짜, 어떤 문장을 뒷받침하는지**를 함께 기록합니다.
- 직무마다 회사별 역할 경계가 다를 수 있으므로, 보편적 개념과 특정 회사 사례를 구분해서 작성합니다.

## 현재 페이지 기능

- 23개 직무 카드와 분야 필터
- 직무명/기술/지식 키워드 검색
- 직무 상세 페이지
- 기술·능력·지식 전체 목록 표시
- 지식 영역별 주제 표시
- 대표 산출물 표시
- 23개 정점 기반 협업 그래프
- 엣지 유형 필터
- 직무 클릭 시 연결된 관계 강조
- 그래프 노드에서 직무 상세 페이지 이동

## 향후 확장

`ROADMAP.md`와 `AGENT.md`에 Codex가 이어서 작업하기 위한 구체적인 규칙과 우선순위를 적어 두었습니다.
