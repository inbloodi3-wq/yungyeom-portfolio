// 확대 창(.ak-lightbox) 키보드 보조. 창은 CSS :target으로 열리고 닫히며(주소의 #zoom-… ↔ #fig-…),
// 이 파일이 없어도 그대로 동작한다. 여기서는 키보드 사용을 돕는 것만 더한다.
// - 열리면 Focus를 창의 "닫기"로 옮기고, 창 밖 내용은 inert로 막는다(Tab·Shift+Tab이 창 안에서만 돈다)
// - Escape는 "닫기"를 누른 것과 같다(같은 주소 이동이라 뒤로 가기 기록도 마우스와 같다)
// - 닫히면(닫기·Escape·뒤로 가기) 원래 그림 링크로 Focus를 돌려준다. 스크롤 위치는 주소 이동이 정한다

(function () {
  var boxes = document.querySelectorAll('.ak-lightbox[id]');
  if (!boxes.length) return;

  var openBox = null;   // 지금 열린 창
  var opener = null;    // 창을 연 그림 링크(닫기 링크의 href가 가리키는 #fig-…)
  var outside = [];     // 창이 열린 동안 inert로 막은 요소

  function closeLink(box) {
    return box.querySelector('.ak-lightbox__close');
  }

  function focusables(box) {
    var list = [];
    var close = closeLink(box);
    if (close) list.push(close);
    var body = box.querySelector('.ak-lightbox__body');
    // 원본 크기 이미지는 창보다 클 수 있다. 그때만 본문을 Tab으로 잡아 화살표로 밀어 볼 수 있게 한다
    if (body && (body.scrollWidth > body.clientWidth || body.scrollHeight > body.clientHeight)) {
      body.tabIndex = 0;
      list.push(body);
    }
    return list;
  }

  function open(box) {
    openBox = box;
    var close = closeLink(box);
    var figId = close ? close.getAttribute('href').slice(1) : '';
    opener = document.getElementById(figId);
    box.setAttribute('aria-modal', 'true');
    outside = [];
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== box && el.tagName !== 'SCRIPT' && !el.inert) {
        el.inert = true;
        outside.push(el);
      }
    });
    if (close) close.focus({ preventScroll: true });
  }

  function close(returnFocus) {
    if (!openBox) return;
    openBox.removeAttribute('aria-modal');
    outside.forEach(function (el) { el.inert = false; });
    outside = [];
    openBox = null;
    if (returnFocus && opener) opener.focus({ preventScroll: true });
    opener = null;
  }

  function sync() {
    var id = location.hash.slice(1);
    var box = id ? document.getElementById(id) : null;
    var isBox = !!(box && box.classList.contains('ak-lightbox'));
    if (openBox && openBox !== box) close(true);
    if (isBox && openBox !== box) open(box);
  }

  window.addEventListener('hashchange', sync);

  document.addEventListener('keydown', function (event) {
    if (!openBox) return;
    if (event.key === 'Escape') {
      var link = closeLink(openBox);
      if (link) {
        event.preventDefault();
        link.click();
      }
      return;
    }
    if (event.key !== 'Tab') return;
    var list = focusables(openBox);
    if (!list.length) return;
    var index = list.indexOf(document.activeElement);
    var next = event.shiftKey ? index - 1 : index + 1;
    if (next < 0) next = list.length - 1;
    if (next >= list.length) next = 0;
    event.preventDefault();
    list[next].focus({ preventScroll: true });
  });

  sync();   // #zoom-…으로 바로 들어온 경우
})();
