# Implementation Spec

source: Figma `4IjbcMoAkTyWkoacnVAmNe` (READ ONLY) · read_at 2026-10-04
**상태: index 구현 완료. Project Page는 공통 구성으로 구현(2026-10-12, 26절). Showcase 이미지는 권리 확인 대기.**

## 0. 사용자 결정 (2026-10-04)
| 항목 | 결정 |
|---|---|
| Build 우선순위 | 첫 Master Experience는 **Loading → Cover**다(profile 아님). Loading + Cover가 PASS하기 전에는 profile, contents, Project Page를 만들지 않는다 |
| G1 Page 구조 | index에 Cover·Profile·Contents를 두고 Project는 별도 Detail Route로 간다는 방향으로 지시가 내려왔다("Project Detail Route는 이번 단계에서는 만들지 않는다"). 링크 방식과 돌아오는 방법은 Project Page 단계에서 확정한다 |
| G3 Responsive | Desktop 1920을 먼저 정밀 구현하고 1440 → 768 → 390 순으로 Conservative Adaptation을 한다. 허용: 위치 재조정, 크기 감소, 줄바꿈, 여백 감소, 장식 위치 조정. 금지: 새 구성, 새 Graphic, 콘텐츠 삭제, Direction 변경 |
| Unit Policy | Figma 값을 Raw 값으로 보존한다. 단위 변환이 새 디자인 동작을 만들면 안 된다. `clamp()`를 단순 px 변환 수단으로 쓰지 않는다. 1920에서 Render 크기가 Figma와 같아야 한다 |
| Loading Experience | 사용자가 추가한 Interaction이다. Figma에 Loading 화면이 없으므로 새 Direction을 만들지 않고 Cover의 Visual Language를 그대로 쓴다 |
| G2 Case Study 구현 방식 | 2026-10-12 결정 — 공통 Page 구성에 문안을 옮긴다(26절) |

값(Hex, px)은 여기에 적지 않는다. `design-source/extracted-tokens.json`의 Token 이름으로 서술한다.

## 1. Design Source
- Figma Page `자동화` > Section `포트폴리오` > Frame `프로세스`. Node ID는 `frame-map.md`.
- 읽은 방법: Page Metadata 1회(구조 전체, 이후 재사용), 개요 스크린샷 4장(프로필 가안, AIDORA Case Study, 메인페이지, 상세페이지), Node 단위 Design Context 3회(cover, profile, contents), Variable 조회 1회(프로세스 전체).
- **읽지 않은 것**: TJ MEDIA·ASICS KOREA Case Study의 화면 모습(스크린샷 없음, Metadata의 구조와 Text 이름만 확인), 모든 Case Study와 AIDORA 화면의 Node 단위 값, Prototype 연결 정보, 다른 Figma Page.

## 2. Implementation Scope
이 디자인은 Header·Menu를 가진 웹사이트 화면이 아니라, **1920 폭으로 위에서 아래로 이어지는 하나의 포트폴리오 문서**다(총 높이 약 98,000). 구성은 Cover → Profile → Contents → Project 01 AIDORA(Case Study + 결과 화면 4종) → Project 02 TJ MEDIA Case Study → Project 03 ASICS KOREA Case Study.

| 영역 | 분류 | 판단 근거 |
|---|---|---|
| Cover, Profile, Contents | 실제 Website UI | 포트폴리오의 표지·소개·목차. Node 수가 적고 구조가 단순하다 |
| AIDORA Case Study (13 Section) | 실제 Website 콘텐츠(작업 과정 설명) | Contents의 PROJECT 01 Index 01–04에 해당 |
| AIDORA 메인페이지 / 상세페이지 | **SCOPE UNCERTAIN** | 포트폴리오에 넣은 "결과물 전체 화면"으로 보인다. 그 자체가 쇼핑몰 UI(자체 Header·Footer·장바구니 버튼 포함)라서, 사이트 안에 **그림으로 보여 줄 대상**인지 **동작하는 Page로 만들 대상**인지 Figma로는 알 수 없다 |
| TJ MEDIA Case Study (15 Section) | 실제 Website 콘텐츠 | Contents의 PROJECT 02 |
| ASICS KOREA Case Study (11 Section) | 실제 Website 콘텐츠 | Contents의 PROJECT 03 |
| Frame 이름의 "가안" | 확인 필요 | `프로필 가안`이라는 이름이 초안임을 뜻하는지 알 수 없다. 내용은 완성된 모습이다 |
| 숨김 Layer(AIDORA Case Study 7개, TJ 25개) | 구현 제외 | 숨김 상태 그대로 둔다 |
| `자동화` Page의 다른 Node | Reference / Archive | `frame-map.md` "제외" |

## 3. Page Structure
`ia/sitemap.md` 참조. Section 구성은 Figma 그대로 등록했다. Page 분할과 URL은 G1 결정 대기.

## 4. Layout Rules (index)
- 세 Section 모두 `--layout-frame-width` × `--layout-slide-height`의 고정 Slide 구성이고, 안쪽 내용은 세로 가운데 정렬이다.
- **cover**: 배경 Texture 이미지가 Section 전체를 덮는다. 안쪽 영역은 높이 `--layout-cover-inner-height`, 좌우 여백 `--layout-cover-padding-left` / `--layout-cover-padding-right`, 좌우 양끝 정렬. 왼쪽은 제목 묶음(필기체 문구 → 큰 제목 → 이름 → 직함 줄), 오른쪽은 위(연도와 짧은 선)·아래(이메일, 지역) 양끝 배치.
- **profile**: 어두운 Page 바탕(`--color-profile-page`) 위에 Card(`--layout-profile-card`, `--radius-profile-card`, `--shadow-profile-card`, 테두리 `--color-profile-card-border`)가 가운데 놓인다. Card 안은 2단: 왼쪽 Aside(`--layout-profile-aside-width`: 사진, 이름, 생년월일, 구분선, 연락처)와 오른쪽 정보(한 줄 소개, 그 아래 `--space-profile-intro-to-body` 떨어져 2×2 묶음: Experience / Career, Tools / Character). 단 사이 간격 `--space-profile-columns-gap`.
- **contents**: cover와 같은 Texture 배경. 안쪽 `--layout-contents-inner`, 2단: 왼쪽(`--layout-contents-left-width`: Eyebrow와 필기체 "Contents")과 오른쪽(`--layout-contents-right-width`: Project Group 3개, 간격 `--space-contents-groups-gap`). Project Group = 제목 줄(높이 `--layout-contents-project-row-height`, 아래 선 `--color-contents-rule`) + Index 4열(`--layout-contents-index-column-width`, 양끝 정렬).
- AIDORA Case Study만 폭이 `--layout-case-study-aidora-width`로 좁고 1920 안에서 가운데에 놓인다. 다른 Case Study는 1920 전체 폭이다.

## 5. Typography Rules
- 서체 5종이 역할별로 나뉜다: `--font-display`(영문 제목·Label), `--font-script`(필기체 강조: cover 문구, "Contents", profile의 묶음 제목), `--font-serif`(cover의 이름 한 곳), `--font-kr-heading`(profile 이름·연락처), `--font-kr-body`(profile 본문·날짜).
- 한글/영문 혼용: 영문 Label과 제목은 `--font-display`, 한글 문장은 `--font-kr-body`. profile의 이름과 연락처만 `--font-kr-heading`이다.
- 영문 Label은 대문자 + 넓은 자간이 기본이다(`--text-cover-caption`, `--text-contents-eyebrow`, `--text-contents-caption`, `--text-contents-number`). Contents의 항목 줄은 Capitalize다(`--text-contents-item`).
- 위계(index): `--text-cover-title` > `--text-contents-title` > `--text-cover-script` > `--text-profile-name` > `--text-cover-name` = `--text-contents-project` = `--text-profile-heading` > 본문 16–20 > Caption 14.
- Case Study 쪽은 Figma Text Style이 정의되어 있다(`extracted-tokens.json`의 `figma_variables`: Outfit 15종, SUIT 12종, Pretendard 26종). Node와의 대응은 아직 하지 않았다.

## 6. Color Rules
- index는 두 가지 면이 번갈아 나온다: 밝은 종이 Texture(cover, contents — 글자는 `--color-cover-text` 계열의 어두운 색)와 어두운 Card(profile — 글자는 `--color-profile-heading` / `--color-profile-body` / `--color-profile-muted` 3단).
- Accent Color는 index에 없다. 강조는 서체(필기체)와 크기로 한다.
- 선은 모두 반투명 Hairline이다(`--color-contents-rule`, `--color-profile-divider`, `--color-profile-card-border`).
- Gradient: profile 바탕이 Gradient 두 겹으로 되어 있으나 결과는 단색이다(실제 Gradient 표현 없음).
- AIDORA 계열 색은 Figma Variable `color/Main/*`, TJ MEDIA Case Study 색은 `color/*`(Accent 포함)로 정의되어 있다.

## 7. Spacing Rules
- index의 간격은 Auto Layout Gap으로 정의되어 있어 그대로 옮길 수 있다. 반복되는 값: 묶음 제목과 목록 사이(`--space-profile-block-gap`, `--space-contents-group-gap`, `--space-contents-heading-gap`이 같은 값), 2단 사이(`--space-profile-row-columns-gap`, `--space-contents-columns-gap`이 같은 값).
- Section 사이 간격은 없다. 1080 높이 Section이 틈 없이 이어진다.
- Case Study의 Section 높이는 제각각이다(480–3788). 세로 Rhythm은 Section 내부 구성에 따른다.

## 8. Component Strategy
| 이름(Class 후보) | 반복 | 변형 | Responsive | Interaction | 구현 |
|---|---|---|---|---|---|
| `contents-project` (Project Group) | 3 | 없음 | 디자인 없음 | 링크 후보(G1) | Component |
| `contents-index` (Index Column) | 12 | 없음 | 디자인 없음 | 없음 | Component |
| `history-item` (기간 + 이름 + 설명) | 5 | 설명 유무 | 디자인 없음 | 없음 | Component |
| `tool-card` | 5 | 없음 | 디자인 없음 | 없음 | Component |
| `script-heading` (필기체 묶음 제목) | 4 | 없음 | 디자인 없음 | 없음 | Component |
| cover의 제목 묶음, profile의 Aside, Character 목록 | 1 | — | — | — | Component로 만들지 않고 Section 안에서 직접 작성 |

