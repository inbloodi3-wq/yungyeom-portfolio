# Frame Map

source: Figma `4IjbcMoAkTyWkoacnVAmNe` (UIUXD_김윤겸) · READ ONLY · read_at 2026-10-04
Website Project: Personal Portfolio Website
Figma Page: `자동화` (`1716:2382`)
Figma Root: `포트폴리오` (Section, `2025:7129`, 2120 × 98411) → 유일한 Child `프로세스` (Frame, `2025:7130`, 1920 × 98211)

`ia/sitemap.md`의 Page/Section ID ↔ Figma Node 대응이다. Website 구조 자체는 `ia/sitemap.md`가 원본이다.

## Root 구성 (`프로세스`의 직접 Child, 위에서 아래로 이어 붙어 있음)
| 순서 | Figma Frame | Node ID | y 위치 | 크기 | 분류 |
|---|---|---|---|---|---|
| 1 | 프로필 가안 | `2025:7131` | 0 | 1920 × 3240 | Website UI — Cover / Profile / Contents (1080 높이 3장) |
| 2 | Main | `2025:7299` | 3240 | **1600** × 16878 | Project 01 AIDORA Case Study (13 Section). x=160에 놓여 좌우 160 여백 |
| 3 | 메인페이지 | `2025:9178` | 20118 | 1920 × 9610 | Project 01 AIDORA 결과 화면 — Main Page 전체 |
| 4 | 상세페이지 | `2025:9591` | 29728 | 1920 × 20565 | Project 01 AIDORA 결과 화면 — PDP / Collection(`서브페이지`) / Brand(`브랜드 소개`) |
| 5 | TJ_MEDIA_CaseStudy_Desktop_V2 | `2025:11098` | 50293 | 1920 × 23245 | Project 02 TJ MEDIA Case Study (15 Section) |
| 6 | PORTFOLIO_03_CASE_STUDY_KR | `1986:7083` | 73538 | 1920 × 24673 | Project 03 ASICS KOREA Case Study (11 Section) |

`자동화` Page의 나머지 최상위 Node는 구현 대상이 아니다(아래 "제외").

## Pages
| Page ID | Viewport | Figma Frame | Node ID | Frame 폭 | 비고 |
|---|---|---|---|---|---|
| index | desktop | 프로필 가안 | `2025:7131` | 1920 | Tablet · Mobile 디자인 없음 |
| aidora | desktop | Main + 메인페이지 + 상세페이지 | `2025:7299`, `2025:9178`, `2025:9591` | 1600 / 1920 / 1920 | Page 분리 여부 미확정(Design Gap G1). Tablet · Mobile 디자인 없음 |
| tj-media | desktop | TJ_MEDIA_CaseStudy_Desktop_V2 | `2025:11098` | 1920 | 〃 |
| asics-korea | desktop | PORTFOLIO_03_CASE_STUDY_KR | `1986:7083` | 1920 | 〃 |

## Sections — index
| Section ID | Figma Frame | Node ID | 크기 |
|---|---|---|---|
| cover | 프로필 가안 | `2025:7132` | 1920 × 1080 |
| profile | 프로필 페이지 | `2025:7153` (Card: `2025:7154`) | 1920 × 1080 |
| contents | 프로필 가안 | `2012:9389` | 1920 × 1080 |

## Sections — aidora
### Case Study (`2025:7299`, 폭 1600)
| Section ID | Figma Frame | Node ID | 크기 |
|---|---|---|---|
| cs-cover | Main | `2025:7300` | 1600 × 950 |
| cs-desk-research | Section | `2025:7332` | 1600 × 1080 |
| cs-pain-point | Section - 03. PAIN POINT | `2025:7424` | 1600 × 1080 |
| cs-positioning | Section - 04. BRAND STRATEGY | `2025:7513` | 1600 × 900 |
| cs-brand-concept | Section - 04. BRAND STRATEGY | `2025:7550` | 1600 × 1017 |
| cs-logo | Section | `2025:7611` | 1600 × 950 | ← 실제 내용은 Color System이다(2026-10-12 확인). Logo Design은 `2025:7550`의 아래쪽 묶음(`2025:7577`)에 있다 |
| cs-color-type | Section | `2025:7655` | 1600 × 1080 | ← 실제 내용은 Typography System이다(2026-10-12 확인) |
| cs-product-package | Section - 07. PRODUCT & PACKAGE | `2025:7708` | 1600 × 1080 |
| cs-web-experience | Section | `2025:7720` | 1600 × 1080 |
| cs-main-page | Section - 09. MAIN PAGE / EXPLANATION — NEW | `2025:7737` | 1600 × 3381 |
| cs-collection | Section - 10. COLLECTION PAGE | `2025:7862` | 1600 × 1280 |
| cs-pdp | Section - 11. PDP | `2025:9155` | 1600 × 1600 |
| cs-brand-page | Section - 12. BRAND PAGE | `2025:9166` | 1600 × 1400 |

Section ID의 내용 이름(desk-research 등)은 저해상도 스크린샷의 제목으로 붙였다. 이름 없는 `Section` 4개는 Build 전에 해당 Node를 읽어 확정한다.

