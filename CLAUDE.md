# Website Automation — Entry Point

Claude Code로 **실제 반응형 웹사이트**(HTML5 · CSS3 · Vanilla JavaScript, GitHub Pages 배포)를 제작하는 자동화 시스템이다. 최종 산출물은 `docs/`의 코드다. Design Definition → Build → Browser QA → Fix → Deploy를 Micro Approval 없이 자율 수행하되, 되돌리기 어렵거나 외부에 영향이 있는 행동은 승인 후에만 한다.

## 응답 언어 (사용자 지정, 2026-10-15)
- 사용자에게 전달하는 모든 설명, 중간 보고, 최종 결과 보고는 한국어로 작성한다.
- 파일명, 함수명, 변수명, Commit ID, Git 명령어 등 기술적인 고유 명칭은 원문을 유지한다.
- PASS / FAIL, Commit, QA 같은 일반적인 기술 용어는 그대로 써도 된다.
- 영어 문서나 영어로 작성된 작업 지시를 참고하더라도 응답 언어는 한국어로 유지한다.

## Operating Mode
하나의 Build Core가 두 가지 입력 방식을 지원한다. `config/project.yaml`의 `project.mode`가 정한다. 분기하는 것은 **Design Definition 단계뿐**이고 SITE SCAFFOLD 이후는 공유한다.

| Mode | 입력 | Design Definition | 하지 않는 것 |
|---|---|---|---|
| `figma_implementation` | 완성된 Figma 디자인(READ ONLY) | `design-source/`(`frame-map.md`, `extracted-tokens.json`, `implementation-spec.md`) + `ia/sitemap.md` (`read-design-source` Skill) | IA 재설계, Visual Direction 제안, 디자인 개선·재디자인, Figma 수정 |
| `autonomous_generation` | Brief와 Content | `content/` + `ia/sitemap.md` + 승인된 `design-system/visual-language.md` + `design-system/token-source.json` | Figma 사용(필요 없다) |

- `figma_implementation`에서 Figma는 **READ ONLY Design Source**다. Figma를 수정하지 않고, Node를 만들지 않고, 작업 공간이나 상태 저장소로 쓰지 않는다. 필요한 것은 Figma → Implementation Specification 변환뿐이다.
- Figma가 명확하지 않은 부분만 Implementation Judgement로 처리하고 기록한다. 디자인을 바꿔야 할 정도의 문제는 자동 수정하지 않고 보고한다(Level 3).
- **Design Definition 구간에서는 어느 mode에서도 `docs/`를 만들지 않는다.** `docs/`는 SITE SCAFFOLD에서 처음 생성되고, 그때 Token Source(`extracted-tokens.json` 또는 `token-source.json`)로부터 `docs/css/tokens.css`가 만들어진다.
- `mode`가 비어 있거나 `design_source`와 맞지 않으면 추정하지 않고 묻는다.

## 시작할 때 항상 먼저 한다
1. `config/project.yaml`을 읽고 `project.mode`를 확인한다. 이 저장소의 프로젝트는 하나다. 파일이 없으면 `config/project-template.yaml`을 복사해 만들도록 안내한다.
2. `automation/pipeline-state.json`에서 `current_stage`, `stage_status`, `checkpoint`, `blockers`, `approval_required`를 읽고 마지막 Checkpoint에서 Resume한다.
3. `git status`와 현재 branch를 확인한다. 내가 만들지 않은 미커밋 변경이 있으면 건드리지 않고 보고한다.
4. `archive/`는 읽기 전용 보관물이다. 그 안의 Config/State를 Resume하지 않고, 수정·삭제하지 않는다.

## Project Goal을 임의로 추정하지 않는다
- 무엇을 만드는지, 어떤 내용을 싣는지는 `config/project.yaml`과 콘텐츠 원본에서 읽는다. 콘텐츠 원본은 `figma_implementation`에서는 Figma의 Text(그대로 사용), `autonomous_generation`에서는 `content/`다.
- 사용자가 제공하지 않은 이름·경력·프로젝트 설명·연락처·문구를 만들어 넣지 않는다(Level 3). 비어 있으면 묶어서 요청한다.
- `autonomous_generation`의 Visual 판단(`visual_expression`이 `auto`인 항목)은 추측이 아니라 Visual Director의 결정 사항이다. `figma_implementation`에서는 Visual 판단을 새로 하지 않는다.

## Stack (고정 — 변경은 Level 3)
HTML5 · CSS3(Custom Property) · Vanilla JavaScript · Git/GitHub · GitHub Pages(`docs/` branch 배포). React, Vue, Next.js, TypeScript, Tailwind, Build Tool, Package Manager, 대형 Framework를 도입하지 않는다. HTML/CSS와 기초 JavaScript를 아는 사람이 읽고 고칠 수 있어야 한다. 세부는 `.claude/rules/frontend-code.md`.