Figma Component Instance는 index에 없다(전부 Frame). ASICS Case Study에만 Instance 207개가 있다. Case Study의 Component 분석은 G2 결정 후에 한다.

## 9. Asset Strategy
이번 단계에서 내려받거나 Export한 Asset은 없다. 아래는 목록이다.

| Asset | 쓰이는 곳 | Figma Node | 예상 형식 | 권리 분류 | 재사용 |
|---|---|---|---|---|---|
| paper-texture (밝은 종이 질감 + 왼쪽 검은 띠) | index#cover, index#contents | `2025:7133`, `2012:9390` 배경 | 사진 → JPG/WebP | **NEEDS RIGHTS CHECK** — 출처 기록 없음 | 2곳 (같은 이미지로 보이며 1개로 관리) |
| profile-photo (증명사진) | index#profile | `2025:7158` | — | **사용하지 않음**(2026-10-09 사용자 결정 — 24절). Export·다운로드·대체 이미지 없음 | 0곳 |
| AIDORA 제품·공간 이미지 다수 | aidora 전 Section | 이름 붙은 이미지 Node 22개 + 배경 Fill(미집계) | JPG/WebP | **NEEDS RIGHTS CHECK** — 직접 제작(AI 생성 포함)인지 확인 필요. Cover에 "AI Image Tools" 표기가 있음 | 여러 곳 |
| AIDORA 로고·심볼 | aidora | Vector 18개 | SVG | SAFE / USER PROVIDED 후보(자체 브랜드) | 여러 곳 |
| AIDORA Case Study의 시장 통계 Chart 2개 | aidora#cs-desk-research | `2025:7351`, `2025:7394` | 이미지 또는 재작성 | **NEEDS RIGHTS CHECK** — 수치 출처 표기가 화면에 있음. 출처 표기 유지 필요 | 1곳 |
| AIDORA 화면 속 Icon(검색·언어·계정·장바구니) | aidora#ui-* | `2025:9215` 등 | SVG | NEEDS RIGHTS CHECK — Icon Set 출처 미확인 | 여러 곳 |
| TJ MEDIA Case Study의 이미지 | tj-media | 이름 붙은 이미지 Node 115개 | JPG/WebP | **NEEDS RIGHTS CHECK** — 현행 tjmedia.com 화면 캡처(타사 사이트), Album Art 형태 이미지 포함. `archive/legacy-figma-automation/legal/image-provenance-todo.md`에 출처 미확인 TODO 8건이 남아 있다 | 여러 곳 |
| ASICS KOREA Case Study의 이미지·Vector | asics-korea | Instance 207, Vector 23, 이미지 Fill 미집계 | JPG/WebP/SVG | **NEEDS RIGHTS CHECK** — ASICS 브랜드명·현행 사이트 캡처 가능성, 제품 이미지는 AI 생성 컨셉으로 기록되어 있음 | 여러 곳 |
| Tool Card의 기호(Ps, Ai, F, N, ✦) | index#profile | `2025:7229` 등 | Text(이미지 아님) | SAFE — 제품 로고가 아니라 글자로 표기되어 있다 | — |
| Video / Animation | — | 없음 | — | — | — |

권리 분류는 후보 판단이며 승인이 아니다. 실제 승인은 `rights-auditor`가 `assets/manifest.jsonl`에서 한다.

## 10. Responsive Strategy
**CASE C — Desktop만 존재. RESPONSIVE DESIGN GAP.**
- 모든 Frame이 1920 폭 하나다. Tablet·Mobile Frame은 `포트폴리오` 안에 없다.
- 1920보다 좁은 Desktop(예: 1440, 1280)의 모습도 정해져 있지 않다.
- index의 세 Section은 고정 1920 × 1080 Slide 구성이고, Case Study는 고정 폭 위에 조밀하게 짜인 Layout이다.
- Mobile·Tablet 디자인을 임의로 완성하지 않는다. 최소 전략은 G3에서 제안하고 승인을 받는다.

## 11. Interaction Strategy
**INTERACTION GAP.**
- 읽기 도구로 확인된 Prototype 연결, Hover/Active 상태 변형, Motion 단서가 없다.
- Figma에 없는 Interaction을 추가하지 않는다. 필요한 최소 동작은 Page 이동 링크뿐이며 그것도 G1 결정에 달려 있다.
- AIDORA 결과 화면 안의 버튼·메뉴·입력란(장바구니, Subscribe 등)은 쇼핑몰 UI의 일부다. 동작하게 만들지 여부는 Scope Uncertain 항목이다.

## 12. Accessibility Considerations
- cover의 필기체(`--font-script`)와 넓은 자간의 작은 대문자 Label은 가독성을 확인해야 한다(값은 바꾸지 않는다).
- profile의 `--color-profile-muted` 글자와 어두운 바탕의 대비, contents의 회색 Label과 Texture 바탕의 대비는 Render 후 측정한다. FAIL이면 고치지 않고 Design Gap으로 보고한다.
- Texture 배경 위의 글자는 이미지 위에 놓이므로 대비를 Render로 확인해야 한다.
- Case Study를 이미지로 넣을 경우 글자가 이미지 안에 들어가 읽기 도구·검색·확대에서 읽히지 않는다(G2의 핵심 Trade-off).
- 문서 언어는 한국어와 영어가 섞여 있다. `lang="ko"`를 기본으로 한다.

## 13. Design Gaps (Level 3 — 사용자 결정 필요)
| ID | Gap | 왜 임의로 정할 수 없는가 |
|---|---|---|
| **G1** | **Page 구조와 내비게이션이 없다.** 디자인은 하나의 긴 문서이고 Header, Menu, Project로 가는 링크, 돌아오는 방법이 없다 | Page를 나누거나 내비게이션을 더하면 Figma에 없는 UI를 만드는 것이다 |
| **G2** | **Case Study와 AIDORA 결과 화면의 구현 방식.** 약 43개 Section, Text Node 4,100여 개, 조밀한 Diagram과 화면 Mockup으로 된 고정 1920 구성이다 | 전부 HTML로 다시 짜는 것과 이미지로 넣는 것은 작업량, 반응형, 접근성, Figma 호출량이 크게 다르다 |
| **G3** | **Responsive 디자인이 없다**(Desktop 1920 하나). 1920보다 좁은 Desktop 포함 | Mobile·Tablet 화면을 만드는 것은 새 디자인이다 |
| G4 | AIDORA 메인페이지 / 상세페이지가 보여 주는 대상인지 동작하는 Page인지(Scope Uncertain) | G2와 함께 결정 |
| G5 | AIDORA Case Study만 폭이 1600이다(다른 것은 1920) | 의도된 차이로 보고 그대로 구현한다. 통일을 원하면 알려 달라 |
| G6 | `프로필 가안`이라는 Frame 이름 | 초안이라면 최종본 위치가 필요하다 |

## 14. Content Gaps
| ID | 위치 | 내용 |
|---|---|---|
| C1 | index#profile 연락처 | 이메일이 `inbloodi3@gmali.com`으로 적혀 있다. index#cover에는 `inbloodi3@gmail.com`이다. 오탈자로 보이나 고치지 않았다 |
| C2 | index#profile | 전화번호와 생년월일이 그대로 들어 있다. 공개 웹사이트에 실어도 되는지 확인이 필요하다(디자인에 있으므로 기본은 그대로 싣는다) |
| C3 | aidora#ui-* Footer | 고객센터 번호 `1588-0000`, `© 2026 AIDORA` — 가상 브랜드의 가상 정보다. 결과물 화면의 일부로 그대로 둔다 |
| C4 | 전 Page | `<title>`, `<meta name="description">`에 쓸 문구가 Figma에 없다. cover의 "Kim Yun-Gyeom" + "BRAND & WEB DESIGN PORTFOLIO"를 쓸지 확인 필요 |
| C5 | asics-korea | Text Node 이름이 내용이 아니라 Layer 이름(`lane-number`, `label` 등)으로 되어 있어 Metadata만으로 문안을 확인하지 못했다. Node 단위로 읽어야 한다 |

Lorem ipsum, TODO, Sample Text는 `포트폴리오` 안에서 발견되지 않았다(Text Node 이름 검색 기준. ASICS는 C5 때문에 미확인).

## 15. Font Gaps
**FONT IMPLEMENTATION GAP.**
- 확인된 서체: Outfit, Allura, Cormorant Garamond, Noto Sans KR, Pretendard, SUIT. ASICS KOREA Case Study의 서체는 미확인이다.
- 여섯 종 모두 공개 배포되는 서체로 알고 있으나 **이 단계에서 라이선스를 확인하지 않았다.** Self-host하려면 `rights-auditor`가 라이선스와 출처를 `legal/license-evidence.jsonl`에 기록해야 한다.
- Web Font 파일(`woff2`)이 저장소에 없다. 확보 방법이 필요하다: 사용자가 파일 제공 / 공식 배포처에서 내려받기(승인 필요) / 외부 Font Host 사용(Level 3).
- 한글 서체 2종(Noto Sans KR, Pretendard)과 SUIT는 파일이 크다. index에는 Noto Sans KR이 이름과 연락처 몇 줄에만 쓰인다. 서체를 바꾸지 않는다.
- Variable Font 여부, Subset 가능 여부는 파일 확보 후 확인한다.

