// main.js - 진보적 향상. JS가 없어도 모든 내용과 유형 필터는 동작한다.
// 목록: URL ?type=0N 유형 필터 선택, 비교 트레이(최대 3개), 고른 모델 ID를 ?compare=로 주소에 유지.
// 비교: ?models=ID,ID로 고른 열만 표시(없으면 추천 3열). 상세: 컬러별 품절 사이즈, 선택 요약.
(function () {
  var MAX_COMPARE = 3;
  var params = new URLSearchParams(window.location.search);

  function list(value) {
    return value ? value.split(" ") : [];
  }

  // "a,b,c" -> 알려진 ID만, 중복 없이, 최대 3개
  function pickIds(value, known) {
    var ids = [];
    var parts = value ? value.split(",") : [];
    for (var i = 0; i < parts.length && ids.length < MAX_COMPARE; i++) {
      if (known(parts[i]) && ids.indexOf(parts[i]) === -1) {
        ids.push(parts[i]);
      }
    }
    return ids;
  }

  // ---------- 목록 ----------
  // ?type=0N -> 해당 radio를 체크 (CSS :has()가 카드를 걸러 준다)
  var radios = document.querySelectorAll('input[name="type-filter"]');
  var type = params.get("type");
  if (type) {
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
    var go = tray.querySelector("[data-tray-go]");

    var findCheck = function (id) {
      for (var i = 0; i < checks.length; i++) {
        if (checks[i].getAttribute("data-compare") === id) {
          return checks[i];
        }
      }
      return null;
    };

    // 비교 페이지에서 "목록에서 모델 고르기"로 돌아오면 고른 모델을 다시 체크
    var initial = pickIds(params.get("compare"), findCheck);
    for (var k = 0; k < initial.length; k++) {
      findCheck(initial[k]).checked = true;
    }

    // 뒤로 가기·새로 고침에도 선택이 남도록 현재 유형·선택을 주소에 기록(기록은 추가하지 않음)
    var saveState = function (ids) {
      var next = new URLSearchParams(window.location.search);
      var radio = document.querySelector('input[name="type-filter"]:checked');
      if (radio && radio.value !== "all") {
        next.set("type", radio.value);
      } else {
        next.delete("type");
      }
      if (ids.length) {
        next.set("compare", ids.join(","));
      } else {
        next.delete("compare");
      }
      var query = next.toString().replace(/%2C/g, ",");
      window.history.replaceState(null, "", window.location.pathname + (query ? "?" + query : "") + window.location.hash);
    };

    var render = function () {
      chipList.textContent = "";
      var ids = [];
      for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
          var li = document.createElement("li");
          li.className = "compare-tray__chip";
          li.textContent = checks[i].getAttribute("data-name");
          chipList.appendChild(li);
          ids.push(checks[i].getAttribute("data-compare"));
        }
      }
      tray.hidden = ids.length === 0;
      go.href = "compare.html" + (ids.length ? "?models=" + ids.join(",") : "");
      saveState(ids);
    };

    for (var t = 0; t < radios.length; t++) {
      radios[t].addEventListener("change", render);
    }

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

    // 뒤로 가기로 페이지가 그대로 복원될 때(bfcache)도 트레이·주소를 체크 상태에 맞춘다
    window.addEventListener("pageshow", render);

    render();
  }

  // ---------- 비교 ----------
  var table = document.querySelector("[data-compare-table]");
  if (table) {
    var names = {};
    var heads = table.querySelectorAll("thead [data-col]");
    for (var h = 0; h < heads.length; h++) {
      names[heads[h].getAttribute("data-col")] = heads[h].getAttribute("data-name");
    }
    var isKnown = function (id) {
      return Object.prototype.hasOwnProperty.call(names, id);
    };

    var ids = pickIds(params.get("models"), isKnown);
    if (ids.length) {
      // 고른 열만 보이고, 목록에서 고른 순서로 놓는다
      var cells = table.querySelectorAll("[data-col]");
      for (var c = 0; c < cells.length; c++) {
        cells[c].hidden = ids.indexOf(cells[c].getAttribute("data-col")) === -1;
      }
      for (var row = 0; row < table.rows.length; row++) {
        for (var n = 0; n < ids.length; n++) {
          var cell = table.rows[row].querySelector('[data-col="' + ids[n] + '"]');
          if (cell) {
            table.rows[row].appendChild(cell);
          }
        }
      }
      table.setAttribute("data-count", String(ids.length));

      var picked = [];
      for (var p = 0; p < ids.length; p++) {
        picked.push(names[ids[p]]);
      }
      document.querySelector("[data-compare-names]").textContent =
        "목록에서 고른 " + ids.length + "개 모델: " + picked.join(" · ");
      document.querySelector("[data-compare-caption]").textContent = picked.join(", ") + " 비교";
      document.querySelector("[data-compare-edit]").href = "list.html?compare=" + ids.join(",");
    }

    // "가장 가벼움" 표시는 무게가 확인된 모델이 2개 이상이고 그중 가장 가벼울 때만
    var flag = table.querySelector("[data-lightest-flag]");
    if (flag) {
      var own = Number(flag.parentNode.getAttribute("data-weight"));
      var weights = table.querySelectorAll("[data-weight]:not([hidden])");
      var lighter = false;
      for (var w = 0; w < weights.length; w++) {
        if (Number(weights[w].getAttribute("data-weight")) < own) {
          lighter = true;
        }
      }
      flag.hidden = flag.parentNode.hidden || weights.length < 2 || lighter;
    }
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
