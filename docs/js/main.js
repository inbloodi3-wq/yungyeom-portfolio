// Loading → Cover 전환
// <head>의 한 줄 Script가 <html>에 "is-loading"을 붙여 둔다.
// 여기서는 실제 준비 상태에 맞춰 진행률을 올리고, 100이 되면 "is-loaded"로 바꾼다.
// 이 파일이 실행되지 않아도 CSS가 8초 뒤에 Loading 화면을 걷어 낸다(components.css의 failsafe).

(function () {
  var root = document.documentElement;
  if (!root.classList.contains('is-loading')) return;

  var loader = document.querySelector('[data-loader]');
  var bar = document.querySelector('[data-loader-bar]');
  var value = document.querySelector('[data-loader-value]');

  if (!loader || !bar || !value) {
    finish();
    return;
  }

  // 시간 설정(ms)
  var FILL_TIME = 1000;    // 준비가 빨리 끝나도 0 → 100은 이 시간에 걸쳐 올라간다
  var HOLD_TIME = 100;     // 100%를 잠깐 보여 준 뒤 넘어간다
  var MAX_STEP = 2.5;      // 한 Frame에 올라갈 수 있는 최대 폭(준비가 늦게 끝나도 튀지 않게)
  var SAFETY_TIME = 7000;  // 무언가 끝나지 않아도 이 시간 뒤에는 넘어간다

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = 30;   // 실제 준비 상태가 허락하는 진행률. 여기까지 왔다면 HTML은 다 읽은 상태다
  var shown = 0;     // 화면에 보이는 진행률. 줄어들지 않는다.
  var startTime = null;

  // 준비 단계마다 목표 진행률을 올린다
  function raiseTarget(next) {
    if (next > target) target = next;
  }

  // Cover를 그리는 데 꼭 필요한 것만 기다린다: <head>에서 preload한 Font와 이미지.
  // (아래쪽 Section의 Font는 기다리지 않는다)
  function preloaded(as) {
    return Array.prototype.slice.call(document.querySelectorAll('link[rel="preload"][as="' + as + '"]'));
  }

  // Cover에 쓰이는 서체. base.css의 @font-face와 같은 이름·굵기다.
  var coverFonts = ['300 1em Outfit', '400 1em Outfit', '400 1em Allura', '500 1em "Cormorant Garamond"'];
  var fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all(coverFonts.map(function (font) { return document.fonts.load(font).catch(function () {}); }))
    : Promise.resolve();

  var imagesReady = Promise.all(preloaded('image').map(function (link) {
    return new Promise(function (resolve) {
      var image = new Image();
      image.onload = image.onerror = resolve;
      image.src = link.href;
    });
  }));

  fontsReady.then(function () { raiseTarget(70); });
  Promise.all([fontsReady, imagesReady]).then(function () { raiseTarget(100); });

  window.setTimeout(function () { raiseTarget(100); }, SAFETY_TIME);

  function render() {
    var percent = Math.floor(shown);
    value.textContent = percent + '%';
    bar.style.transform = 'scaleX(' + shown / 100 + ')';
  }

  // 시간에 따른 진행률: 처음엔 조금 빠르고 끝으로 갈수록 완만해진다(끝에서 멈춘 듯 보이지 않을 정도로만)
  function timeProgress(elapsed) {
    var t = Math.min(1, elapsed / FILL_TIME);
    return (1 - Math.pow(1 - t, 1.5)) * 100;
  }

  function tick(now) {
    if (startTime === null) startTime = now;

    if (reduceMotion) {
      // 움직임을 줄이는 환경: 기다리게 하지 않고 준비되는 대로 넘어간다
      shown = target;
    } else {
      // 시간이 허락하는 값과 실제 준비 상태가 허락하는 값 중 작은 쪽까지만 올라간다.
      // 준비가 늦으면 거기서 기다리고, 준비가 빨라도 FILL_TIME보다 빨리 차지 않는다.
      var allowed = Math.min(timeProgress(now - startTime), target);
      shown = Math.max(shown, Math.min(allowed, shown + MAX_STEP));
    }
    render();

    if (shown >= 100) {
      window.setTimeout(finish, reduceMotion ? 0 : HOLD_TIME);
    } else {
      window.requestAnimationFrame(tick);
    }
  }

  function finish() {
    root.classList.remove('is-loading');
    root.classList.add('is-loaded');
  }

  window.requestAnimationFrame(tick);
})();

// Sheet 전환 (Cover ↔ Profile ↔ Contents)
// Folder 안의 Sheet들은 같은 자리에 겹쳐 있다. 아래로 넘기려는 입력(Wheel, Swipe, 방향키)이 오면
// 맨 위 Sheet를 꺼내 옆으로 넘겨 두고(.is-extracted), 위로 넘기려는 입력이 오면 다시 놓는다(.is-returned).
// 움직임 자체는 CSS(layout.css의 sheet-extract / sheet-return)가 맡는다.
// 이 부분이 실행되지 않으면 Sheet들은 위에서 아래로 이어지는 보통 문서로 남는다.