## 16. Implementation Judgements (디자인이 정하지 않아 구현에서 정하는 것)
| 항목 | 판단 | 이유 |
|---|---|---|
| profile 바탕의 Gradient 두 겹 | 단색으로 구현 | 결과 모습이 같다 |
| Texture 배경 이미지의 미세한 초과 크기(폭 100.79%) | `object-fit: cover`로 Section을 덮게 구현 | 1920에서 같은 모습 |
| Tool Card 기호 | Text로 구현(이미지 아님) | Figma에서도 Text다 |
| Contents 항목의 Capitalize, Label의 Uppercase | 원문 Text는 그대로 두고 CSS `text-transform`으로 표현 | Figma가 Text 변형으로 처리하고 있다 |
| 단위 | Token Source의 px 값을 그대로 옮기고, `rem`을 쓰더라도 1920에서 Render 크기가 같게 한다. `clamp()`는 G3 결정 전에는 쓰지 않는다 | Unit Policy |
| 숨김 Layer | 구현하지 않는다 | 숨김 상태 |

## 17. Build Order
1. SITE SCAFFOLD — `extracted-tokens.json` → `docs/css/tokens.css`, 골격. (완료 2026-10-04)
2. **Master Experience = Loading → index#cover.** (완료 2026-10-04 — 20절)
3. index#profile (구현 2026-10-04 — 22절. 2026-10-09 사진 없는 구성 + Sheet 전환 — 24절) → index#contents (구현 2026-10-09 — 25절).
4. Project Page는 G2 결정 후: aidora → tj-media → asics-korea 순(Contents 순서).
5. Interaction(링크) → FULL QA.

Font와 Asset(Texture, 프로필 사진)이 승인되지 않으면 index도 Figma와 같은 모습으로 Render할 수 없다. SITE SCAFFOLD 전에 필요하다.

## 18. Loading Experience (사용자 지정 Interaction — Figma에 없음)
- **Visual**: Cover와 같은 면(`l-sheet`: 종이 바탕, 왼쪽 띠, 같은 좌우 여백)을 그대로 쓴다. 그 위에 세 요소만 둔다: 왼쪽 Label "Loading"(Cover의 직함 줄과 같은 양식 — `--text-cover-caption-*`), 오른쪽 진행률 숫자(Cover의 연도와 같은 양식 — `--text-cover-year-*`), 그 아래 가는 선(Cover 연도 위의 짧은 선과 같은 굵기 `--size-cover-year-rule-height`, 바탕 선 색은 `--color-contents-rule`). 세로 위치는 화면 가운데이며 띠의 돌출부와 같은 높이다.
- 문구 "Loading"은 Figma에 없는 유일한 글자다(사용자가 허용한 Minimal status text).
- **Progress**: 실제 준비 상태에 연결한다. HTML 해석 완료 30 → Font 준비(`document.fonts.ready`) 70 → 첫 화면 필수 이미지(`img[data-critical]`, 지금은 없음) 90 → `window load` 100. 화면의 숫자와 선은 목표값을 따라 부드럽게 올라가며 줄어들지 않는다. 일부러 늘린 대기 시간은 없다. 4초가 지나면 무조건 100으로 간다.
- **전환**: 100이 되면 `<html>`의 `is-loading`이 `is-loaded`로 바뀐다. Loading 요소가 옅어지고(`--duration-loader-out`), 조금 뒤(`--delay-reveal`) Cover의 글자가 아래에서 제자리로 올라오며 차례로 나타난다(`--duration-reveal`, `--stagger-reveal`, 이동 거리 `--distance-reveal`). 종이와 띠는 두 화면이 같아서 움직이지 않는다. 쓰는 속성은 `opacity`와 `transform`뿐이다.
- **Reduced Motion**: 이동 거리 0, 전환 시간 1ms, 진행률은 목표값으로 바로 간다.
- **JavaScript 없음 / 실패**: Loading 상태는 `<head>`의 한 줄 Script가 켠다. JavaScript가 꺼져 있으면 Loading 화면이 나타나지 않고 Cover가 바로 보인다. `main.js`가 실패하면 CSS Animation이 8초 뒤에 Loading 화면을 걷고 글자를 보이게 한다. Loading 화면은 `pointer-events: none`이라 어떤 경우에도 조작을 막지 않는다.
- 재방문 시 건너뛰기 같은 Session Logic은 넣지 않았다.

## 19. Cover 구현 기록 (2026-10-04)
### Implementation Judgements (추가)
| 항목 | 판단 | 이유 |
|---|---|---|
| 단위 | Token을 단위 없는 "Figma px" 숫자로 두고 `--px`를 곱해 쓴다. `--px`는 1920 이상에서 정확히 1px | 1920에서 Figma와 같은 Render 크기를 보장하고, 좁은 화면에서는 구성 전체를 같은 비율로 줄인다(`clamp()` 미사용) |
| 1024–1919 폭 (1440 포함) | Cover 구성을 화면 폭에 비례해 줄인다. 16px 이하의 작은 글자(직함 줄, 연도, 연락처)는 줄이지 않는다 | Figma에 디자인이 없다. 구성·위계를 그대로 유지하는 가장 보수적인 대응. 작은 글자는 줄이면 읽을 수 없다 |
| 600–1023 폭 (768 포함) | 같은 구성. 제목 "Portfolio"가 화면 폭에 맞도록 기준 폭을 바꾼다(`--sheet-scale-base-tablet`), 좌우 여백은 `--layout-sheet-padding-*-tablet` | 제목이 잘리지 않고 한 줄을 유지 |
| 600 미만 (390 포함) | 같은 구성·같은 순서. 기준 폭 `--sheet-scale-base-mobile`. 필기체와 이름에 최소 크기를 두고, 직함 줄은 한 단계 작게(`--text-small-*-mobile`), 제목 묶음 높이는 고정하지 않는다 | 축소판이 되어 읽을 수 없게 되는 것을 막는다. 콘텐츠 삭제·새 요소 없음 |
| Cover 높이 | 화면 높이(`100svh`)를 채운다. 안쪽 영역은 화면 높이에서 위아래 `--layout-cover-frame-margin`을 뺀 높이 | Figma의 1080 높이 안 950 영역 구성. 1920 × 1080 화면에서 Figma와 같다 |
| 종이 Texture | 단색 `--color-cover-paper`와 CSS로 그린 띠(`--color-cover-band`, 돌출부 좌표 `--layout-cover-band-*`)로 대신한다 | ASSET GAP. Texture 이미지의 권리가 확인되지 않았다. 색과 띠 모양은 Figma Render에서 실측했다. 종이 질감(Grain)은 없다 |
| 이메일 | 링크가 아닌 Text로 둔다 | Figma에 링크 표시가 없다 |
| `<title>`, description | cover의 글자를 조합해 "Portfolio — Kim Yun-Gyeom", "Kim Yun-Gyeom — Brand & Web Design Portfolio"로 넣었다 | Content Gap C4. 확정이 아니다 |
| Favicon | 빈 Icon(`data:,`) | Figma에 없다. 404 요청을 막기 위한 것 |

### Font / Asset 상태
- **Outfit Regular·Light**: 사용자 PC에 설치된 TTF를 Self-host했다(SIL OFL 1.1, 근거는 Font 파일의 name table — `legal/license-evidence.jsonl`, `assets/manifest.jsonl`에 APPROVED).
- **FONT GAP — Allura, Cormorant Garamond**: 파일이 이 PC와 저장소에 없다. CSS에는 두 서체 이름을 지정해 두었고, 지금은 Browser의 기본 필기체·Serif로 대신 그려진다. 대체 서체를 확정한 것이 아니다. 파일이 들어오면 `@font-face`만 추가하면 된다.
- **ASSET GAP — 종이 Texture**: Figma의 이미지 Fill(사진 한 장: 종이 질감 + 왼쪽 검은 띠)이다. 출처를 알 수 없어 `docs/`에 넣지 않았다.

### 1920 Figma 대비 (실측, px)
| 요소 | 위치 차이 | 비고 |
|---|---|---|
| 연도와 짧은 선 | 0 | 일치 |
| 직함 줄 | x 0, y −1 | 일치 |
| 이메일·지역 | x −1, y 0 | 일치 |
| 제목 "Portfolio" | x 0, 폭 0, y +6 | 크기·자간·좌우 위치 일치. 세로 6px 차이는 위아래 두 줄(필기체, 이름)이 대체 서체로 그려져 줄 높이가 달라진 영향으로 본다. 두 서체가 들어온 뒤 다시 측정한다 |
| 필기체 "Design with clarity." | 비교 불가 | FONT GAP |
| 이름 "Kim Yun-Gyeom" | 위치 일치, 글자 모양·폭 다름 | FONT GAP |
| 왼쪽 띠 | 폭·돌출부 좌표 일치 | 질감 없음(ASSET GAP) |
| 종이 바탕 | 평균색 일치 | 질감 없음(ASSET GAP) |

## 20. Visual Gap Resolution (2026-10-04) — 19절의 Font / Asset 상태와 1920 대비를 대체한다
### 사용자 결정
- Allura Regular, Cormorant Garamond Medium을 Google Fonts 공식 Source(또는 그것이 명시하는 공식 upstream)에서 받아 Self-host한다. CDN과 Google Fonts CSS는 쓰지 않는다.
- Figma의 종이 Texture Image Fill은 출처 미확인이므로 **REFERENCE ONLY**다. 사이트에는 프로젝트 안에서 새로 만든 Texture(**INTERNAL_CREATED**)를 쓴다. 검은 띠는 Texture에 넣지 않고 CSS로 그린다.

### Font
| 서체 | 파일 | Source | 근거 |
|---|---|---|---|
| Allura Regular (400) | `Allura-Regular.ttf` | google/fonts `ofl/allura` | OFL.txt 원문, METADATA.pb, Font name table |
| Cormorant Garamond Medium (500) | `CormorantGaramond-Medium.woff2` | 공식 upstream CatharsisFonts/Cormorant `fonts/webfonts` | google/fonts에는 Variable Font(1.2MB)만 있어 upstream의 Static Medium을 썼다. OFL.txt 원문 2부, upstream TTF의 name table(Version 4.003) |
| Outfit Regular·Light | 기존 파일 유지 | 사용자 PC 설치본 | google/fonts `ofl/outfit/OFL.txt` 원문을 추가로 보존 |

모두 SIL Open Font License 1.1이다. License 원문은 `legal/licenses/`와 `docs/assets/fonts/OFL-*.txt`에 있다.

