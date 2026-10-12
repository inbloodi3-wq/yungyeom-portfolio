// TOP 버튼: 일정 거리 이상 내려가면 나타나고 맨 위 근처에서는 숨는다.
// 버튼 자체는 #top으로 가는 보통 링크라서 이 파일이 실행되지 않아도 동작한다(그때는 항상 보인다).
// 부드러운 이동은 CSS(scroll-behavior)가 맡고, 움직임을 줄이는 설정에서는 바로 이동한다.

(function () {
  var button = document.querySelector('[data-top-button]');
  if (!button) return;

  var SHOW_AFTER = 600;   // 이만큼(px) 내려가면 보인다
  var waiting = false;

  function update() {
    waiting = false;
    button.classList.toggle('is-hidden', window.scrollY < SHOW_AFTER);
  }

  window.addEventListener('scroll', function () {
    if (waiting) return;
    waiting = true;
    window.requestAnimationFrame(update);
  }, { passive: true });

  // 주소에 #top을 남기지 않고 올라간다(뒤로 가기가 한 번 더 필요해지지 않게).
  // 맨 위로 간 뒤 Keyboard Focus를 Page의 처음으로 옮긴다(숨은 버튼에 Focus가 남지 않게)
  button.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo(0, 0);
    var target = document.getElementById('top');
    if (target) target.focus({ preventScroll: true });
  });

  update();
})();
