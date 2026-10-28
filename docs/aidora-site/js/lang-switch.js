// AIDORA 언어 전환(Phase 2E Stage D) — Header의 지구 아이콘 링크(data-lang-switch)는 상대 언어의 같은 Page로 간다.
// 누르는 순간의 검색어(?q=)와 위치(#perfume 등)를 그대로 넘겨 같은 상태로 이어지게 한다.
// JavaScript가 없으면 링크에 적힌 주소(같은 Page의 처음)로만 간다. 자동 언어 이동은 하지 않는다.
(function () {
  var link = document.querySelector('[data-lang-switch]');
  if (!link) return;
  var base = link.getAttribute('href').split(/[?#]/)[0];
  link.addEventListener('click', function () {
    link.setAttribute('href', base + location.search + location.hash);
  });
})();