### Paper Texture
- 생성기: `scripts/assets/make-paper-texture.py`(Pillow, 고정 Seed). 다섯 크기의 얼룩(고운 Grain, 작은 얼룩, 세로 섬유 결, 뭉침, 넓은 밝기 변화)을 섞은 이음매 없는 Tile.
- `paper-texture.webp`(512², 종이)와 `paper-texture-dark.webp`(256², 띠 안쪽 질감). 둘 다 `l-sheet`가 깔기 때문에 Loading 화면과 Cover의 바탕이 같다.
- Figma Render는 눈으로 보는 기준과 통계 기준으로만 썼다(Pixel 복사 없음).

### 1920 Figma 대비 (실측, px)
| 요소 | Figma (x, y, 폭) | Browser | 차이 |
|---|---|---|---|
| 필기체 "Design with clarity." | 185, 303, 414 | 185, 303, 414 | 0 |
| 제목 "Portfolio" | 200, 463, 918 | 200, 464, 918 | y +1 (Font 교체 전 +6 → 대체 서체의 줄 높이가 원인이었다) |
| 이름 "Kim Yun-Gyeom" | 183, 714, 281 | 181, 713, 284 | x −2, 폭 +3 |
| 직함 줄 | 181, 775 | 181, 774 | y −1 |
| 연도 | 1783, 65 | 1783, 65 | 0 |
| 짧은 선 | y 65, x 1790–1819 | 같음 | 0 |
| 이메일·지역 | 1674, 972 | 1673, 972 | x −1 |
| 띠 경계 x (y=100 / 470 / 500–600 / 630 / 900) | 74 / 92 / 107 / 90 / 74 | 74 / 92 / 107 / 91 / 74 | 0–1 |
| 띠 안쪽 밝기 (평균 / 편차) | 38.7 / 6.0 | 38.3 / 6.2 | — |
| 종이 (평균색 / 편차) | 226.6, 225.2, 223.3 / 1.83 | 227.0, 225.0, 223.0 / 1.79 | — |

### 남은 차이 (고치지 않음)
- 이름의 폭이 약 1% 넓다. Figma가 쓰는 Cormorant Garamond와 upstream Static 파일의 Build가 조금 다를 수 있다. 눈에 띄지 않는 수준(P3)이다.
- Figma의 띠는 사진 속 종이라서 경계에 가는 밝은 선(양각 느낌)과 약간 둥근 모서리가 있다. CSS 띠는 경계가 곧다.
- 종이 질감은 통계는 맞췄지만 무늬 자체는 다르다. Figma 쪽이 섬유 결이 조금 더 가늘고 또렷하다. Tile이 512px마다 반복된다.

## 21. (폐기) 종이 한 장이 옆에서 들어오는 방식 — 23절로 대체됐다. 세로 그림자가 화면을 지나가는 Wipe처럼 보여 사용자가 폐기했다
- **개념**: Loading → 종이 한 장이 오른쪽에서 들어온다 → 왼쪽 띠(Binding) 아래에 안착한다 → Cover 글자가 나타난다.
- **구조**: `.cover__sheet`는 Cover 위에 겹친 종이 Layer다(같은 질감 Tile). 띠(`l-sheet::before`)는 그 위에 있고 Loading부터 끝까지 움직이지 않는다. 종이의 왼쪽 가장자리에 그림자(`--shadow-sheet-edge`)와 가는 밝은 선(`--color-sheet-edge`)이 있어 같은 종이 위를 지나가는 것이 보인다. 멈춘 뒤에는 바탕과 같은 위치에 같은 질감이 놓여 겹친 것이 보이지 않는다.
- **시간**(Loading 종료 = 0): Loading 글자·선 사라짐 `--duration-loader-out` → `--delay-sheet` 뒤 종이 진입 `--duration-sheet`(`--ease-sheet`, 튕김 없음, 시작 위치 `--sheet-enter-offset` = 화면 오른쪽 바깥, 불투명도 `--sheet-enter-opacity` → 1) → `--delay-reveal`부터 글자가 `--stagger-reveal` 간격으로: 필기체 문구 → 제목 → 이름 → 직함 줄 → 연도 → 연락처. 글자는 `--distance-reveal`만큼 아래에서 올라온다.
- 쓰는 속성은 `transform`과 `opacity`뿐이다. Rotation, 3D, 튕김, Library 없음.
- **Reduced Motion**: 종이 이동 없음(`--sheet-enter-offset: 0%`), 글자 이동 없음, 짧은 Fade만.
- **JavaScript 실패**: 8초 뒤 CSS가 종이와 글자를 제자리에 둔다.
- Loading이 기다리는 대상을 Cover에 필요한 것(`<head>`에서 preload한 Font 4개와 Texture 2개)으로 한정했다. 아래쪽 Section의 Font는 기다리지 않는다.

## 22. Profile 구현 기록 (2026-10-04)
### 사용자 결정
- 이메일의 `gmali.com`은 오탈자이므로 Cover와 같은 `gmail.com`으로 고친다(Content Gap C1 해결).
- 전화번호와 생년월일은 공개 사이트에 싣지 않는다. 빈자리를 다른 내용으로 채우지 않는다(C2 해결).
- 프로필 사진은 본인 사진이고 웹 공개가 승인된 경우에만 쓴다. **아직 그 확인이 없어 사진을 넣지 않았다**(Figma의 사진 틀과 바탕색만 구현).
- Noto Sans KR, Pretendard를 공식 Source에서 받아 Self-host한다(필요한 굵기만).

### 구현
- Figma `2025:7153`의 Auto Layout 구조를 그대로 옮겼다. Component: `history`/`history-item`(변형 `history--detailed`: 설명 줄이 있는 목록), `tool-cards`/`tool-card`, `script-heading`, `keywords`.
- Card와 사진 틀의 테두리는 안쪽 그림자로 그렸다. Figma의 선은 안쪽에 놓이고 여백 계산에 들어가지 않기 때문이다.
- Figma에 없는 정보(숙련도 수치 등)는 넣지 않았다. 문안은 Figma 그대로이며 이메일만 위 결정대로 고쳤다.

### Font
| 서체 | 파일 | 비고 |
|---|---|---|
| Pretendard 400 / 700 | 공식 저장소의 Subset woff2 2개(각 약 270KB) | Figma에는 Light(300)도 있으나 생년월일에만 쓰여서 받지 않았다 |
| Noto Sans KR 400–700 | Google Fonts가 만들어 준 글자 Subset 1개(9.6KB) | 이름과 이메일에 쓰이는 글자만 들어 있다. 글자가 바뀌면 다시 받아야 한다 |
| Outfit 600 | 사용자 PC 설치본 | Tool Card 기호 |
| SUIT | 받지 않음 | Profile에서 쓰이지 않는다 |

### Responsive (Figma에 디자인 없음 — Implementation Judgement)
| 폭 | 대응 |
|---|---|
| 1440 이상 | Figma 구성을 화면 폭에 비례해 줄인다. 글자도 함께 줄어든다(1440에서 본문 12px). 줄이지 않으면 기간·이름 칸이 맞지 않아 구성이 깨진다 |
| 600–1439 | 한 단으로 쌓는다: 사진 옆에 이름·연락처 → 한 줄 소개 → 네 묶음(폭이 허락하면 두 칸). 글자 크기는 Figma 값 그대로 |
| 600 미만 | 전부 한 줄에 하나씩. 이력은 기간 아래에 이름. Tool Card는 줄바꿈 |
순서 변경, 내용 삭제, 새 요소 없음.

### 1920 Figma 대비 (실측, px)
- Card·사진 틀·모든 Text의 x 위치: 차이 0–1.
- Text의 y 위치: 기간 0, 이력 이름 +1, 필기체 제목·이름·Tool Card 글자 +2. 서체별 세로 Metric 처리 차이로 본다(고치지 않음, P3).
- 사진 아래 영역: Figma에는 생년월일 줄과 전화번호 줄이 있어 이름 블록과 연락처가 더 길다. 삭제 결정에 따라 이메일 줄이 전화번호 자리에 온다.

## 23. Cover Entry Motion — Folder가 책상에 놓인다 (2026-10-04, 사용자 지정. 18절의 Visual·전환과 21절을 대체한다)
- **개념**: "포트폴리오 파일 하나를 책상 위에 내려놓는다." 띠(Binding)와 종이를 따로 움직이지 않고 **하나의 물체(`portfolio-folder`)**로 다룬다.
- **구조**
  ```
  portfolio-stage      책상(`--color-stage`). Folder가 들어오는 동안에만 가장자리에서 보인다
    loader             Folder가 놓이기 전의 빈 책상 위에 뜨는 Loading 표시
    portfolio-folder   파일 한 권. 종이 바탕 + 그림자. 이 요소 하나가 움직인다
      binding          왼쪽 띠(이전의 `l-sheet::before`)
      sheet-stack      종이 묶음
        cover (sheet)  지금은 Cover 한 장
  ```
  뒤에 Profile·Contents를 Sheet로 넣을 수 있는 구조다. 그때는 Folder를 다시 움직이지 않고 Sheet만 바꾼다(이번에는 구현하지 않았다). 현재 Profile은 Stage 아래의 일반 Section으로 남아 있다.
