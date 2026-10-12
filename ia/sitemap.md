# Sitemap

Website 구조 문서다(두 mode 공통 형식). Figma Node 대응은 `design-source/frame-map.md`에 있다.

**상태: 확정.** (2026-10-12: Project마다 별도 Page, 공통 구성 — `design-source/implementation-spec.md` 26절)

처음 기록: Figma 디자인은 Page 구분과 내비게이션이 없는 **하나의 긴 문서**(Cover → Profile → Contents → Project 01 → 02 → 03)다. 아래 Section 구성은 Figma에 있는 그대로 등록했고, 그것을 어떤 Page(URL)로 나눌지는 Figma에 정해져 있지 않아 사용자 결정을 기다린다(`design-source/implementation-spec.md` Design Gap G1). 표의 `파일` 열은 **제안안**이며 확정이 아니다.

## Pages
| Page ID | 파일(URL / Route) | 목적 | Figma에 있는 근거 |
|---|---|---|---|
| index | `index.html` → `/` | 표지, 프로필, 목차 | 문서의 첫 3장 |
| aidora | `aidora.html` | Project 01 AIDORA — Branding · Package · Web Design | Contents의 PROJECT 01 |
| tj-media | `tj-media.html` | Project 02 TJ MEDIA — AI-Assisted UI/UX · Web Redesign | Contents의 PROJECT 02 |
| asics-korea | `asics-korea.html` | Project 03 ASICS KOREA — AI Automation · Commerce UX Redesign | Contents의 PROJECT 03 |

## Navigation
Figma에 사이트 내비게이션(Header, Menu, 뒤로 가기, Page 사이 링크)은 **없다.** 구조상 내비게이션 역할을 할 수 있는 것은 Contents Section의 Project 목록뿐이다. 아래는 그것을 링크로 쓸 경우의 제안이며 미확정이다.

| 위치 | 순서 | Label | 대상 |
|---|---|---|---|
| index#contents | 1 | PROJECT 01 AIDORA | aidora |
| index#contents | 2 | PROJECT 02 TJ MEDIA | tj-media |
| index#contents | 3 | PROJECT 03 ASICS KOREA | asics-korea |
| Project Page 맨 위·맨 아래 | — | Contents | index#contents |
| Project Page 맨 아래 | — | Previous / Next | 앞·뒤 Project(aidora → tj-media → asics-korea) |

## index
| 순서 | Section ID | 목적 | 콘텐츠 출처 | 우선순위 | Mobile / Tablet / Desktop 비고 |
|---|---|---|---|---|---|
| 1 | cover | 표지: 문구, "Portfolio", 이름, 직함 줄, 연도, 이메일, 지역 | Figma Text | P1 | Desktop 디자인만 있음(1920 × 1080 고정 구성) |
| 2 | profile | 이름, 이메일, 한 줄 소개, Experience, Career, Tools, Character (사진·생년월일·전화번호는 사용자 결정으로 싣지 않는다) | Figma Text | P1 | 1440 이상: Figma의 좌우 2단 Card. 1440 미만: 같은 순서로 쌓기(디자인 없음) |
| 3 | contents | 목차: Project 3개와 각 Project의 Index 4항목 | Figma Text | P1 | 1440 이상: Figma의 좌우 2단. 1440 미만: 제목 → Project 순으로 쌓기(디자인 없음). Project 묶음이 각 Project Page로 가는 링크다. 분야·설명·Index 항목은 한국어(사용자 결정 2026-10-12) |

## Project Page 공통 구성 (aidora, tj-media, asics-korea — 2026-10-12)
실제 Page의 Section은 아래 다섯 개다. 그 아래 aidora / tj-media / asics-korea 표는 Figma Case Study의 Section 목록(문안의 출처)이며 Page의 Section이 아니다.

| 순서 | Section ID | 목적 | 콘텐츠 출처 |
|---|---|---|---|
| 1 | overview | 제목, 소개, 유형·역할(또는 작업 범위)·도구·기간 | Case Study의 표지·개요 |
| 2 | background | 문제와 배경 | Pain Point / Problem Section |
| 3 | approach | 디자인 방향, 구조·흐름 개선 | Strategy Section |
| 4 | showcase | 주요 화면(Desktop·Mobile) | 이미지 권리 확인 전까지 자리만 둔다 |
| 5 | outcome | 결과와 돌아보기 | Outcome Section(aidora는 Figma에 없음 — 정리 중) |