## Decision Authority — DO NOT ASK BY DEFAULT
승인된 Scope / Content / Visual Direction / Stack 안에서 해결 가능한 문제는 묻지 않는다.

| Level | 처리 | 대상 |
|---|---|---|
| 1 AUTO | 묻지 않고 실행 | 파일 읽기, Figma 읽기, 분석, 문서·State 갱신, 포맷 정리, 구현 결함(Overflow·정렬·깨진 링크) 수정, 안전하고 되돌릴 수 있는 코드 수정, Design Definition 안의 세부 구현 판단 |
| 2 AUTO + REPORT | 실행 후 보고(`last_meaningful_change` + 최종 보고) | 일반 HTML/CSS 구현, Section 구성, 반응형 수정, 접근성 수정, 작은 JavaScript Interaction, 코드 정리, 승인된 Asset 적용, Stage 단위 local commit — 단 되돌릴 수 있고 승인 Scope 안이며 Architecture를 바꾸지 않을 것 |
| 3 MUST ASK | 질문(최대 3개로 묶음) | Stack 변경, 새 Framework, 외부 Dependency(CDN Script·외부 Font Host 포함), 파괴적 파일 삭제, 큰 Architecture 변경, 배포 Platform 변경, 주요 콘텐츠 제거, 승인된 Visual Direction 변경, Figma 디자인과 다르게 구현해야 하는 변경(Design Gap), Figma 수정, Scope 변경, 사용자만 아는 사실(Content) 부족, Asset rights blocker, Tool blocker, `git push`, Production deploy, Final sign-off |

**Action Safety가 Decision Authority보다 우선한다**(`.claude/rules/action-safety.md`). Tier 3(push·배포·게시·삭제·전송·계정 변경 등)은 실행 직전 명시적 승인, Tier 4(Password/Token/Key)는 요청·저장·기록·전달 금지. 불확실하면 한 단계 높은 Tier로 본다. Git/배포 세부는 `.claude/rules/git-deploy.md`.

Micro Approval 질문("간격을 줄일까요?", "이 색이 좋을까요?")은 하지 않는다.
`automation.autonomy_mode`: `guided`(Level 2도 실행 전 확인) / `autonomous`(기본값). 어떤 Mode도 Level 3와 Action Safety를 완화하지 않는다.

## Pipeline
**Design Definition (mode별)**
- `figma_implementation`: PROJECT LOAD → DESIGN SOURCE INTAKE → FIGMA CALIBRATION → CONTENT / ASSET MAPPING → IMPLEMENTATION PLAN
- `autonomous_generation`: PROJECT LOAD → ENV / CODEBASE CALIBRATION → CONTENT / IA → (Reference Research) → VISUAL DIRECTION → USER APPROVAL → VISUAL SYSTEM → (Asset Sourcing)

**Common Build Core (공유)**
→ SITE SCAFFOLD → MASTER PAGE BUILD → SECTION BUILD → BROWSER QA → TARGETED FIX → SECONDARY PAGES → INTERACTION → FULL QA → PRE-DEPLOY CHECK → DEPLOY → LIVE QA → DONE

- SECTION BUILD → BROWSER QA → TARGETED FIX는 Section 단위 Loop다. FULL QA에서 이슈가 나오면 TARGETED FIX 후 다시 검증한다.
- 괄호 안은 Optional Stage다(Semantic Gate로 SKIP 가능).
- Build Core의 Agent·Skill·QA·Deploy는 mode와 무관하게 하나다. mode에 따라 달라지는 것은 "무엇을 기준으로 맞는지 판정하는가"뿐이다(Figma Frame 또는 승인된 Visual Language).
- 순서·통과 조건·Checkpoint·Stop Rule은 `.claude/agents/automation-orchestrator.md`를 따른다.

## Responsive
- 지원 Viewport는 최소 Desktop · Tablet · Mobile(`config/project.yaml`의 `viewports`)이다.
- Section을 만들 때마다 세 Viewport를 함께 구현하고 함께 Render한다. FULL QA의 Responsive 검사는 구현 단계가 아니라 최종 검증 Pass다.
- Mobile은 Desktop의 축소판이 아니다(`.claude/rules/ux-principles.md`).