- **Loading 화면이 바뀌었다**: Folder가 나중에 놓이려면 그 전에는 책상만 보여야 한다. 그래서 Loading은 종이 위가 아니라 **빈 책상(Stage 색) 위**에 뜬다. 배치·서체·크기·진행 방식은 그대로이고 색만 어두운 바탕에 맞췄다(Profile의 글자색 Token 사용). 띠는 Folder의 일부이므로 Loading 중에는 보이지 않는다.
- **동작**(Loading 종료 = 0, `layout.css`의 `folder-land`. 2026-10-04 "가볍게 던져 놓는다"로 조정)
  | 구간 | 시간 | 모습 |
  |---|---|---|
  | 100% 유지 | Loading 종료 전 100ms | |
  | Loading 글자·선 사라짐 | 0 – 200ms | 고르게 옅어진다 |
  | approach | 60 – 약 640ms | Loading이 사라지는 도중에 시작한다(빈 책상만 보이는 틈 없음). 오른쪽 위 멀리(`--folder-start-x/y`)에서 기울고(`--folder-start-rotate`) 작은(`--folder-start-scale`) 상태로 나타나 다가온다. 처음 보일 때 화면의 약 64%를 덮는다. 그림자는 넓고 흐리다가(`--shadow-folder-floating`) 가까워지며 좁아진다(`--shadow-folder-near`) |
  | landing | 약 640 – 740ms | 책상에 닿아 제자리를 아주 조금 지나친다(`--folder-landing-x/y/rotate/scale`). 짧고 가까운 그림자(`--shadow-folder-landing`) |
  | settle | 약 740 – 850ms | 제자리. 얕은 그림자(`--shadow-folder-settled`). 되튀지 않는다 |
  | 글자 등장 | 약 750ms부터 | settle 도중에 필기체 문구가 시작 → 제목 → 이름·직함 → 연도·연락처(`--stagger-reveal` 간격) |
  Page 진입부터 전체 완료까지 약 2.6초.
- 멈춘 뒤의 화면은 Figma Cover와 같다(1920 재측정: 제목 0px, 나머지 0–1px).
- **Reduced Motion**: 이동·회전·축소 없이 짧은 Fade. **JavaScript 실패**: 8초 뒤 Folder와 글자가 보인다. **JavaScript 꺼짐**: Loading 없이 Cover가 바로 보인다.
- 쓰는 속성: `transform`, `opacity`, `box-shadow`. Library 없음.

## 24. Photo-less Profile + Sheet Transition (2026-10-09, 사용자 지정. 22절의 사진 관련 내용과 Responsive 표의 "사진 옆에" 부분, 23절의 "현재 Profile은 Stage 아래의 일반 Section" 부분을 대체한다)
### 사용자 결정
- **프로필 사진을 쓰지 않는다.** Figma에 사진이 있어도 Export·다운로드·연결하지 않고, 다른 사진·Placeholder·생성 이미지로 대신하지 않는다. 사진 틀도 두지 않는다. 승인된 Website Adaptation이며 Figma와의 Visual Mismatch로 보지 않는다.
- 이메일 오탈자 수정, 전화번호·생년월일 미게재는 22절 그대로다.
- Cover → Profile은 "Folder 안의 종이를 한 장 꺼내면 아래 장이 보인다"로 전환한다. Folder와 띠는 움직이지 않는다.
- 이번 범위에 Contents, Profile → Contents 전환, Project Page는 없다.

### Photo-less Layout (Implementation Judgement)
| 항목 | 판단 | 이유 |
|---|---|---|
| 1440 이상 | Card, 좌우 2단, 단 폭(`--layout-profile-aside-width`), 단 사이 간격(`--space-profile-columns-gap`), 오른쪽 단 전체를 Figma 그대로 둔다. 왼쪽 단은 사진이 빠진 만큼 이름 묶음이 위로 올라와 오른쪽 한 줄 소개와 같은 높이에서 시작한다 | 오른쪽 단의 위치가 Figma와 하나도 달라지지 않는 가장 작은 변경이다. 이름이 위에 오면 왼쪽 단이 "제목 단"으로 읽히고, 위쪽에 빈 사진 자리가 남지 않는다 |
| 이름 묶음 안의 간격 | 이름 → 구분선 → 이메일 사이 간격은 Figma 값(`--space-profile-info-gap`) 그대로 | 생년월일·전화번호 줄만 빠졌다 |
| 1440 미만 | 이름 묶음 → 한 줄 소개 → 네 묶음 순으로 쌓는다(사진 옆 배치 규칙 삭제) | 순서 유지 |
| 사진을 다시 쓰게 될 때 | `.profile__aside` 안, `.profile__info` 앞에 넣는다. 사진 관련 Token(`--layout-profile-photo-*`, `--radius-profile-photo`, `--color-profile-photo-bg`)은 `tokens.css`에 남겨 두었다 | 구조 유지 |
새 문구·그림·Section은 넣지 않았다.

### 함께 고친 구현 결함
- 한 줄 소개의 위아래 선을 Border로 그려 높이가 Figma보다 커져 있었다. 안쪽 그림자로 바꿔 Figma 높이와 맞췄다. 그 아래 요소가 모두 제자리로 올라갔다(22절의 "+2" 차이의 실제 원인).

### 1920 Figma 대비 (실측)
- Card, 한 줄 소개, 필기체 제목 4개, 기간 5개, 이력 이름·설명, Tool Card 5개의 x·y·크기: 차이 0.
- Character 낱말의 x: 뒤로 갈수록 최대 약 2 왼쪽(낱말 폭이 Figma보다 조금 좁다 — 서체 Subset의 글자 폭 차이. 고치지 않음, P3).
- 왼쪽 단: 사진 없음(승인된 차이). 이름 묶음이 단의 맨 위에 있다.
- Figma의 Profile 화면에는 띠가 없다. 사이트에서는 Folder의 띠가 왼쪽에 계속 보인다(아래 "구조"). Card의 왼쪽 여백 안에 들어가며 Card와 겹치지 않는다.

### 구조
```
portfolio-stage
  loader
  portfolio-folder        화면 크기로 고정. Intro 뒤에는 다시 움직이지 않는다
    binding               고정
    sheet-stack           data-active-sheet = 지금 보는 Sheet의 id
      cover   (sheet)     맨 위
      profile (sheet)     그 아래
      (뒤에 올 Sheet)
```
- `main.js`가 실행되면 `<html>`에 `.is-sheets-ready`가 붙고 Sheet들이 같은 자리에 겹친다. Profile은 처음부터 Cover 아래에 그려져 있다.
- 화면보다 긴 Sheet는 그 Sheet 안에서 Scroll된다(768, 390의 Profile).
- Cover의 종이 질감은 Cover 자신의 것이 됐다(`::before`). Folder 바탕과 같은 Tile을 같은 위치에 깔아 놓여 있을 때는 이전과 같게 보인다. 종이를 글자와 다른 Layer에 둔 것은 글자 가장자리 처리(Antialiasing)를 이전 승인 상태와 같게 유지하기 위해서다.
- 좁은 화면에서는 Profile의 왼쪽 여백을 띠 폭만큼 넓혔다(`--binding-width`).
- Sheet는 꺼낸 뒤에도 DOM에 남는다(`.is-extracted`, 화면 밖 + 보이지 않음).

### 동작 (`layout.css`의 `sheet-extract` / `sheet-return`, 값은 `tokens.css`의 "Sheet 전환")
| 구간 | 모습 |
|---|---|
| lift | 종이를 집어 든다: `--sheet-lift-y`, `--sheet-lift-scale`, 그림자 `--shadow-sheet-rest` → `--shadow-sheet-lifted`. 전체 시간(`--duration-sheet-extract`)의 앞부분 |
| extract | 오른쪽 위로 빼서 옆으로 넘긴다: `--sheet-extract-x`, `--sheet-extract-y`, `--sheet-extract-rotate`, `--ease-sheet-extract`(천천히 빼기 시작해 느려지며 끝난다) |
| reveal | Profile에는 따로 등장 효과가 없다. Cover가 비켜나면서 가려져 있던 부분이 드러난다 |
| return | 반대 순서로 Cover를 다시 놓는다(`--duration-sheet-return`) |
- 이동 거리(`--sheet-extract-x`)는 지시서의 예시 범위보다 크다. 예시 범위만큼만 움직이면 Cover가 Profile의 대부분을 계속 가리기 때문에, 화면 폭만큼 비켜나게 했다. 대신 빠르게 날아가지 않도록 시간과 Easing으로 조절했다.
- 쓰는 속성: `transform`, `box-shadow`, 끝에서 `visibility`. Library 없음.

### 입력
| 입력 | 다음 Sheet | 이전 Sheet |
|---|---|---|
| Wheel | 아래로, Sheet의 맨 아래에서 시작한 동작 | 위로, 맨 위에서 시작한 동작 |
| Touch | 위로 쓸어 올림(맨 아래에서 시작) | 아래로 쓸어 내림(맨 위에서 시작) |
| Keyboard | ArrowDown, PageDown, Space | ArrowUp, PageUp, Shift+Space |
- 짧은 Threshold(`main.js`의 `THRESHOLD`). Sheet 안을 Scroll하다 끝에 닿은 것만으로는 넘어가지 않는다(새 동작이어야 한다).
- 전환 중에는 새 전환을 시작하지 않고, 드러나는 Sheet가 미리 Scroll되지 않게 막는다. `animationend`에서 바로 풀린다.
- Intro(Folder가 놓이는 동작)가 끝나기 전에는 넘기지 않는다.
- 전환 뒤 새 Sheet로 Focus를 옮긴다(방향키로 그 안을 Scroll할 수 있게).
- 화면에 "넘기라"는 표시는 넣지 않았다(Figma에 없다).

### Reduced Motion / JavaScript
- Reduced Motion: 들어 올림·이동·회전 없이 짧은 Fade로 바뀐다.
- JavaScript 꺼짐 또는 `main.js` 실패: Sheet가 겹치지 않고 Cover 아래에 Profile이 이어지는 보통 문서가 된다. Profile을 보는 데 Motion이 필요하지 않다.

### Intro Regression (이전 commit과 시점별 Frame 비교)
- Animation·Transition의 이름, 지연, 시간, Easing: 네 폭 모두 이전과 같다.
- 움직이는 구간: Folder 외곽선의 Antialiasing 수준 차이만 있다.
- 멈춘 화면: 글자·배치 차이 없음. 띠의 오른쪽 경계 한 줄(1px 폭)의 Antialiasing이 다르다(종이가 별도 Layer가 된 영향, 눈으로 구분되지 않는 수준 — 고치지 않음).

### 남은 것 / 확인하지 못한 것
- 실제 기기의 Touch 관성, Trackpad 관성은 Emulation으로만 확인했다.
- `main.js`가 `review_threshold_lines`를 넘었다(Loading + Sheet 전환 두 역할). 파일은 나누지 않았다. Contents Sheet를 넣을 때 다시 본다.