### 결과 화면
| Section ID | Figma Frame | Node ID | 크기 |
|---|---|---|---|
| ui-main | 메인페이지 (Header `2025:9179` · Main `2025:9233` · Footer `2025:9490`) | `2025:9178` | 1920 × 9610 |
| ui-pdp | 상세페이지 > Header · Main · Footer | `2025:9592`, `2025:9646`, `2025:10047` | 1920 × 8098 |
| ui-collection | 상세페이지 > 서브페이지 | `2025:10148` | 1920 × 6437 |
| ui-brand | 상세페이지 > 브랜드 소개 | `2025:10789` | 1920 × 6030 |

## Sections — tj-media (`2025:11098`)
| Section ID | Figma Frame | Node ID | 높이 |
|---|---|---|---|
| s01-cover | Section 01 / Cover | `2025:11099` | 1080 |
| s02-overview | Section 02 / Project Overview | `2025:11404` | 988 |
| s03-research | Section 03 / Research & As-Is Analysis | `2025:11441` | 1477 |
| s04-pain-points | Section 04 / User & Pain Points | `2025:11543` | 1619 |
| s05-ux-strategy | Section 05 / UX Strategy | `2025:11598` | 1076 |
| s06-ia | Section 06 / Information Architecture | `2025:11650` | 1040 |
| s07-user-flow | Section 07 / User Flow | `2025:11687` | 741 |
| s08-visual-direction | Section 08 / Visual Direction | `2025:12376` | 2471 |
| s09-exploration | Section 09 / Exploration & Iteration | `2025:12816` | 1602 |
| s10-main-experience | Section 10 / Main Experience | `2025:13430` | 3464 |
| s11-search-flow | Section 11 / Search & Discovery Flow | `2025:13726` | 2668 |
| s12-final-screens | Section 12 / Final Screens | `2025:14133` | 2241 |
| s13-mobile | Section 13 / Mobile Experience | `2025:15412` | 1503 |
| s14-outcome | Section 14 / Outcome & Reflection | `2025:15945` | 794 |
| s15-closing | Section 15 / Closing | `2025:15991` | 480 |

## Sections — asics-korea (`1986:7083`)
| Section ID | Figma Frame | Node ID | 높이 |
|---|---|---|---|
| s01-cover | S01 / Cover | `1986:7084` | 1480 |
| s02-overview | S02 / Overview | `1986:7189` | 1406 |
| s03-korea | S03 / 한국에서 다시 시작하다 | `1986:7932` | 1416 |
| s04-problem | S04 / Problem | `1986:8030` | 1777 |
| s05-strategy-flow | S05 / Strategy & Flow | `1986:8104` | 1545 |
| s06-design-system | S06 / Design System | `1986:8178` | 2390 |
| s07-decision-01 | S07 / Decision 01 | `1987:8287` | 3023 |
| s08-decision-02 | S08 / Decision 02 | `1987:8565` | 3788 |
| s09-decision-03 | S09 / Decision 03 | `1988:8863` | 2821 |
| s10-mobile | S10 / Mobile | `1988:9156` | 2466 |
| s11-outcome | S11 / Outcome & Reflection | `1992:9253` | 2561 |

## Components (index에서 확인된 것)
| Component | Figma Node ID(대표) | 반복 | 변형 |
|---|---|---|---|
| Contents의 Project Group (제목 줄 + Index 4열) | `2012:9397` | 3 | 없음 |
| Contents의 Index Column | `2012:9408` | 12 | 없음 |
| Profile의 History Item (기간 + 이름 + 설명) | `2025:7187` | 5 | 설명 줄 있음 / 없음 |
| Profile의 Tool Card | `2025:7228` | 5 | 없음 |
| Profile의 Section Heading (필기체) | `2025:7184` | 4 | 없음 |

Case Study와 AIDORA 결과 화면의 Component는 아직 읽지 않았다(`implementation-spec.md` Design Gap G2 결정 후).

## Node 규모 (Metadata 기준)
| 영역 | Frame | Text | 그 외 | 숨김 |
|---|---|---|---|---|
| index (Cover·Profile·Contents) | 70 | 38 | 5 | 0 |
| AIDORA Case Study | 1177 | 503 | 79 | 7 |
| AIDORA 메인페이지 | 239 | 103 | 9 | 0 |
| AIDORA 상세페이지 | 880 | 422 | 24 | 0 |
| TJ MEDIA Case Study | 2030 | 2028 | 342 | 25 |
| ASICS KOREA Case Study | 888 | 1113 | 326 (Instance 207 포함) | 0 |

## 제외 — `자동화` Page의 다른 Node (Reference / Existing Work)
| Node | Node ID | 분류 |
|---|---|---|
| 이름 없는 1920×1080 Frame 42개 | `1880:4717` … `1880:5122` | Reference(예전 Slide Layout) |
| AUTORUN_01_WORK | `1889:1910` | Archive(실험 작업) |
| AUTORUN_02_WORK | `1915:1910` | Archive(실험 작업) |
| PORTFOLIO_03_WORK | `1939:1910` | Source Material(ASICS 화면 원본) |
| 00_WRITE_TEST (STEP04) | `1892:1910` | Archive |

다른 Figma Page는 읽지 않았다. Page 목록 조회에서는 `Page 1`(`0:1`) 하나만 반환됐고, `자동화`는 Node ID로 직접 읽었다.