(function () {
  var root = document.documentElement;
  var stack = document.querySelector('[data-sheet-stack]');
  var folder = document.querySelector('.portfolio-folder');
  if (!stack || !folder) return;

  var sheets = Array.prototype.slice.call(stack.querySelectorAll('[data-sheet]'));   // 위에 놓인 순서
  if (sheets.length < 2) return;

  var THRESHOLD = 40;      // 이만큼(px) 넘기려는 입력이 쌓이면 전환한다
  var GESTURE_GAP = 180;   // Wheel 입력이 이 시간(ms) 끊기면 새 동작으로 본다
  var SAFETY_TIME = 1500;  // animationend가 오지 않아도 이 시간 뒤에는 잠금을 푼다

  var active = 0;          // 지금 보고 있는 Sheet의 순서(activeSheet)
  var busy = false;        // 전환 중에는 새 전환을 시작하지 않는다

  // 주소의 #id가 Sheet를 가리키면 그 Sheet에서 시작한다(Project Page에서 Contents로 돌아올 때).
  // 그 앞의 Sheet들은 움직임 없이 이미 넘겨 둔 상태(.is-away)가 된다.
  var startId = window.location.hash.slice(1);
  sheets.forEach(function (sheet, index) {
    if (sheet.id === startId) active = index;
  });
  sheets.slice(0, active).forEach(function (sheet) { sheet.classList.add('is-away'); });

  root.classList.add('is-sheets-ready');
  stack.setAttribute('data-active-sheet', sheets[active].id);

  // Folder가 책상에 놓이는 동작이 끝나기 전에는 Sheet를 넘기지 않는다
  function introDone() {
    if (root.classList.contains('is-loading')) return false;
    if (!folder.getAnimations) return true;
    return folder.getAnimations().every(function (animation) { return animation.playState === 'finished'; });
  }

  function atTop(sheet) {
    return sheet.scrollTop <= 0;
  }

  function atBottom(sheet) {
    return sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 1;
  }

  // direction: 1 = 다음 Sheet, -1 = 이전 Sheet. 그 방향으로 넘길 수 있는 상태인지
  function canGo(direction) {
    if (busy || !introDone()) return false;
    var next = active + direction;
    if (next < 0 || next >= sheets.length) return false;
    return direction > 0 ? atBottom(sheets[active]) : atTop(sheets[active]);
  }

  function go(direction) {
    // 다음으로: 지금 Sheet를 꺼낸다. 이전으로: 넘겨 둔 앞 Sheet를 다시 놓는다.
    var moving = direction > 0 ? sheets[active] : sheets[active - 1];
    busy = true;
    active += direction;
    stack.setAttribute('data-active-sheet', sheets[active].id);

    // 주소에 지금 Sheet를 남긴다. 새로 고치거나 Project Page에서 뒤로 가기로 돌아오면 같은 Sheet에서 시작한다.
    if (window.history.replaceState) {
      window.history.replaceState(null, '', active === 0 ? window.location.pathname + window.location.search : '#' + sheets[active].id);
    }

    moving.classList.remove('is-away');
    moving.classList.toggle('is-extracted', direction > 0);
    moving.classList.toggle('is-returned', direction < 0);

    var timer = window.setTimeout(done, SAFETY_TIME);
    moving.addEventListener('animationend', onEnd);

    function onEnd(event) {
      if (event.target === moving) done();
    }

    function done() {
      window.clearTimeout(timer);
      moving.removeEventListener('animationend', onEnd);
      busy = false;
      // 방향키로 새 Sheet 안을 Scroll할 수 있게 Focus를 옮긴다
      sheets[active].focus({ preventScroll: true });
    }
  }

  // Wheel: 한 번의 동작이 Sheet의 끝(다음은 맨 아래, 이전은 맨 위)에서 시작했을 때만 넘긴다.
  // Sheet 안을 Scroll하다가 끝에 닿은 것만으로는 넘어가지 않는다.
  var wheelSum = 0;
  var wheelDirection = 0;
  var wheelTime = 0;
  var wheelArmed = false;

  stack.addEventListener('wheel', function (event) {
    if (event.ctrlKey || event.deltaY === 0) return;
    // 전환 중에는 드러나는 Sheet가 남은 입력으로 미리 Scroll되지 않게 한다
    if (busy) event.preventDefault();
    var direction = event.deltaY > 0 ? 1 : -1;
    var isNewGesture = event.timeStamp - wheelTime > GESTURE_GAP || direction !== wheelDirection;
    wheelTime = event.timeStamp;

    if (isNewGesture) {
      wheelSum = 0;
      wheelDirection = direction;
      wheelArmed = canGo(direction);
    }
    if (!wheelArmed) return;

    wheelSum += Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : 1);
    if (wheelSum >= THRESHOLD) {
      wheelArmed = false;   // 같은 동작의 남은 입력으로 다시 넘어가지 않는다
      if (canGo(direction)) go(direction);
    }
  }, { passive: false });

  // Touch: 위로 쓸어 올리면 다음, 아래로 쓸어 내리면 이전
  var touchY = null;
  var touchCanNext = false;
  var touchCanPrevious = false;

  stack.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1) {
      touchY = null;
      return;
    }
    touchY = event.touches[0].clientY;
    touchCanNext = canGo(1);
    touchCanPrevious = canGo(-1);
  }, { passive: true });

  stack.addEventListener('touchmove', function (event) {
    if (busy && event.cancelable) event.preventDefault();
    if (touchY === null) return;
    var moved = touchY - event.touches[0].clientY;
    var direction = moved >= THRESHOLD ? 1 : (moved <= -THRESHOLD ? -1 : 0);
    if (direction === 0) return;
    touchY = null;   // 한 번의 Touch로 한 번만
    if ((direction > 0 ? touchCanNext : touchCanPrevious) && canGo(direction)) go(direction);
  }, { passive: false });

  // Keyboard
  var KEY_DIRECTION = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };

  document.addEventListener('keydown', function (event) {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest && event.target.closest('a, button, input, select, textarea')) return;

    var direction = KEY_DIRECTION[event.key] || (event.key === ' ' ? (event.shiftKey ? -1 : 1) : 0);
    if (direction === 0 || !canGo(direction)) return;

    event.preventDefault();
    go(direction);
  });
})();
