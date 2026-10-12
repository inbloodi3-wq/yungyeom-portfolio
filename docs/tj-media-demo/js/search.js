/* 노래 검색 시연 — 화면에 이미 있는 예시 곡(Figma 시안의 7곡)을 걸러 보여 준다.
   서버도 다른 데이터도 없다. JavaScript가 없으면 시안과 같은 '아이유' 결과가 그대로 보인다. */
(function () {
  var root = document.querySelector('[data-search]');
  if (!root) return;

  var input = root.querySelector('[data-search-input]');
  var title = root.querySelector('[data-search-title]');
  var list = root.querySelector('[data-search-list]');
  var empty = root.querySelector('[data-search-empty]');
  var songs = root.querySelectorAll('[data-song]');
  var scopes = root.querySelectorAll('[data-search-scope]');
  var scope = 'all';

  function matches(song, query) {
    var fields = scope === 'all' ? ['title', 'artist', 'number'] : [scope];
    return fields.some(function (field) {
      return song.getAttribute('data-' + field).toLowerCase().indexOf(query) !== -1;
    });
  }

  function render() {
    var query = input.value.trim();
    var needle = query.toLowerCase();
    var count = 0;

    Array.prototype.forEach.call(songs, function (song) {
      var show = needle === '' || matches(song, needle);
      song.hidden = !show;
      if (show) count += 1;
    });

    title.textContent = query === '' ? '예시 곡 전체' : "'" + query + "' 검색 결과";
    list.hidden = count === 0;
    empty.hidden = count !== 0;
  }

  // 주소의 ?q= 가 있으면 그 검색어로 시작한다(Main의 검색창, 인기 검색어에서 넘어온 경우)
  var params = new URLSearchParams(window.location.search);
  if (params.has('q')) input.value = params.get('q');

  Array.prototype.forEach.call(scopes, function (button) {
    button.addEventListener('click', function () {
      scope = button.getAttribute('data-search-scope');
      Array.prototype.forEach.call(scopes, function (other) {
        var on = other === button;
        other.classList.toggle('is-selected', on);
        other.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  input.addEventListener('input', render);
  render();
})();