## 25. Contents + Profile → Contents (2026-10-09, 사용자 지정)
### 사용자 결정
- Cover → Profile의 구현과 Motion은 승인·확정됐다. 값과 방식을 다시 조정하지 않는다(Regression만 고친다).
- Contents를 세 번째 Sheet로 넣고, Profile → Contents도 같은 방식(lift → extract → reveal)으로 넘긴다. Contents 맨 위에서 위로 넘기면 Profile을 다시 놓는다.
- Project 항목은 나중에 연결할 수 있는 구조만 준비한다. Project Page, 가짜 Page, 임의 URL은 만들지 않는다.

### Source
- Figma `2012:9389`(Section `2012:9390`, 안쪽 `2012:9391`). 이번에 Render 1회, Node 단위 Design Context 1회를 읽었다.
- 참고: 이번에 Metadata를 읽었을 때 `2012:9390`이 하위 Node 없이 반환됐다(Cover의 `2025:7133`도 같다). Design Context와 Render는 정상이고 문안·구조는 지난 Intake의 기록과 같다. 원인은 확인하지 못했다.
- Project 3의 Node ID는 `2016:7129`–`2016:7151`이다(`frame-map.md`의 Component 표는 대표 Node만 적혀 있다).

### 구현
- 구조: 왼쪽 제목 묶음(`contents__heading`: Eyebrow, 필기체 제목)과 오른쪽 Project 목록(`contents__projects`). 반복 Component는 `contents-project`(제목 줄 `__head` = 번호 + 이름 + 분야, 그 아래 `__index` = Caption + Index 4항목)와 `contents-index`(`__column` = 제목 + 두 줄).
- 문안은 Figma 그대로다(Project 3개, 각 Index 4항목). 대문자·Capitalize는 CSS로 표현한다(16절).
- 종이 바탕은 Cover와 같은 것을 같은 방식으로 쓴다(Texture는 20절의 자체 제작 Tile).
- Heading 단계: 제목 `h2`, Project 이름 `h3`, Index 제목 `h4`.
- 각 Project 묶음에 `data-project`(`ia/sitemap.md`의 Page ID)를 달았다. 링크는 아직 없다. Project Page가 생기면 Project 이름을 링크로 감싼다.

### Implementation Judgements
| 항목 | 판단 | 이유 |
|---|---|---|
| 줄 높이 | `--text-contents-*-leading-px`를 쓴다 | Figma는 글줄 높이를 정수로 올림·반올림해 쌓는다. 배수(`-leading`)를 그대로 쓰면 묶음마다 조금씩 어긋나 세 번째 선에서 눈에 보이는 차이가 됐다 |
| 번호의 세로 위치 | Figma의 "이름 줄 위쪽에서 `--space-contents-number-top`만큼 아래"를 여백 계산으로 옮겼다 | 감싸는 요소를 늘리지 않기 위해 |
| Font | Outfit Medium(굵기 500)을 추가했다. 사용자 PC 설치본, 기존 Outfit과 같은 출처·OFL(name table 확인) — `assets/manifest.jsonl`의 `font-outfit-500` | Eyebrow와 Index 제목이 Medium이다. 없으면 Browser가 다른 굵기로 대신 그린다 |
| 1440 이상 | Figma 구성을 화면 폭에 비례해 줄인다(글자 포함) | Profile과 같은 방식. 글자를 줄이지 않으면 Index 4열이 칸에 들어가지 않는다 |
| 1440 미만 | 제목 묶음 → Project 3개 순으로 쌓는다. 글자 크기는 Figma 값 그대로. 번호가 한 줄, 이름과 분야가 다음 줄(좁으면 분야가 그 아래로). Index는 1024 이상 4칸, 그 미만 2칸 | Figma에 디자인 없음. 순서 유지, 삭제 없음 |
| 600 미만의 필기체 제목 | `--text-contents-title-size-mobile` | 390 폭에 들어가는 크기 |
| 좁은 화면의 좌우 여백 | Cover와 같은 값(`--sheet-padding-left/right`) | 띠를 피하고 Cover와 왼쪽 선을 맞춘다 |

### 1920 Figma 대비 (Render에서 실측, px)
- 모든 요소의 x: 차이 0(한 곳 +1).
- 구분선 3개, Index 항목 줄: y 차이 0.
- Project 제목 줄, Caption, Index 제목: y −1. Eyebrow: y −2. 서체의 세로 Metric 처리 차이로 본다(고치지 않음, P3).
- 필기체 제목: 차이 0.

### Sheet 구조와 상태
```
sheet-stack [data-active-sheet = cover | profile | contents]
  cover     맨 위
  profile
  contents  맨 아래(꺼내지 않는다)
```
- `main.js`는 Sheet 수에 묶여 있지 않다(`[data-sheet]`를 문서 순서대로 읽는다). 이번에 고친 곳은 `layout.css`의 겹침 순서 한 줄뿐이다.
- 꺼낸 Sheet는 `.is-extracted`로 남고, 다시 놓으면 `.is-returned`가 된다. DOM에서 지우지 않는다.

### Profile → Contents
- Cover → Profile과 같은 Keyframe·같은 Token을 쓴다(`sheet-extract`, `sheet-return`). 값은 하나도 바꾸지 않았다.
- 한 번의 입력으로 한 장만 넘어간다: Wheel은 한 동작(입력이 끊기기 전까지)에 한 번, Touch는 한 번의 Touch에 한 번, Keyboard는 누를 때마다 한 번(누르고 있는 반복 입력은 무시).
- Sheet 안의 Scroll이 먼저다. 끝(맨 아래 / 맨 위)에서 새로 시작한 입력만 넘긴다.

### 함께 고친 구현 결함
- Sheet가 Focus를 받은 상태에서 꺼내지면 Focus 선이 Sheet 테두리처럼 보였다(이전 commit에서도 Cover를 다시 놓았다가 꺼낼 때 생겼다). Sheet는 Tab 순서에 없는 요소라 Focus 선을 그리지 않게 했다. 링크·버튼의 Focus 표시는 그대로다.

### Regression (이전 commit과 Frame 비교)
- Intro: Animation·Transition의 이름·지연·시간·Easing 동일. 멈춘 화면 차이 없음(최대 1 단계). 움직이는 구간은 Folder 외곽선 Antialiasing 수준.
- Cover → Profile: 시점별 Frame 8장 × 네 폭 모두 차이 없음(최대 1 단계). 시간·들어 올린 값 동일.
- Profile: 배치 변화 없음.

### 남은 것 / 확인하지 못한 것
- 실제 기기의 Touch 관성, Trackpad 관성은 Emulation으로만 확인했다.
- 회색 Label(`--color-contents-label`, `--color-contents-sub`, `--color-contents-number`)과 종이 바탕의 대비는 측정하지 않았다(12절의 확인 항목으로 남아 있다).
- 1440에서 작은 글자가 Figma보다 작게 보인다(비례 축소의 결과, Profile과 같은 판단).

## 26. Contents 한국어 문안 + Project Detail Page (2026-10-12, 사용자 지정. 13절의 G1·G2·G4에 대한 결정이며 25절의 "문안은 Figma 그대로", "링크는 아직 없다"를 대체한다)
### 사용자 결정
- **Contents 문안을 한국어 중심으로 바꾼다.** Project 이름, "Contents", 번호·Index 제목 같은 영문 Label은 그대로 두고, 분야 줄·설명 줄·Index 항목을 한국어로 쓴다. Figma의 Text와 달라지는 승인된 Website Adaptation이다(Figma는 고치지 않는다).
- **G1**: Project마다 별도 Page를 둔다. Contents의 Project 묶음이 링크이고, Project Page에는 Contents로 돌아가는 링크와 이전·다음 Project 링크가 있다.
- **G2 / G4**: Case Study를 Figma의 1920 고정 구성 그대로 옮기지 않는다. 세 Project가 함께 쓰는 **공통 Page 구성**(Overview → Background → Design Approach → Design Showcase → Outcome)에 Figma Case Study의 문안을 옮겨 담는다. 내용이 없는 항목은 지어내지 않고 나중에 채울 자리로 둔다. 검증하지 않은 성과 수치·사용자 테스트 결과를 쓰지 않는다. AIDORA 결과 화면(메인페이지 / 상세페이지)은 동작하는 Page로 만들지 않고 Showcase에서 보여 줄 대상으로 본다.

### Contents 문안
- 분야 줄(`contents-project__category`): Figma의 영문 분야를 한국어로 옮겼다.
- 설명 줄(`contents-project__caption`): Figma의 "PROJECT INDEX · 01—04" 자리에 Project를 한 줄로 설명하는 문장을 넣었다. 문장은 각 Case Study의 표지·개요 문안에서 가져와 줄였다.
- Index 항목(`contents-index__items`): 영문 항목을 한국어로 옮겼다. Index 제목(`01 / RESEARCH` 등)은 영문 Label로 남겼다.
- 한글 문안의 서체는 `--font-kr-body`다. 크기·자간·색 Token은 바꾸지 않았다. 좁은 화면에서 낱말 중간에 줄이 바뀌지 않게 했다.
- 사용자가 준 참고 문구 중 AIDORA의 "퍼블리싱"은 Figma Case Study에서 근거를 찾지 못해 쓰지 않았다(Figma의 표기는 Brand & Web Design, 도구에 VS Code).