## aidora
**실제 Page의 Section(2026-10-12, Figma Case Study의 순서 그대로)**: intro → desk-research → pain-point → positioning → brand-concept → color-system → typography → product-package → web-design → main-page → collection-page → product-detail → brand-page → live-website(체험 안내). 근거는 `design-source/implementation-spec.md` 31절. 아래 표는 Figma Case Study의 Section 목록이다.

| 순서 | Section ID | 목적 | 콘텐츠 출처 | 우선순위 | 비고 |
|---|---|---|---|---|---|
| 1 | cs-cover | Project 표지와 개요 | Figma Text | P1 | Case Study 폭 1600 |
| 2 | cs-desk-research | Desk Research | 〃 | P2 | |
| 3 | cs-pain-point | Pain Point | 〃 | P2 | |
| 4 | cs-positioning | Positioning | 〃 | P2 | |
| 5 | cs-brand-concept | Brand Concept | 〃 | P2 | |
| 6 | cs-logo | Logo Design | 〃 | P2 | |
| 7 | cs-color-type | Color System, Typography System | 〃 | P2 | |
| 8 | cs-product-package | Product & Package | 〃 | P2 | |
| 9 | cs-web-experience | Web Experience | 〃 | P2 | |
| 10 | cs-main-page | Main Page 설명 | 〃 | P2 | |
| 11 | cs-collection | Collection Page 설명 | 〃 | P2 | |
| 12 | cs-pdp | Product Detail 설명 | 〃 | P2 | |
| 13 | cs-brand-page | Brand Page 설명 | 〃 | P2 | |
| 14 | ui-main | AIDORA Main Page 전체 화면 | 〃 | P1 | 결과물 화면 자체(쇼핑몰 UI) |
| 15 | ui-pdp | AIDORA Product Detail 전체 화면 | 〃 | P1 | 〃 |
| 16 | ui-collection | AIDORA Collection 전체 화면 | 〃 | P1 | 〃 |
| 17 | ui-brand | AIDORA Brand 전체 화면 | 〃 | P1 | 〃 |

## tj-media
**실제 Page의 Section(2026-10-12, Figma Case Study의 순서 그대로)**: cover → overview → research → pain-points → ux-strategy → ia → user-flow → visual-direction → exploration → main-experience → search-flow → final-screens → mobile → outcome → closing. 화면 이미지는 Figma에서 잘라 실었고, 비공식 개인 리디자인이라는 문구를 표지와 맺음에 둔다. 근거는 `design-source/implementation-spec.md` 32·33절. Interactive Screen Explorer(별도 시연 Page)는 아직 없다. 아래 표는 Figma Case Study의 Section 목록이다.

| 순서 | Section ID | 목적 |
|---|---|---|
| 1 | s01-cover | Cover |
| 2 | s02-overview | Project Overview |
| 3 | s03-research | Research & As-Is Analysis |
| 4 | s04-pain-points | User & Pain Points |
| 5 | s05-ux-strategy | UX Strategy |
| 6 | s06-ia | Information Architecture |
| 7 | s07-user-flow | User Flow |
| 8 | s08-visual-direction | Visual Direction |
| 9 | s09-exploration | Exploration & Iteration |
| 10 | s10-main-experience | Main Experience |
| 11 | s11-search-flow | Search & Discovery Flow |
| 12 | s12-final-screens | Final Screens |
| 13 | s13-mobile | Mobile Experience |
| 14 | s14-outcome | Outcome & Reflection |
| 15 | s15-closing | Closing |

## asics-korea
| 순서 | Section ID | 목적 |
|---|---|---|
| 1 | s01-cover | Cover |
| 2 | s02-overview | Overview |
| 3 | s03-korea | 한국에서 다시 시작하다 |
| 4 | s04-problem | Problem |
| 5 | s05-strategy-flow | Strategy & Flow |
| 6 | s06-design-system | Design System |
| 7 | s07-decision-01 | Decision 01 |
| 8 | s08-decision-02 | Decision 02 |
| 9 | s09-decision-03 | Decision 03 |
| 10 | s10-mobile | Mobile |
| 11 | s11-outcome | Outcome & Reflection |