## QA
- 구현 후에는 반드시 Browser에서 Render해 확인한다. Render 없이 PASS 판정 금지.
- Browser QA는 로컬 정적 서버 + Playwright다(`node scripts/qa/capture.cjs`, `.claude/skills/review-browser/`).
- 접근성·성능·코드 품질은 QA에 포함된다(`review-browser`, `review-code`).
- TARGETED FIX에서는 **검증된 문제만** 고친다.

## Polish Limit & Stop Rule
- 한 Page/Section 최대 3 Pass(Structural 1 · Visual QA 1 · Micro Fix 1). 실제 Error가 없으면 4번째 Polish 금지.
- Stop Rule이 모두 PASS면 DONE. "더 화려하게/더 예쁘게/다른 안도 가능"은 재작업 사유가 아니다.

## Source of Truth
| 위치 | 내용 |
|---|---|
| `config/project.yaml` | 프로젝트 정의(목표, 대상, Stack, 배포, Viewport) |
| `automation/pipeline-state.json` | Pipeline 진행 상태, Checkpoint |
| Figma (`design_source.reference`) | `figma_implementation`의 **Design Intent 원본**. READ ONLY |
| `design-source/` | `figma_implementation`: Figma에서 추출한 구현 데이터 — `frame-map.md`(Figma Node 대응), `extracted-tokens.json`(Token Source), `implementation-spec.md`(값 없음) |
| `content/` | `autonomous_generation`: 사이트에 실리는 문안·프로젝트 정보의 원본(사용자 제공) |
| `ia/` | Website 구조(`sitemap.md`: Page, URL/Route, 내비게이션, Section). 두 mode 공통 형식. Figma Node ID를 담지 않는다 |
| `design-system/` | `autonomous_generation`: Visual Direction·원칙·사용 이유(`visual-language.md`, 값 없음), `token-source.json`(Token Source) |
| `docs/css/tokens.css` | **코드에서 쓰는 디자인 값(색·타입·간격·반경 등)의 유일한 원본** (두 mode 공통). SITE SCAFFOLD에서 Token Source로부터 생성 |
| `docs/` | 웹사이트 소스. GitHub Pages에 공개되는 유일한 디렉터리 |
| `references/` | 레퍼런스 조사(텍스트만, 이미지 없음) |
| `assets/`, `legal/` | Asset 후보·승인 이력(`manifest.jsonl`), 출처 정책, 라이선스 근거 |
| `qa/` | QA 보고(스크린샷은 git 미추적) |
| `scripts/qa/` | Browser QA 도구(사이트 Dependency 아님) |
| `archive/` | 이전 Figma 자동화와 프로젝트 기록(READ ONLY) |

**Figma와 코드가 다를 때 (`figma_implementation`)**: 최초 구현 중이면 Figma가 우선이다. 사용자 승인으로 코드를 의도적으로 다르게 한 경우는 `design-source/implementation-spec.md`의 기록을 따른다. 어느 쪽인지 판단할 수 없으면 고치지 않고 보고한다. 같은 값을 여러 CSS 파일에 복제하지 않고 `tokens.css`를 참조한다.

## Fail Closed Asset Policy
이미지·폰트·아이콘의 출처·라이선스·콘텐츠 안전성이 불명확하면(UNKNOWN) REJECTED와 동일하게 취급하고 `docs/`에 넣지 않는다. `assets/manifest.jsonl`에서 `APPROVED`인 것만 사용한다. 공용 규칙은 `.claude/rules/web-research-safety.md`와 `legal/source-policy.yaml`, 프로젝트별 추가 제한은 `config/project.yaml`의 `project_asset_restrictions`. Autonomy는 이 정책을 완화하지 않는다.

## Core Rules
- 코드가 최종 산출물이다. Design Definition(mode별 문서)을 먼저 확정하고, 값은 `tokens.css`에만 둔다.
- 특정 프로젝트의 Frame 이름·색·Section 이름·Asset 경로·프로젝트명을 `.claude/`(Rule/Agent/Skill)와 `scripts/`에 적지 않는다. `config/project.yaml`과 프로젝트 문서에만 둔다.
- 기존 파일은 Edit로 부분 수정한다. 파일 전체 덮어쓰기는 기본 동작이 아니다.
- 요청받은 Page/Section만 수정한다. 관련 없는 사용자 작업을 덮어쓰지 않는다.
- `docs/`에는 사이트에 필요한 파일만 둔다. Config·State·Research·Archive 내용이 사이트에 노출되면 안 된다.
- 사이트 내부 경로는 상대 경로로 쓴다(배포 Base Path는 `config/project.yaml`의 `site.base_path`).
- 필요해지기 전에 파일·추상화·JavaScript를 만들지 않는다.
- git reset, history rewrite, force push, branch 삭제, 대량 파일 삭제, push를 승인 없이 하지 않는다.
