// AIDORA 시연 사이트의 상호작용 — Collection 제품군 필터, Product Detail 용량 선택.
// 상품 값은 js/products.js(공통 상품 데이터)에서 읽는다.
// JavaScript가 없으면 기존 화면 그대로다(필터는 해당 제품군으로 이동하는 앵커, 용량은 75ml 표시).
(function () {
  var products = window.AIDORA_PRODUCTS || [];

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
    var all = filter.getAttribute('data-filter'); // All 탭의 주소(#list)
    var categories = [];
    for (var t = 0; t < tabs.length; t++) {
      var key = tabs[t].hash.slice(1);
      if (key !== all) categories.push(key);
    }

    var applyFilter = function (category) {
      var current = category || all;
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].hash.slice(1) === current;
        tabs[i].classList.toggle('is-current', on);
        if (on) tabs[i].setAttribute('aria-current', 'true');
        else tabs[i].removeAttribute('aria-current');
      }
      for (var g = 0; g < groups.length; g++) {
        var items = groups[g].querySelectorAll('[data-product]');
        var shown = 0;
        for (var j = 0; j < items.length; j++) {
          var product = findProduct(items[j].getAttribute('data-product'));
          var match = !category || (product !== null && product.category === category);
          items[j].hidden = !match;
          if (match) shown++;
        }
        groups[g].hidden = shown === 0;
      }
    };

    // 주소의 앵커가 탭 주소일 때만 반응한다(#top 같은 다른 앵커는 필터를 바꾸지 않는다)
    var fromHash = function (scroll) {
      var id = location.hash.slice(1);
      if (id !== all && categories.indexOf(id) === -1) {
        if (!id) applyFilter(null);
        return;
      }
      applyFilter(id === all ? null : id);
      // 숨겨져 있던 제품군으로 이동한 경우 브라우저가 위치를 못 잡으므로 다시 맞춘다
      var target = document.getElementById(id);
      if (scroll && target) target.scrollIntoView();
    };

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