### Page 구조와 이동 (Implementation Judgement)
| 항목 | 판단 | 이유 |
|---|---|---|
| Route | Project마다 HTML 파일 하나(`ia/sitemap.md`) | Build 없는 정적 사이트에서 직접 접근·새로 고침·뒤로 가기·앞으로 가기가 Browser 기본 동작으로 된다. JavaScript Router를 두지 않는다 |
| 공통 Template | 세 파일의 HTML 구조가 같고 Style은 `docs/css/pages/project.css` 하나다. 내용은 각 HTML에 직접 쓴다 | 내용을 JavaScript로 넣지 않는다(JS 없이 읽혀야 한다). Project별 내용은 그 파일만 고치면 된다 |
| Contents의 링크 | Project 이름이 링크이고 링크 영역이 묶음 전체를 덮는다 | 묶음 어디를 눌러도 이동한다. 모양은 그대로이고 가리키거나 Focus를 받으면 이름에 밑줄 |
| Contents로 돌아오기 | 링크 대상은 index의 `#contents`다. 주소에 Sheet의 id가 있으면 Loading과 Folder 동작 없이 그 Sheet에서 시작하고, 앞의 Sheet들은 이미 넘겨 둔 상태(`.is-away`)가 된다 | 돌아올 때마다 Loading을 다시 보게 하지 않는다. 처음 진입(주소에 id 없음)의 Loading → Cover는 그대로다 |
| 주소 갱신 | Sheet를 넘길 때 주소의 `#id`를 바꿔 둔다(History 항목은 늘리지 않는다) | Project Page에서 뒤로 가기를 하거나 새로 고쳤을 때 보던 Sheet로 돌아온다 |
| Page 전환 | Project Page에 들어오면 내용이 아래에서 제자리로 올라오며 나타난다(Cover 글자 등장과 같은 Token). CSS만 쓴다 | 절제된 전환. Library 없음. Reduced Motion에서는 이동 없이 짧은 Fade |

### Project Page 구성
- 바탕은 Cover와 같은 종이, 왼쪽에 같은 띠(곧은 모양, 고정). "Folder에서 꺼낸 종이 한 장을 길게 펼친 모습"이다. 새 Graphic은 없다.
- 색·선·영문 Label 양식은 Contents의 Token을 그대로 쓴다. 제목은 AIDORA Case Study 표지의 제목 양식을 따랐다. 이 Page에만 필요한 값은 `tokens.css`의 "Project Detail Page" 묶음에 있다.
- 크기는 화면 폭에 비례해 줄이지 않는다. 좁은 화면은 한 단, 그다음 Breakpoint부터 기본 정보·Showcase 두 칸, Desktop은 왼쪽 Section Label + 오른쪽 내용.
- Project Page에는 JavaScript가 없다.

### 옮긴 문안의 출처 (Figma Section)
| Project | 읽은 Section | 옮기지 않은 것 |
|---|---|---|
| aidora | cs-cover, cs-pain-point, cs-web-experience | 리뷰 이슈 빈도 Chart(수치), 나머지 Section의 본문, 결과 화면 4종 |
| tj-media | s02-overview, s04-pain-points, s05-ux-strategy, s14-outcome | Proto Persona(AI 생성 인물 이미지 포함), 나머지 Section |
| asics-korea | s02-overview(제목·기본 정보), s04-problem, s05-strategy-flow, s11-outcome | 현재 탐색 구조 Diagram, 제작 방식(AI Automation Process) 묶음, 한계·다음 검증 목록, Decision 본문 |
- 문안은 Figma 그대로 옮겼고 줄바꿈만 풀었다. Section 제목 가운데 Figma에 한국어 제목이 없는 두 곳(aidora의 Background, Design Approach)은 그 Section의 본문을 요약해 붙였다.
- aidora의 기본 정보에는 Figma에 "역할" 항목이 없어 "작업 범위"(Figma의 Output)를 실었다. aidora에는 Outcome에 해당하는 Section이 Figma에 없어 "정리 중"으로 두었다.

### 남은 것
- **Showcase 이미지 없음.** Case Study의 이미지는 모두 권리 미확인(9절)이라 넣지 않았다. 자리(`project-showcase__slot`)와 화면 이름만 있고 "화면 이미지 준비 중"이라고 표시된다. 이미지를 넣으려면 `rights-auditor` 승인이 먼저다.
- Figma Page `05_Portfolio_CaseStudy`가 이번에 Page 목록에 보였다. 읽지 않았다. 이 Page가 Case Study의 최신 원본이면 문안을 다시 맞춰야 한다.
- Project Page의 회색 글자와 종이 바탕의 대비는 측정하지 않았다(12절).

## 27. AIDORA Project Page — 기준 Page (2026-10-12, 사용자 지정. 26절의 aidora 관련 내용을 대체한다)
### 사용자 결정 / 제공 사실
- AIDORA를 Project Page의 첫 기준 Page로 구현한다. 구성은 사용자가 준 흐름(Intro → Brand Concept → Design System → Visual Showcase → Web Design → Project End)을 기본으로 하되 Figma Case Study의 실제 구조가 우선이다.
- 역할 표기 "브랜드 아이덴티티 · 패키지 디자인 · 웹디자인 및 퍼블리싱"은 사용자가 제공한 사실이다(Figma에는 역할 항목이 없다).
- TJ MEDIA, ASICS KOREA는 공통 구조와 진입 경로만 유지하고 다음 단계에서 다듬는다(26절 상태 그대로).

### 구성 (Figma Case Study의 순서를 따른다)
| 순서 | Section ID | 내용 | Figma Section |
|---|---|---|---|
| 1 | intro | 제목, 소개, 역할·산출물·도구·기간 | cs-cover |
| 2 | pain-point | 구매 장벽 네 가지, 표본에 대한 덧붙임 | cs-pain-point |
| 3 | brand-concept | 개념 문장, 이름의 구성(AIDA + AURA = AIDORA) | cs-brand-concept |
| 4 | design-system | Logo Design 설명, Color System(Palette 여섯 색), Typography System | cs-brand-concept 아래쪽(Logo), cs-logo로 등록된 Node(실제 내용은 Color System), cs-color-type(실제 내용은 Typography System) |
| 5 | showcase | Product & Package 설명, 이미지 자리 넷 | cs-product-package |
| 6 | web-design | Web Experience 문장, Main / Collection / Product Detail / Brand Page | cs-web-experience, cs-pdp, cs-brand-page |
| 7 | (project-nav) | Contents, 다음 Project | — |
- `frame-map.md`의 Section 이름 두 곳이 실제 내용과 다르다는 것을 이번에 확인했다(위 표의 4번). `frame-map.md`는 이번에 고치지 않았다.
- 26절에서 붙였던 요약 제목 두 개는 없앴다. Section 제목은 영문 Label 하나이고, 그 아래는 Figma의 문장 그대로다.
- Palette의 색은 사이트의 색이 아니라 보여 주는 내용이다. 값은 `tokens.css`의 `--color-aidora-*`에 있다.
- Outcome에 해당하는 Section은 Figma에 없어 만들지 않았다. Page는 다음 Project 링크로 끝난다.

### 구현 판단
| 항목 | 판단 | 이유 |
|---|---|---|
| Typography System의 SUIT 견본 | 글자("조용히 머무는 향")만 싣고 SUIT로 그리지 않는다(사이트의 한글 서체로 그려진다) | SUIT Font 파일을 받지 않았다(15절). 사이트의 서체 구성을 늘리지 않는다 |
| 리뷰 이슈 빈도 Chart, Desk Research, Positioning | 싣지 않았다 | 수치와 출처 표기가 필요한 자료다(9절). Desk Research와 Positioning은 읽지 않았다 |
| Main Page, Collection Page 설명 | 제목과 이미지 자리만 | 해당 Section(cs-main-page, cs-collection)의 문안을 읽지 않았다 |

### 연결되지 않은 Asset (자리만 있다 — `data-asset` 속성이 연결할 Asset ID 후보)
| 자리 | Figma Node | 상태 |
|---|---|---|
| aidora-logo-wordmark, aidora-logo-symbol | 2025:7585, 2025:7608 (Vector) | 권리 확인 전 |
| aidora-package-01 – 04 | 2025:7716 – 7719 | 권리 확인 전(AI 생성 여부 포함) |
| aidora-web-main, aidora-web-collection | 2025:9178, 2025:10148 | 권리 확인 전 |
| aidora-web-pdp, aidora-web-brand | 2025:9158, 2025:9169 | 권리 확인 전 |
- 저장소에는 AIDORA의 이미지·PDF가 없다. Figma에서 내려받지 않았다(`assets/manifest.jsonl`에 승인된 이미지가 없다).
- 사용자가 준 핵심어 가운데 "Unseen Presence"는 Figma의 서체 견본 문구로 확인되어 그 자리에 실었다. "Quiet Luxury"는 읽은 Section에서 찾지 못해 싣지 않았다.

## 28. AIDORA 이미지 연결 + 문안 보완 (2026-10-12, 사용자 지정. 27절의 "연결되지 않은 Asset" 표와 구성 표의 2·3번, "싣지 않았다" 항목을 대체한다)
### 사용자 확인 (권리)
- 로고 두 개(워드마크, 심볼): 직접 제작, 게시 가능.
- 제품·패키지·공간 이미지: 본인이 AI 도구로 생성. 생성 도구 이름은 받지 않았다.
- 웹 화면 네 개(Main, Collection, Product Detail, Brand): 직접 디자인, 화면 속 아이콘 포함 게시 가능.
- 이 확인을 근거로 `assets/manifest.jsonl`에 열 개를 `user_provided` / Owner Provided로 승인 기록했다(`legal/license-evidence.jsonl`에 진술 기록).

### AIDORA 원본의 위치 (Figma, 읽기만 함)
| 위치 | 내용 |
|---|---|
| `자동화` > `포트폴리오`(이 문서의 기준) | 완성된 Case Study와 결과 화면 네 종. 이번 이미지의 출처 |
| `Page 1` | AIDORA의 작업 과정: 와이어프레임, 패키지 초안, 메인페이지·서브페이지·상세페이지 Section, 로고 과정, Desk Research·Brand Strategy Section의 이전 판, 예전 `포트폴리오` Frame. 최상위 Node 이름만 확인했고 내용은 읽지 않았다 |
| `05_Portfolio_CaseStudy` | TJ MEDIA 작업물과 또 하나의 `포트폴리오` Frame. AIDORA 이름의 최상위 Node는 없다. 그 `포트폴리오` Frame의 내용은 읽지 않았다 |

