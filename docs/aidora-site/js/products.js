// AIDORA 공통 상품 데이터 — 화면 HTML에 흩어진 상품 정보를 한 곳에 모은 것.
// 값은 Figma 최종 화면(Collection 기준 표기)에 이미 있는 것만 쓴다. 새 상품 정보를 만들지 않는다.
// 화면마다 값이 달라 아직 결정되지 않은 항목은 null로 두고 pending에 충돌 번호(C1~C10)를 적는다.
// 화면에 보이는 글자는 여전히 각 HTML이 원본이다. 이 파일은 필터·용량 선택이 읽는다.
//
// 필드: id, name(Collection 표기), nameKr, category(Collection 제품군 = 필터 값), type(제품 종류),
//       options[{ label(화면 표기), ml, price(원) }], notes, description,
//       images{ collection, main, pairing, detail }, detail(상세 페이지, 없으면 null), pending{ 필드: 충돌 번호 }
window.AIDORA_PRODUCTS = [
  // ---------- Perfume ----------
  {
    id: 'cold-monolith', name: 'COLD MONOLITH', nameKr: '콜드 모놀리스', category: 'perfume', type: 'Eau De Parfum',
    options: [{ label: '35 mL', ml: 35, price: 125000 }, { label: '75 mL', ml: 75, price: 235000 }],
    notes: null, description: '차가운 구조감 속에 조용히 머무는 향.',
    images: { collection: 'col-perfume-cold.webp', main: 'main-perfume-cold.webp', detail: 'pdp-hero.webp' },
    detail: 'product.html', pending: { notes: 'C3' }
  },
  {
    id: 'still-etude', name: 'STILL ETUDE', nameKr: '스틸 에튀드', category: 'perfume', type: 'Eau De Parfum',
    options: [{ label: '35 mL', ml: 35, price: 125000 }, { label: '75 mL', ml: 75, price: 235000 }],
    notes: null, description: null,
    images: { collection: 'col-perfume-still.webp', main: 'main-perfume-still.webp', pairing: 'pdp-pair-still.webp' },
    detail: null, pending: { notes: 'C3', description: 'C10' }
  },
  {
    id: 'santal-vacance', name: 'SANTAL VACANCE', nameKr: '상탈 바캉스', category: 'perfume', type: 'Eau De Parfum',
    options: [{ label: '35 mL', ml: 35, price: 125000 }, { label: '75 mL', ml: 75, price: 235000 }],
    notes: null, description: null,
    images: { collection: 'col-perfume-santal.webp', main: 'main-perfume-santal.webp', pairing: 'pdp-pair-santal.webp' },
    detail: null, pending: { notes: 'C3', description: 'C10' }
  },
  {
    id: 'blue-velvet-hour', name: 'BLUE VELVET HOUR', nameKr: '블루 벨벳 아워', category: 'perfume', type: 'Eau De Parfum',
    options: [{ label: '35 mL', ml: 35, price: 125000 }, { label: '75 mL', ml: 75, price: 235000 }],
    notes: null, description: null,
    images: { collection: 'col-perfume-blue.webp', main: 'main-perfume-blue.webp', pairing: 'pdp-pair-blue.webp' },
    detail: null, pending: { notes: 'C3', description: 'C10' }
  },

  // ---------- Hand & Body ----------
  {
    id: 'still-etude-air', name: 'STILL ETUDE AIR', nameKr: null, category: 'hand-body', type: null,
    options: [{ label: '150 mL', ml: 150, price: null }],
    notes: null, description: null,
    images: { collection: 'col-hand-still.webp', main: 'main-object-hand-still.webp', pairing: 'pdp-pair-hand.webp' },
    detail: null, pending: { type: 'C1', price: 'C1', notes: 'C1', description: 'C10' }
  },
  {
    id: 'cold-monolith-fluid', name: 'COLD MONOLITH FLUID', nameKr: null, category: 'hand-body', type: 'Hand Wash',
    options: [{ label: '150 mL', ml: 150, price: 52000 }],
    notes: null, description: null,
    images: { collection: 'col-hand-cold.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'still-etude-layer', name: 'STILL ETUDE LAYER', nameKr: null, category: 'hand-body', type: 'Body Wash',
    options: [{ label: '250 mL', ml: 250, price: 78000 }],
    notes: null, description: null,
    images: { collection: 'col-body-still.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'santal-vacance-ritual', name: 'SANTAL VACANCE RITUAL', nameKr: null, category: 'hand-body', type: 'Body Wash',
    options: [{ label: '250 mL', ml: 250, price: null }],
    notes: 'Deep Sandalwood · Meditation · Purify', description: null,
    images: { collection: 'col-body-santal.webp', main: 'main-object-body-santal.webp' },
    detail: null, pending: { price: 'C2', description: 'C10' }
  },
  {
    id: 'blue-velvet-hour-tide', name: 'BLUE VELVET HOUR TIDE', nameKr: null, category: 'hand-body', type: 'Body Wash',
    options: [{ label: '250 mL', ml: 250, price: 78000 }],
    notes: null, description: null,
    images: { collection: 'col-body-blue.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'refill-pouch', name: 'REFILL POUCH', nameKr: null, category: 'hand-body', type: 'Reusable Care System',
    options: [{ label: '500 mL', ml: 500, price: 45000 }],
    notes: null, description: null,
    images: { collection: 'col-refill.webp' },
    detail: null, pending: { description: 'C10' }
  },

  // ---------- Home & Space ----------
  {
    id: 'cold-monolith-atmos', name: 'COLD MONOLITH ATMOS', nameKr: null, category: 'home-space', type: 'Diffuser',
    options: [{ label: '200 mL', ml: 200, price: 78000 }],
    notes: null, description: null,
    images: { collection: 'col-diffuser-cold.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'still-etude-void', name: 'STILL ETUDE VOID', nameKr: null, category: 'home-space', type: 'Diffuser',
    options: [{ label: '200 mL', ml: 200, price: 78000 }],
    notes: null, description: null,
    images: { collection: 'col-diffuser-still.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'blue-velvet-hour-mist', name: 'BLUE VELVET HOUR MIST', nameKr: null, category: 'home-space', type: 'Diffuser',
    options: [{ label: '200 mL', ml: 200, price: 78000 }],
    notes: null, description: null,
    images: { collection: 'col-diffuser-blue.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'still-etude-beam', name: 'STILL ETUDE BEAM', nameKr: null, category: 'home-space', type: 'Candle',
    options: [{ label: '210 g', ml: null, price: 65000 }],
    notes: 'Crisp Linen · Soft Iris · Quiet Studio', description: null,
    images: { collection: 'col-candle-still.webp', main: 'main-object-candle-still.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'santal-vacance-calm', name: 'SANTAL VACANCE CALM', nameKr: null, category: 'home-space', type: 'Candle',
    options: [{ label: '210 g', ml: null, price: 65000 }],
    notes: null, description: null,
    images: { collection: 'col-candle-santal.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'blue-velvet-hour-deep', name: 'BLUE VELVET HOUR DEEP', nameKr: null, category: 'home-space', type: 'Candle',
    options: [{ label: '210 g', ml: null, price: 65000 }],
    notes: 'Blue Iris · Soft Musk · Midnight Air', description: null,
    images: { collection: 'col-candle-blue.webp', main: 'main-object-candle-blue.webp' },
    detail: null, pending: { description: 'C10' }
  },

  // ---------- Gift & Trial ----------
  {
    id: 'discovery-set', name: '5ml Discovery Set', nameKr: null, category: 'gift-trial', type: '4 x 5 mL Eau De Parfum',
    options: [{ label: 'Signature 4 Scents', ml: null, price: 58000 }],
    notes: null, description: null,
    images: { collection: 'col-set-discovery.webp', main: 'main-set-discovery.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'trio-set', name: '35ml Trio Set', nameKr: null, category: 'gift-trial', type: '3 x 35 mL Eau De Parfum',
    options: [{ label: null, ml: null, price: 350000 }],
    notes: null, description: null,
    images: { collection: 'col-set-trio.webp', main: 'main-set-trio.webp' },
    detail: null, pending: { 'options.label': 'C6', description: 'C10' }
  },
  {
    id: 'still-etude-duo-set', name: 'STILL ETUDE Duo Set', nameKr: null, category: 'gift-trial', type: 'Hand & Body Wash Set',
    options: [{ label: 'Layering Experience', ml: null, price: 130000 }],
    notes: null, description: null,
    images: { collection: 'col-set-duo.webp', main: 'main-set-duo.webp' },
    detail: null, pending: { description: 'C10' }
  },
  {
    id: 'quiet-room-set', name: 'Quiet Room Set', nameKr: null, category: 'gift-trial', type: 'Candle & Diffuser Set',
    options: [{ label: 'A Quiet Scent Ritual', ml: null, price: 130000 }],
    notes: null, description: null,
    images: { collection: 'col-set-room.webp', main: 'main-set-room.webp' },
    detail: null, pending: { description: 'C10' }
  }
];
