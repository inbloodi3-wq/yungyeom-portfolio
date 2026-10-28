// AIDORA 시연 사이트의 상호작용 — Collection 제품군 필터·검색, Product Detail 용량 선택. 장바구니는 js/cart.js.
// 상품 값은 js/products.js(공통 상품 데이터)에서 읽는다.
// JavaScript가 없으면 기존 화면 그대로다(필터는 해당 제품군으로 이동하는 앵커, 검색 줄은 숨김, 용량은 75ml 표시).
(function () {
  var products = window.AIDORA_PRODUCTS || [];
  // 일본어 Page(<html lang="ja">)만 일본어 문구·검색 필드를 쓴다. 그 밖은 기존 한국어 그대로
  var isJa = /^ja\b/i.test(document.documentElement.lang || '');
  var TEXT = isJa
    ? { count: function (q, n) { return '「' + q + '」の検索結果 ' + n + '件'; } }
    : { count: function (q, n) { return '“' + q + '” 검색 결과 ' + n + '개'; } };

  function findProduct(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }

  // ---------- Collection 필터 ----------
  // 기존 탭(All/Perfume/…)의 주소(#perfume 등)를 그대로 쓴다. 주소가 바뀌면 그 제품군 상품만 보인다.
  // 카테고리가 데이터에 없는 상품은 어느 제품군에도 넣지 않고 All에서만 보인다.
  var filter = document.querySelector('[data-filter]');
  if (filter) {
    var tabs = filter.querySelectorAll('a[href^="#"]');
    var groups = document.querySelectorAll('[data-filter-group]');
    // 상단 메뉴(GNB)의 제품군 링크. 기존 밑줄(aria-current)을 선택된 제품군에만 둔다. All이면 어느 메뉴도 아니다.
    var nav = document.querySelector('[data-filter-nav]');
    var navLinks = nav ? nav.querySelectorAll('a[href*="#"]') : [];
    var all = filter.getAttribute('data-filter'); // All 탭의 주소(#list)
    var categories = [];
    for (var t = 0; t < tabs.length; t++) {
      var key = tabs[t].hash.slice(1);
      if (key !== all) categories.push(key);
    }

    // 검색: 공통 데이터의 확정 값(영문 이름·한글 이름·종류·노트·설명·제품군 이름)에서 찾는다. 비어 있는(null) 값은 대상이 아니다.
    // 일본어 Page는 한글 이름·설명 대신 ja.nameKana·ja.description에서 찾는다.
    // 제품군 필터와 함께 쓰면 두 조건을 모두 만족하는 상품만 보인다.
    var searchWrap = document.querySelector('[data-search-wrap]');
    var form = document.querySelector('[data-search]');
    var input = form ? form.querySelector('input[type="search"]') : null;
    var countEl = document.querySelector('[data-search-count]');
    var emptyEl = document.querySelector('[data-search-empty]');
    var categoryNames = {};
    var cats = window.AIDORA_CATEGORIES || [];
    for (var c = 0; c < cats.length; c++) categoryNames[cats[c].id] = cats[c].name;
    var category = null;
    var query = '';

    var normalize = function (text) { return String(text).replace(/\s+/g, ' ').trim().toLowerCase(); };
    var searchText = function (p) {
      var ja = p.ja || {};
      var fields = isJa
        ? [p.name, ja.nameKana, p.type, p.notes, ja.description, categoryNames[p.category]]
        : [p.name, p.nameKr, p.type, p.notes, p.description, categoryNames[p.category]];
      var words = [];
      for (var i = 0; i < fields.length; i++) if (typeof fields[i] === 'string') words.push(fields[i]);
      return normalize(words.join(' '));
    };

    var apply = function () {
      var current = category || all;
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].hash.slice(1) === current;
        tabs[i].classList.toggle('is-current', on);
        if (on) tabs[i].setAttribute('aria-current', 'true');
        else tabs[i].removeAttribute('aria-current');
      }
      for (var n = 0; n < navLinks.length; n++) {
        if (category && navLinks[n].hash.slice(1) === category) navLinks[n].setAttribute('aria-current', 'page');
        else navLinks[n].removeAttribute('aria-current');
      }
      var total = 0;
      for (var g = 0; g < groups.length; g++) {
        var items = groups[g].querySelectorAll('[data-product]');
        var shown = 0;
        for (var j = 0; j < items.length; j++) {
          var product = findProduct(items[j].getAttribute('data-product'));
          var match = (!category || (product !== null && product.category === category)) &&
            (!query || (product !== null && searchText(product).indexOf(query) !== -1));
          items[j].hidden = !match;
          if (match) shown++;
        }
        groups[g].hidden = shown === 0;
        total += shown;
      }
      // 결과 개수는 실제로 보이는 카드 수다
      if (countEl) {
        countEl.hidden = !query || total === 0;
        countEl.textContent = query ? TEXT.count(input.value.trim(), total) : '';
      }
      if (emptyEl) emptyEl.hidden = !query || total > 0;
    };

    // 검색어는 주소(?q=)에 남겨 새로고침 뒤에도 같은 결과가 보이게 한다. 앵커(#perfume 등)는 그대로 둔다
    var setQuery = function (value) {
      query = normalize(value);
      apply();
      try {
        var url = new URL(location.href);
        if (query) url.searchParams.set('q', value.trim());
        else url.searchParams.delete('q');
        history.replaceState(history.state, '', url.href);
      } catch (e) { /* 주소를 바꿀 수 없어도 검색은 동작한다 */ }
    };

    // 주소의 앵커가 탭 주소일 때만 필터를 바꾼다(#top 같은 다른 앵커는 바꾸지 않는다).
    // #search(Header 검색 아이콘)는 All에서 검색 입력으로 간다.
    var fromHash = function (scroll) {
      var id = location.hash.slice(1);
      if (id === 'search') {
        category = null;
        apply();
        if (input) {
          input.focus();
          // 다른 페이지에서 #search로 들어오면 브라우저의 앵커 이동이 끝난 뒤 초점이 풀릴 수 있어, 불러오기가 끝나면 한 번 더 둔다
          if (document.readyState !== 'complete') window.addEventListener('load', function () { input.focus(); }, { once: true });
        }
        return;
      }
      if (id !== all && categories.indexOf(id) === -1) {
        if (!id) { category = null; apply(); }
        return;
      }
      category = id === all ? null : id;
      apply();
      // 숨겨져 있던 제품군으로 이동한 경우 브라우저가 위치를 못 잡으므로 다시 맞춘다
      var target = document.getElementById(id);
      if (scroll && target) target.scrollIntoView();
    };

    if (form && input) {
      searchWrap.hidden = false;
      var initial = null;
      try { initial = new URLSearchParams(location.search).get('q'); } catch (e) { initial = null; }
      if (initial) { input.value = initial; query = normalize(initial); }
      input.addEventListener('input', function () { setQuery(input.value); });
      // Enter: 이미 입력하는 동안 걸러지므로 페이지를 다시 불러오지 않는다
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        setQuery(input.value);
      });
      // 결과 없음의 View All: 검색어와 제품군을 모두 지우고 전체 목록(#list)으로
      var reset = document.querySelector('[data-search-reset]');
      if (reset) reset.addEventListener('click', function () {
        input.value = '';
        category = null;
        setQuery('');
      });
    }

    fromHash(location.hash !== '');
    window.addEventListener('hashchange', function () { fromHash(true); });
  }

  // ---------- Product Detail 용량 선택 ----------
  // 기존 35ml·75ml 버튼. 선택한 용량의 가격을 공통 데이터에서 읽어 표시하고, 같은 탭 안에서는 선택을 기억한다.
  var capacity = document.querySelector('[data-capacity]');
  if (capacity) {
    var product = findProduct(capacity.getAttribute('data-capacity'));
    var buttons = capacity.querySelectorAll('[data-ml]');
    var price = document.querySelector('[data-price]');
    var storageKey = 'aidora-capacity:' + capacity.getAttribute('data-capacity');

    var optionFor = function (ml) {
      if (!product) return null;
      for (var i = 0; i < product.options.length; i++) if (product.options[i].ml === ml) return product.options[i];
      return null;
    };

    var select = function (ml, remember) {
      var option = optionFor(ml);
      // 데이터에 가격이 확정되지 않은 용량은 선택을 바꾸지 않는다
      if (!option || typeof option.price !== 'number') return;
      for (var i = 0; i < buttons.length; i++) {
        var on = Number(buttons[i].getAttribute('data-ml')) === ml;
        buttons[i].classList.toggle('is-selected', on);
        buttons[i].setAttribute('aria-pressed', on ? 'true' : 'false');
      }
      if (price) price.textContent = option.price.toLocaleString('en-US') + ' KRW';
      if (remember) {
        try { sessionStorage.setItem(storageKey, String(ml)); } catch (e) { /* 저장할 수 없어도 선택은 동작한다 */ }
      }
    };

    for (var b = 0; b < buttons.length; b++) {
      buttons[b].addEventListener('click', function () {
        select(Number(this.getAttribute('data-ml')), true);
      });
    }

    var saved = null;
    try { saved = sessionStorage.getItem(storageKey); } catch (e) { saved = null; }
    if (saved) select(Number(saved), false);
  }
})();