### 연결한 Asset (모두 `docs/assets/`, 사용처는 aidora)
| Asset ID | Figma Node | 내보낸 방법 |
|---|---|---|
| aidora-logo-wordmark, aidora-logo-symbol | 워드마크·심볼 Vector | SVG. 내보낸 파일에서 표시용 속성 세 개만 지웠다(모양 변화 없음) |
| aidora-package-01 – 04 | cs-product-package의 사진 네 장 | Figma에 놓인 모습 그대로 Render(1배). 세 번째는 Figma에서 잘라 쓴 구도 그대로 |
| aidora-web-main, aidora-web-collection, aidora-web-brand | ui-main, ui-collection, ui-brand | Frame 전체를 Render해 폭을 줄였다 |
| aidora-web-pdp | cs-pdp에 쓰인 전체 화면 이미지 | Image Fill 원본. ui-pdp는 Header·Main·Footer가 따로 놓여 있어 한 번에 Render할 Node가 없다 |
- 사진과 화면은 WebP로 바꿨다. 새로 만들거나 고친 이미지는 없다.

### 표시 방식 (Implementation Judgement)
| 항목 | 판단 | 이유 |
|---|---|---|
| 패키지 사진 배치 | Figma처럼 넓은 사진 + 좁은 사진이 한 줄(둘째 줄은 반대 순서). 좁은 화면은 한 줄에 하나 | 원본 구도 유지 |
| 한 줄의 높이 맞춤 | 한 줄에 놓인 두 사진의 높이를 맞춘다. 사진 비율이 조금 달라 가장자리가 몇 % 잘린다 | 줄 아래쪽이 어긋나 보이는 것을 막는다. 좁은 화면에서는 자르지 않는다 |
| 웹 화면 | 전체 화면 이미지를 높이가 정해진 틀(`project-screen`) 안에 넣고 그 안에서 세로로 Scroll한다. 틀은 Keyboard Focus를 받는다 | 화면 하나가 매우 길다. 전체를 펼치면 Page가 화면 이미지로만 채워진다. 이미지는 자르지 않는다 |
| Product Detail 화면 | 원래 폭보다 크게 늘리지 않는다 | 원본 해상도가 다른 화면의 절반이다 |
| 로고 | 테두리 있는 자리 안에 원래 색 그대로 | Figma의 Logo Design 묶음과 같은 방식 |
| 지연 로딩 | 모든 이미지 `loading="lazy"`, `width`/`height` 지정 | 첫 화면 밖에 있다 |

### 보완한 문안 (Figma Text 그대로)
| Section | 추가 |
|---|---|
| research (이전 pain-point) | Desk Research: 요지 두 문장, 세계·한국 시장 전망 두 항목(수치와 출처 표기 포함). Pain Point는 같은 Section의 둘째 묶음이 됐다 |
| brand-strategy (이전 brand-concept) | Positioning: 방향 문장과 핵심어 네 개(Genderless, Quiet Luxury, Architectural, Daily Premium). Brand Concept은 둘째 묶음 |
| web-design | Main Page: 설명 두 문장과 영역별 설계 의도 일곱 항목. Collection Page: 설명 한 문장 |
- 싣지 않은 것: 시장 Chart의 그림, Positioning Map의 비교 브랜드 이름, 리뷰 이슈 빈도 Chart, Collection 화면 안의 상품 문안(화면 이미지에 들어 있다), 숨김 Layer.
- Outcome·성과·사용자 테스트는 Figma에 없어 쓰지 않았다.

### 남은 차이
- 패키지 사진은 1배 해상도다. 고해상도 화면에서는 조금 부드럽게 보일 수 있다(Figma의 Image Fill 원본으로 바꾸면 해결되지만 세 번째 사진은 같은 구도로 다시 잘라야 한다).
- Product Detail 화면은 폭이 다른 화면의 절반이다.
- 좁은 화면에서는 웹 화면 속 글자가 작아 읽기 어렵다(전체 구성을 보여 주는 용도).
- AI 생성 이미지의 생성 도구와 약관은 기록되지 않았다(사용자 진술만 있다).

## 29. Project Detail Visual Architecture (2026-10-12, 사용자 지정. 26절의 "Project Page 구성"과 "Page 전환" 가운데 종이·띠·Contents Token에 관한 내용, 28절 "표시 방식"의 로고 항목을 대체한다)
### 사용자 결정
- **역할을 나눈다.** Cover·Loading·Contents는 포트폴리오의 정체성을 보여 주는 겉이고 그대로 둔다. Project Detail Page는 작품 자체를 보여 주는 자리다. 겉의 장식(종이 질감, 왼쪽 띠, 종이색 바탕)을 Project Page에서 반복하지 않는다.
- Project Page의 바탕은 Page 전체가 흰색이다(흰 종이 모양의 틀을 얹지 않는다). 그림자, Card 테두리, 장식 틀을 더하지 않는다.
- 글은 읽기 좋은 폭에 두고, 디자인 결과물은 더 넓게 보여 준다.
- 이번 범위: aidora의 바탕과 폭, tj-media·asics-korea의 바탕 구조, CSS 구조 분리. 두 Project의 내용 재구성과 aidora 웹 화면의 Scroll 방식은 다음 단계다.

### 이전 구조에서 문제가 된 것
- 26절에서 Project Page를 "Folder에서 꺼낸 종이 한 장"으로 정하고 Cover의 종이 바탕과 띠를 그대로 깔았다. Project Page의 색·선·Label·움직임도 Contents와 Profile의 Token을 직접 썼다. 그래서 작품(밝은 제품 사진, 흰 화면)이 회색 종이 위에 놓였고, 겉의 디자인을 바꾸면 Project Page도 함께 바뀌는 구조였다.
- Section이 "왼쪽 Label + 오른쪽 내용" 두 단이어서 넓은 화면에서도 이미지가 Page 폭의 3/4만 썼다.

### 분리 방식
| 층 | 내용 |
|---|---|
| 읽는 파일 | Project Page는 `tokens.css`, `base.css`, `css/pages/project.css`만 읽는다. index가 쓰는 `layout.css`, `components.css`는 읽지 않는다 |
| Token | `tokens.css`에 "Project Detail Page" 묶음(`--*-project-*`)을 따로 두었다. `project.css`는 이 묶음과 서체 Token(`--font-*`)만 쓰고 Cover·Profile·Contents Token은 쓰지 않는다. 두 묶음은 서로 참조하지 않는다 |
| Selector | `project.css`의 모든 규칙은 `.project-page` 아래의 `project-*` Class다. `<body>`의 종이색 바탕(`base.css`)은 `.project-page`가 흰색으로 바꾼다. `base.css`는 고치지 않았다 |
| Project별 분위기 | `<body>`의 변형 Class(`project-page--aidora` 등)가 `--project-surface` 같은 값을 정한다. Page 바탕은 세 Project 모두 흰색이다 |
- 색: 바탕 `--color-project-bg`, 글자 `--color-project-text` / `--color-project-sub` / `--color-project-label`, 선 `--color-project-rule`. 글자와 선의 값은 Figma Case Study의 중립색에서 가져왔다(종이 위에서 쓰던 반투명 선과 회색을 흰 바탕에 맞는 값으로 바꿨다).
- 서체 구성(영문 Outfit, 한글 Pretendard)은 그대로다. 필기체는 Project Page에 쓰지 않는다.

### 폭과 배치 (Implementation Judgement)
| 항목 | 판단 | 이유 |
|---|---|---|
| Page 폭 | `--layout-project-max-width`. 가운데 정렬, 좌우 여백은 폭 구간마다 하나씩 | 사용자가 준 범위 안에서 웹 화면 이미지의 원래 폭과 같은 값을 골랐다. 이미지가 원래 크기보다 늘어나지 않는다 |
| 글의 폭 | 본문·여는 문장·덧붙임 각각 한 줄 길이의 상한(`--layout-project-measure*`) | Page 폭이 넓어져도 글줄이 길어지지 않는다 |
| Section | 모든 폭에서 Label → 내용 순으로 위에서 아래. 두 단 구성을 없앴다 | 이미지·견본·목록이 Page 폭을 다 쓴다. 정렬 기준이 왼쪽 한 줄로 통일된다 |
| Color System 견본 | 넓은 화면에서 여섯 개가 한 줄 | 폭이 넓어져 두 줄이면 견본이 지나치게 커진다 |
| 로고 자리의 바탕 | aidora에서 `--color-aidora-pale-blue-gray` | Figma Case Study의 로고 면 색과 같다. AIDORA의 분위기를 면 색으로만 얹는다 |
| 들어올 때의 움직임 | 그대로(값만 Project 묶음으로 옮겼다) | 절제된 전환 유지 |
- aidora의 글과 이미지 열 개, tj-media·asics-korea의 내용은 바꾸지 않았다. 세 HTML에서 바뀐 것은 읽는 CSS 목록과 `<body>`의 Class뿐이다.

### 확인한 것 (1920, 1440, 768, 390)
- 세 Project Page의 바탕이 흰색이고 띠와 종이 질감이 없다(Render의 화소 값으로 확인).
- aidora의 이미지 폭(1920 기준): 웹 화면은 원래 폭 그대로, 패키지 사진은 이전보다 약 1.4배. 원래 크기보다 늘어난 이미지는 없다.
- index: 수정 전후의 Cover와 Contents Render를 화소 단위로 비교했다. Contents는 네 폭 모두 같고, Cover는 두 폭에서 같고 두 폭에서 제목 글자 가장자리의 1단계 차이뿐이다(Render마다 생기는 Antialiasing 차이).
- 이동(Contents ↔ Project Page, 뒤로·앞으로, 이전/다음, 새로 고침), 가로 Overflow, Console Error, 실패 Request: 문제 없음.

### 남은 것
- tj-media, asics-korea: 바탕과 구조만 바뀌었다. 내용은 26절 상태(Case Study 일부 문안, 이미지 자리 비어 있음)이고 Project 고유의 색·위계는 아직 반영하지 않았다. 변형 Class만 준비되어 있다.
- aidora 웹 화면의 Scroll 틀은 그대로다(사용자가 별도 검토로 남겼다).
- 흰 바탕에서 `--color-project-label` 글자의 대비는 측정하지 않았다.
