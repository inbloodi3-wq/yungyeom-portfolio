// AIDORA 장바구니 — PDP "장바구니 담기"와 cart.html(2026-10-26 Phase 2C 승인 시안).
// 저장하는 것은 { id, option(용량 표기), qty }뿐이다. 이름·가격·이미지는 매번 공통 상품 데이터(js/products.js)에서 읽는다.
// 저장 값이 손상됐거나 데이터에 없는 상품·가격이 정해지지 않은 옵션은 버린다. 저장소를 쓸 수 없으면 이 페이지 안에서만 기억한다.
// 주문·결제는 없다(구매하기는 비활성).
(function () {
  var KEY = 'aidora-cart';
  var MAX_QTY = 99;
  var products = window.AIDORA_PRODUCTS || [];
  var memory = [];
  // 일본어 Page(<html lang="ja">)만 일본어 접근성 이름·이름 줄을 쓴다. 그 밖은 기존 한국어 그대로
  // 저장 값({ id, option, qty })은 두 언어가 같아 언어를 바꿔도 장바구니가 그대로다.
  var isJa = /^ja\b/i.test(document.documentElement.lang || '');
  var TEXT = isJa
    ? { qty: 'の数量', minus: 'の数量を減らす', plus: 'の数量を増やす', remove: 'を削除', sub: function (p) { return p.ja && p.ja.nameKana; } }
    : { qty: ' 수량', minus: ' 수량 줄이기', plus: ' 수량 늘리기', remove: ' 삭제', sub: function (p) { return p.nameKr; } };

  function findProduct(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }
  function findOption(product, label) {
    if (!product) return null;
    for (var i = 0; i < product.options.length; i++) {
      var o = product.options[i];
      if (o.label === label && typeof o.price === 'number') return o;
    }
    return null;
  }
  function formatPrice(won) { return won.toLocaleString('en-US') + ' KRW'; }

  // 저장된 목록을 검사해 쓸 수 있는 항목만 남긴다(같은 상품·용량은 합친다)
  function clean(list) {
    var out = [];
    if (!Array.isArray(list)) return out;
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e || typeof e !== 'object') continue;
      if (!findOption(findProduct(e.id), e.option)) continue;
      var qty = Math.floor(Number(e.qty));
      if (!isFinite(qty) || qty < 1) continue;
      var same = null;
      for (var j = 0; j < out.length; j++) if (out[j].id === e.id && out[j].option === e.option) same = out[j];
      if (same) same.qty = Math.min(same.qty + qty, MAX_QTY);
      else out.push({ id: e.id, option: e.option, qty: Math.min(qty, MAX_QTY) });
    }
    return out;
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw === null ? clean(memory) : clean(JSON.parse(raw));
    } catch (e) {
      return clean(memory);
    }
  }
  function save(list) {
    memory = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* 저장할 수 없어도 이 페이지에서는 동작한다 */ }
  }

  // ---------- PDP: 장바구니 담기 ----------
  // 지금 선택된 용량(용량 버튼의 aria-pressed)을 그대로 담는다
  var addButton = document.querySelector('[data-cart-add]');
  if (addButton) {
    var product = findProduct(addButton.getAttribute('data-cart-add'));
    var note = document.querySelector('[data-cart-note]');
    var added = document.querySelector('[data-cart-added]');
    var limit = document.querySelector('[data-cart-limit]');
    // 안내 자리 하나에 셋 중 하나만 보인다: 기본 안내 / 담기 완료 / 최대 수량
    var showNote = function (which) {
      if (note) note.hidden = which !== note;
      if (added) added.hidden = which !== added;
      if (limit) limit.hidden = which !== limit;
    };
    if (product) {
      addButton.disabled = false;
      addButton.addEventListener('click', function () {
        var pressed = document.querySelector('[data-capacity] [aria-pressed="true"]');
        var ml = pressed ? Number(pressed.getAttribute('data-ml')) : NaN;
        var option = null;
        for (var i = 0; i < product.options.length; i++) {
          if (product.options[i].ml === ml && typeof product.options[i].price === 'number') option = product.options[i];
        }
        if (!option) return;
        var list = load();
        // 이미 최대 수량이면 담지 않고, 성공 안내 대신 최대 수량 안내를 보인다
        for (var j = 0; j < list.length; j++) {
          if (list[j].id === product.id && list[j].option === option.label && list[j].qty >= MAX_QTY) {
            showNote(limit);
            return;
          }
        }
        list.push({ id: product.id, option: option.label, qty: 1 });
        save(clean(list));
        showNote(added);
      });
    }
  }

  // ---------- cart.html ----------
  var cart = document.querySelector('[data-cart]');
  if (!cart) return;
  var listEl = cart.querySelector('[data-cart-list]');
  var template = document.querySelector('[data-cart-row]');
  var layout = cart.querySelector('[data-cart-layout]');
  var emptyEl = cart.querySelector('[data-cart-empty]');
  var countEl = cart.querySelector('[data-cart-count]');
  var totalEl = cart.querySelector('[data-cart-total]');
  var heading = cart.querySelector('h1');
  // 상품 이미지 폴더. 행 template의 data-cart-row 값(일본어 Page는 "../assets/"), 비어 있으면 "assets/"
  var assetBase = template.getAttribute('data-cart-row') || 'assets/';

  function render(focus) {
    var list = load();
    save(list);
    listEl.textContent = '';
    var total = 0;
    var items = 0;
    for (var i = 0; i < list.length; i++) {
      var entry = list[i];
      var p = findProduct(entry.id);
      var o = findOption(p, entry.option);
      var row = template.content.firstElementChild.cloneNode(true);
      var image = row.querySelector('img');
      image.src = assetBase + p.images.collection;
      row.querySelector('[data-name]').textContent = p.name;
      var sub = TEXT.sub(p);
      row.querySelector('[data-sub]').textContent = sub ? sub + ' / ' + p.type : p.type;
      row.querySelector('[data-option]').textContent = o.label;
      row.querySelector('[data-line-price]').textContent = formatPrice(o.price * entry.qty);
      row.querySelector('output').textContent = String(entry.qty);
      var label = p.name + ' ' + o.label;
      row.querySelector('[data-qty-group]').setAttribute('aria-label', label + TEXT.qty);
      var minus = row.querySelector('[data-step="-1"]');
      var plus = row.querySelector('[data-step="1"]');
      var remove = row.querySelector('[data-remove]');
      minus.setAttribute('aria-label', label + TEXT.minus);
      plus.setAttribute('aria-label', label + TEXT.plus);
      remove.setAttribute('aria-label', label + TEXT.remove);
      minus.disabled = entry.qty <= 1;
      plus.disabled = entry.qty >= MAX_QTY;
      minus.setAttribute('data-index', i);
      plus.setAttribute('data-index', i);
      remove.setAttribute('data-index', i);
      total += o.price * entry.qty;
      items += entry.qty;
      listEl.appendChild(row);
    }
    countEl.textContent = items + (items === 1 ? ' Item' : ' Items');
    totalEl.textContent = formatPrice(total);
    layout.hidden = list.length === 0;
    emptyEl.hidden = list.length > 0;

    // 다시 그린 뒤 초점을 같은 자리로 돌려놓는다(삭제했으면 다음 행, 없으면 제목)
    if (focus) {
      var target = null;
      if (list.length > 0) {
        var index = Math.min(focus.index, list.length - 1);
        target = listEl.querySelector('[data-index="' + index + '"]' + focus.selector);
        if (target && target.disabled) target = listEl.querySelectorAll('[data-index="' + index + '"]')[2];
      }
      (target || heading).focus();
    }
  }

  listEl.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-index]');
    if (!button || button.disabled) return;
    var index = Number(button.getAttribute('data-index'));
    var list = load();
    if (!list[index]) return render();
    if (button.hasAttribute('data-remove')) {
      list.splice(index, 1);
      save(list);
      render({ index: index, selector: '[data-remove]' });
      return;
    }
    var step = Number(button.getAttribute('data-step'));
    list[index].qty = Math.min(Math.max(list[index].qty + step, 1), MAX_QTY);
    save(list);
    render({ index: index, selector: '[data-step="' + step + '"]' });
  });

  render();
  // 다른 탭에서 담았거나, 뒤로/앞으로 가기로 돌아왔을 때 최신 상태로
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY) return;
    // 목록 안 버튼에 초점이 있었다면 다시 그린 뒤 같은 자리로 돌려놓는다
    var active = document.activeElement;
    var focus = null;
    if (active && listEl.contains(active) && active.hasAttribute('data-index')) {
      focus = { index: Number(active.getAttribute('data-index')), selector: active.hasAttribute('data-remove') ? '[data-remove]' : '[data-step="' + active.getAttribute('data-step') + '"]' };
    }
    render(focus);
  });
  window.addEventListener('pageshow', function (event) { if (event.persisted) render(); });
})();
