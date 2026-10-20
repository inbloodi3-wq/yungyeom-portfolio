// main.js - 진보적 향상. JS가 없어도 모든 내용과 유형 필터는 동작한다.
// 목록: URL ?type=0N 유형 필터 선택, 비교 트레이(최대 3개). 상세: 컬러별 품절 사이즈, 선택 요약.
(function () {
  var MAX_COMPARE = 3;

  function list(value) {
    return value ? value.split(" ") : [];
  }

  // ---------- 목록 ----------
  // ?type=0N -> 해당 radio를 체크 (CSS :has()가 카드를 걸러 준다)
  var type = new URLSearchParams(window.location.search).get("type");
  if (type) {
    var radios = document.querySelectorAll('input[name="type-filter"]');
    for (var r = 0; r < radios.length; r++) {
      if (radios[r].value === type) {
        radios[r].checked = true;
      }
    }
  }

  var tray = document.querySelector("[data-tray]");
  if (tray) {
    var checks = document.querySelectorAll("[data-compare]");
    var chipList = tray.querySelector("[data-tray-list]");
    var trayMsg = tray.querySelector("[data-tray-msg]");
    var clear = tray.querySelector("[data-tray-clear]");

    var render = function () {
      chipList.textContent = "";
      var count = 0;
      for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
          var li = document.createElement("li");
          li.className = "compare-tray__chip";
          li.textContent = checks[i].getAttribute("data-name");
          chipList.appendChild(li);
          count++;
        }
      }
      tray.hidden = count === 0;
    };

    for (var i = 0; i < checks.length; i++) {
      checks[i].addEventListener("change", function (event) {
        var box = event.target;
        trayMsg.textContent = "";
        if (box.checked) {
          var count = 0;
          for (var j = 0; j < checks.length; j++) {
            if (checks[j].checked) {
              count++;
            }
          }
          if (count > MAX_COMPARE) {
            box.checked = false;
            trayMsg.textContent = "최대 3개까지 비교할 수 있습니다";
            return;
          }
        }
        render();
      });
    }

    clear.addEventListener("click", function () {
      for (var i = 0; i < checks.length; i++) {
        checks[i].checked = false;
      }
      trayMsg.textContent = "";
      render();
    });

    render();
  }

  // ---------- 상세 ----------
  var form = document.querySelector("[data-product]");
  if (form) {
    var colors = form.querySelectorAll('input[name="color"]');
    var sizes = form.querySelectorAll('input[name="size"]');
    var summary = form.querySelector("[data-summary]");
    var buyMsg = form.querySelector("[data-buy-msg]");
    var buyButtons = form.querySelectorAll("[data-buy]");

    var checked = function (name) {
      return form.querySelector('input[name="' + name + '"]:checked');
    };

    // 선택 컬러의 품절(data-soldout)·미제공(data-absent) 사이즈를 반영
    var updateSizes = function () {
      var color = checked("color");
      var soldout = color ? list(color.getAttribute("data-soldout")) : [];
      var absent = color ? list(color.getAttribute("data-absent")) : [];
      for (var i = 0; i < sizes.length; i++) {
        var size = sizes[i];
        var label = size.parentNode;
        var flag = label.querySelector(".option__flag");
        var isSoldout = soldout.indexOf(size.value) !== -1;
        var isAbsent = absent.indexOf(size.value) !== -1;
        size.disabled = isSoldout || isAbsent;
        label.hidden = isAbsent;
        if (flag) {
          flag.hidden = !isSoldout;
        }
        if (size.disabled && size.checked) {
          size.checked = false;
        }
      }
    };

    var updateSummary = function () {
      var color = checked("color");
      var width = checked("width");
      var size = checked("size");
      summary.textContent =
        (color ? color.value : "컬러 선택 전") + " · " +
        (width ? width.value : "발 너비 선택 전") + " · " +
        (size ? size.value : "사이즈 선택 전");
    };

    form.addEventListener("change", function (event) {
      if (event.target.name === "color") {
        updateSizes();
      }
      buyMsg.textContent = "";
      updateSummary();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });

    for (var b = 0; b < buyButtons.length; b++) {
      buyButtons[b].addEventListener("click", function () {
        buyMsg.textContent = checked("size")
          ? "시안이라 실제 구매·장바구니 동작은 없습니다"
          : "사이즈를 선택하세요";
      });
    }

    updateSizes();
    updateSummary();
  }
})();