## AIDORA Live Website (2026-10-12)
포트폴리오와 별개의 시연 사이트다(`docs/aidora-site/`). 근거는 `design-source/implementation-spec.md` 30절.

| Page | 파일 | 가는 길 |
|---|---|---|
| Main | `aidora-site/index.html` | aidora의 "View Live Website", Logo |
| Collection | `aidora-site/collection.html` (`#perfume`, `#hand-body`, `#home-space`, `#gift-trial`) | Header Menu, Main의 링크 |
| Product Detail | `aidora-site/product.html` | Collection과 Main의 상품 |
| Brand | `aidora-site/brand.html` (`#philosophy`, `#standard`, `#material`, `#direction`) | Header Menu |
| → aidora | 모든 Page 맨 위의 "← AIDORA Case Study" | aidora#web-design |

## TJ MEDIA Interactive Demo (2026-10-12)
포트폴리오와 별개의 시연이다(`docs/tj-media-demo/`). 근거는 `design-source/implementation-spec.md` 34절.

| Page | 파일 | 가는 길 |
|---|---|---|
| Screen Explorer | `tj-media-demo/index.html` | tj-media의 "리디자인 UI 직접 체험하기", "Interactive Demo 둘러보기" |
| Desktop Main | `tj-media-demo/desktop/main.html` | Explorer, Logo |
| Desktop Search | `tj-media-demo/desktop/search.html` (`?q=` 검색어) | Explorer, Header, Main·Latest의 검색창 |
| Desktop Latest Songs | `tj-media-demo/desktop/latest.html` | Explorer, Header, Main의 더보기 |
| Desktop Music Chart | `tj-media-demo/desktop/chart.html` | Explorer, Header, Main의 더보기 |
| Desktop Song Request | `tj-media-demo/desktop/request.html` | Explorer, Main의 신청하기, Search의 반주곡 신청하기 |
| Desktop Song Detail | `tj-media-demo/desktop/song-detail.html` | Explorer, Search·Main·Chart의 '좋은 날' |
| Mobile Main | `tj-media-demo/mobile/main.html` | Explorer, Logo |
| Mobile Search | `tj-media-demo/mobile/search.html` (`?q=` 검색어) | Explorer, Mobile Main의 검색창 |
| Mobile Song Detail | `tj-media-demo/mobile/song-detail.html` | Explorer, Mobile Search·Main의 '좋은 날' |
| → Explorer | 화면 맨 위의 "← Screen Explorer" | tj-media-demo/index |
| → tj-media | 모든 Page 맨 위의 "TJ MEDIA Case Study" | tj-media#interactive-demo |

## Visual Architecture (2026-10-12)
index(Cover·Profile·Contents)는 포트폴리오의 겉이고, Project Page는 작품을 보여 주는 흰 바탕의 독립된 영역이다. 두 영역은 CSS와 Token을 나눠 쓴다(`design-source/implementation-spec.md` 29절).

## Interactions
| ID | 위치 | 동작 | JS 없이 |
|---|---|---|---|
| loading | index 진입 시 | 빈 책상 위의 Loading 표시 → Portfolio Folder(띠 + 종이)가 오른쪽 위에서 다가와 책상에 놓임 → Cover 글자 등장(사용자 지정, 2026-10-04) | Loading 없이 Cover가 바로 보인다 |
| project-link | index#contents → Project Page → index#contents | Project 묶음을 누르면 그 Project Page로 간다. 돌아오면 Loading 없이 Contents에서 시작한다. Project Page는 내용이 아래에서 올라오며 나타난다(사용자 지정, 2026-10-12) | 보통 링크로 동작한다 |
| sheet-transition | index#cover ↔ index#profile ↔ index#contents | 아래로 넘기는 입력(Wheel, Swipe, 방향키)에 맨 위 종이를 들어 올려 오른쪽 위로 꺼내면 아래 종이가 드러난다. 위로 넘기면 꺼낸 종이를 다시 놓는다. 한 번에 한 장. Folder와 띠는 고정(사용자 지정, 2026-10-09) | Cover, Profile, Contents가 위에서 아래로 이어지는 보통 문서 |

## Open Content Requests
`design-source/implementation-spec.md`의 Content Gaps 참조.
