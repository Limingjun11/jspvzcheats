(function () {
  if (document.getElementById('__cheatBall')) {
    console.log('作弊面板已存在，请刷新页面后再重试');
    return;
  }

  // ================= 1. 状态 =================
  var state = window.__cheat = {
    peaPrice: false,
    peaFast: false,
    allFast: false,
    zeroCool: false,
    infSun: false,
    colPlant: false,
    pendingCart: false
  };

  // ================= 2. 强制修复并注入整列种植 Hook =================
  var OrigBirth = function (d, c, h, a, m, n) {
    var e = this,
        k = d + e.GetDX(),
        i = c + e.GetDY(h, a, m),
        g = i - e.height,
        b = e.id = "P_" + Math.random(),
        j = e.zIndex += 3 * h,
        f = NewEle(0, "div", "position:absolute");
    NewImg(0, ShadowPNG, e.getShadow(e), f);
    NewImg(0, e.PicArr[e.NormalGif], "", f);
    e.pixelLeft = k;
    e.pixelRight = k + e.width;
    e.pixelTop = g;
    e.pixelBottom = g + e.GetDBottom();
    e.opacity = 1;
    e.InitTrigger(e, b, e.R = h, e.C = a, e.AttackedLX = k + e.beAttackedPointL, e.AttackedRX = k + e.beAttackedPointR);
    $P[b] = e;
    $P.length += 1;
    e.BirthStyle(e, b, f, { left: k + "px", top: g + "px", zIndex: j }, n);
    oGd.add(e, h + "_" + a + "_" + e.PKind);
    e.PrivateBirth(e, n);
  };

  CPlants.prototype.Birth = function (d, c, h, a, m, n) {
    var ret = OrigBirth.call(this, d, c, h, a, m, n);
    if (!state.colPlant) return ret;
    if (window.__fillingRow) return ret;
    if (!this.EName || !window[this.EName]) return ret;
    if (this.EName === 'oFlowerPot' || this.EName === 'oLilyPad') return ret;

    var PlantClass = window[this.EName];
    var C = this.C, rows = oS.R, sunNum = PlantClass.prototype.SunNum || 0;
    var placed = 0;

    window.__fillingRow = true;
    try {
      for (var r2 = 1; r2 <= rows; r2++) {
        if (r2 === this.R) continue;
        var cellArr = [
          oGd.$[r2 + '_' + C + '_0'],
          oGd.$[r2 + '_' + C + '_1'],
          oGd.$[r2 + '_' + C + '_2']
        ];
        if (cellArr[0] || cellArr[1] || cellArr[2]) continue;
        
        try {
          if (!PlantClass.prototype.CanGrow.call(PlantClass.prototype, cellArr, r2, C)) continue;
        } catch (e) { continue; }
        
        if (oS.SunNum < sunNum) break;

        try {
          var Obj = new PlantClass();
          Obj.Birth(GetX(C), GetY(r2), r2, C, [], null);
          if (oGd.$[r2 + '_' + C + '_0'] || oGd.$[r2 + '_' + C + '_1']) {
            placed++;
            oS.SunNum -= sunNum;
            var el = $('SunNum'); if (el) el.innerHTML = oS.SunNum;
          }
        } catch (e) {}
      }
    } finally { window.__fillingRow = false; }
    
    if (placed > 0) console.log('✅ 整列补种:', this.EName, '共', placed, '棵');
    return ret;
  };

  // ================= 3. 注入 UI 样式 =================
  var style = document.createElement('style');
  style.textContent = [
    '#__cheatBall{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#4caf50,#1b5e20);color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,.4);user-select:none;transition:transform .2s;}',
    '#__cheatBall:hover{transform:scale(1.08);}',
    '#__cheatPanel{position:fixed;right:20px;bottom:90px;width:220px;max-height:80vh;overflow-y:auto;background:rgba(30,30,30,.96);border:1px solid #4caf50;border-radius:10px;padding:8px;z-index:999998;display:none;box-shadow:0 4px 20px rgba(0,0,0,.5);color:#eee;font-family:sans-serif;font-size:13px;}',
    '#__cheatPanel.open{display:block;}',
    '#__cheatPanel .title{font-weight:bold;color:#4caf50;padding:4px 8px 8px;border-bottom:1px solid #333;margin-bottom:6px;text-align:center;}',
    '#__cheatPanel .btn{padding:8px 10px;margin:4px 0;border-radius:6px;background:#333;cursor:pointer;user-select:none;display:flex;justify-content:space-between;align-items:center;transition:background .15s;}',
    '#__cheatPanel .btn:hover{background:#444;}',
    '#__cheatPanel .btn.on{background:#2e7d32;color:#fff;}',
    '#__cheatPanel .btn.on:hover{background:#388e3c;}',
    '#__cheatPanel .btn .st{font-size:11px;opacity:.8;}',
    '#__cartBtn{position:fixed;right:20px;top:20px;width:56px;height:56px;border-radius:50%;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,.4);user-select:none;border:2px solid #666;transition:all .2s;}',
    '#__cartBtn:hover{transform:scale(1.08);border-color:#fff;}',
    '#__cartBtn.active{background:#4caf50;border-color:#4caf50;}',
    '#__cartBtn svg{width:30px;height:30px;fill:#fff;}'
  ].join('');
  document.head.appendChild(style);

  // ================= 4. 生成悬浮球与面板 =================
  var ball = document.createElement('div');
  ball.id = '__cheatBall';
  ball.textContent = '⚙';
  document.body.appendChild(ball);

  var panel = document.createElement('div');
  panel.id = '__cheatPanel';
  panel.innerHTML = [
    '<div class="title">🛠 作弊面板</div>',
    '<div class="btn" data-key="peaPrice">豌豆0阳光<span class="st">OFF</span></div>',
    '<div class="btn" data-key="peaFast">豌豆5tick射速<span class="st">OFF</span></div>',
    '<div class="btn" data-key="allFast">全植物5tick射速<span class="st">OFF</span></div>',
    '<div class="btn" data-key="zeroCool">全植物0冷却<span class="st">OFF</span></div>',
    '<div class="btn" data-key="infSun">无限阳光<span class="st">OFF</span></div>',
    '<div class="btn" data-key="colPlant">整列种植<span class="st">OFF</span></div>',
    '<div class="btn" data-key="clearZombies" data-action="true">清图僵尸<span class="st">点击</span></div>',
    '<div class="btn" data-key="nextWave" data-action="true">提前下一波<span class="st">点击</span></div>'
  ].join('');
  document.body.appendChild(panel);

  ball.onclick = function () { panel.classList.toggle('open'); };

  // ================= 5. 功能实现 =================
  var feats = {};

  feats.peaPrice = {
    on: function () {
      if (state._peaPriceBackup === undefined) state._peaPriceBackup = oPeashooter.prototype.SunNum;
      oPeashooter.prototype.SunNum = 0; return true;
    },
    off: function () {
      if (state._peaPriceBackup !== undefined) oPeashooter.prototype.SunNum = state._peaPriceBackup;
      return true;
    }
  };

  feats.peaFast = {
    on: function () {
      if (oPeashooter.prototype.hasOwnProperty('CheckLoop')) {
        state._peaFastHadOwn = true;
        state._peaFastOwnBackup = oPeashooter.prototype.CheckLoop;
      } else state._peaFastHadOwn = false;
      
      oPeashooter.prototype.CheckLoop = function (b, c) {
        var a = this.id;
        this.NormalAttack(b);
        oSym.addTask(5, function (e, f, h) {
          var g; (g = $P[e]) && g.AttackCheck1(f, h);
        }, [a, b, c]);
      };
      
      if (typeof oSplitPea !== 'undefined' && oSplitPea.prototype.hasOwnProperty('CheckLoop')) {
        state._splitBackup = oSplitPea.prototype.CheckLoop;
        oSplitPea.prototype.CheckLoop = function (a, b) {
          this.NormalAttack(b);
          oSym.addTask(5, function (c, e, g) {
            var f; (f = $P[c]) && f.AttackCheck1(e, g);
          }, [this.id, a, b]);
        };
      }
      return true;
    },
    off: function () {
      if (state._peaFastHadOwn) oPeashooter.prototype.CheckLoop = state._peaFastOwnBackup;
      else delete oPeashooter.prototype.CheckLoop;
      if (typeof oSplitPea !== 'undefined' && state._splitBackup) {
        oSplitPea.prototype.CheckLoop = state._splitBackup;
        state._splitBackup = null;
      }
      return true;
    }
  };

  feats.allFast = {
    on: function () {
      state._allFastBackups = {};
      var fastLoop = function (b, c) {
        var a = this.id;
        this.NormalAttack(b);
        oSym.addTask(5, function (e, f, h) {
          var g; (g = $P[e]) && g.AttackCheck1(f, h);
        }, [a, b, c]);
      };

      if (typeof CPlants !== 'undefined' && CPlants.prototype.CheckLoop) {
        state._allFastBackups.CPlants = CPlants.prototype.CheckLoop;
        CPlants.prototype.CheckLoop = fastLoop;
      }
      if (typeof oSplitPea !== 'undefined' && oSplitPea.prototype.CheckLoop) {
        state._allFastBackups.oSplitPea = oSplitPea.prototype.CheckLoop;
        oSplitPea.prototype.CheckLoop = fastLoop;
      }
      if (typeof oCactus !== 'undefined') {
        if (oCactus.prototype.CheckLoop) {
          state._allFastBackups.oCactus = oCactus.prototype.CheckLoop;
          oCactus.prototype.CheckLoop = fastLoop;
        }
        if (oCactus.prototype.CheckLoop2) {
          state._allFastBackups.oCactus2 = oCactus.prototype.CheckLoop2;
          oCactus.prototype.CheckLoop2 = fastLoop;
        }
      }
      return true;
    },
    off: function () {
      if (!state._allFastBackups) return true;
      if (state._allFastBackups.CPlants && typeof CPlants !== 'undefined') CPlants.prototype.CheckLoop = state._allFastBackups.CPlants;
      if (state._allFastBackups.oSplitPea && typeof oSplitPea !== 'undefined') oSplitPea.prototype.CheckLoop = state._allFastBackups.oSplitPea;
      if (state._allFastBackups.oCactus && typeof oCactus !== 'undefined') oCactus.prototype.CheckLoop = state._allFastBackups.oCactus;
      if (state._allFastBackups.oCactus2 && typeof oCactus !== 'undefined') oCactus.prototype.CheckLoop2 = state._allFastBackups.oCactus2;
      state._allFastBackups = null;
      return true;
    }
  };

  feats.zeroCool = {
    on: function () {
      state._coolBackup = state._coolBackup || {};
      Object.keys(window).forEach(function (k) {
        try {
          var v = window[k];
          if (typeof v !== 'function' || !v.prototype) return;
          if (typeof v.prototype.Birth !== 'function') return;
          if (!('SunNum' in v.prototype)) return;
          if (typeof v.prototype.coolTime !== 'number') return;
          if (!(k in state._coolBackup)) state._coolBackup[k] = v.prototype.coolTime;
          v.prototype.coolTime = 0;
        } catch (e) {}
      });
      return true;
    },
    off: function () {
      if (!state._coolBackup) return true;
      Object.keys(state._coolBackup).forEach(function (k) {
        try {
          var v = window[k];
          if (v && v.prototype && 'coolTime' in v.prototype) v.prototype.coolTime = state._coolBackup[k];
        } catch (e) {}
      });
      state._coolBackup = null; return true;
    }
  };

  feats.infSun = {
    on: function () {
      if (!state._sunBackup) state._sunBackup = { MaxSunNum: oS.MaxSunNum, SunNum: oS.SunNum };
      oS.MaxSunNum = 999999; oS.SunNum = 999999;
      var el = $('SunNum'); if (el) el.innerHTML = oS.SunNum;
      
      if (window.__sunKeeper) clearInterval(window.__sunKeeper);
      window.__sunKeeper = setInterval(function () {
        if (oS.SunNum < 999999) {
          oS.SunNum = 999999;
          var e = $('SunNum'); if (e) e.innerHTML = oS.SunNum;
        }
      }, 100);
      return true;
    },
    off: function () {
      if (window.__sunKeeper) { clearInterval(window.__sunKeeper); window.__sunKeeper = null; }
      if (state._sunBackup) {
        oS.MaxSunNum = state._sunBackup.MaxSunNum; oS.SunNum = state._sunBackup.SunNum;
        var el = $('SunNum'); if (el) el.innerHTML = oS.SunNum;
        state._sunBackup = null;
      }
      return true;
    }
  };

  feats.colPlant = {
    on: function () { return true; },
    off: function () { return true; }
  };

  feats.clearZombies = {
    run: function () {
      var count = 0;
      Object.keys($Z).forEach(function (id) {
        var z = $Z[id]; if (!z) return;
        try {
          if (typeof z.NormalDie === 'function') { z.NormalDie(); count++; }
          else {
            delete $Z[id]; var el = $(id);
            if (el && el.parentNode) el.parentNode.removeChild(el);
            count++;
          }
        } catch (e) {}
      });
      console.log('清图完成，清理僵尸:', count);
    }
  };

  // 提前下一波（完美适配源码，直接强推进度）
  feats.nextWave = {
    run: function () {
      if (typeof oP !== 'undefined') {
        try {
          oP.NumZombies = 0; // 强制把当前剩余僵尸数算作0
          oP.FlagZombieWaitTime = 1;
          oP.FlagMaxWaitTime = 1;
          
          if (oP.FlagZombies < oP.FlagNum) {
            oP.AddZombiesFlag();
            console.log('🚀 已强制提前到下一波！');
          } else {
            console.log('已经是最后一波了！');
          }
        } catch (e) {
          console.warn('强制推进失败:', e);
        }
      }
    }
  };

  // ================= 6. 按钮事件绑定 =================
  panel.querySelectorAll('.btn').forEach(function (btn) {
    var k = btn.dataset.key, stEl = btn.querySelector('.st');
    
    if (btn.dataset.action === 'true') {
      btn.onclick = function () {
        feats[k] && feats[k].run && feats[k].run();
        btn.classList.add('on'); stEl.textContent = '已执行';
        setTimeout(function () { btn.classList.remove('on'); stEl.textContent = '点击'; }, 800);
      };
      return;
    }

    if (state[k]) { btn.classList.add('on'); stEl.textContent = 'ON'; }
    btn.onclick = function () {
      var isOn = btn.classList.contains('on');
      if (isOn) {
        var ok = feats[k].off();
        if (ok !== false) { state[k] = false; btn.classList.remove('on'); stEl.textContent = 'OFF'; }
      } else {
        var ok2 = feats[k].on();
        if (ok2 !== false) { state[k] = true; btn.classList.add('on'); stEl.textContent = 'ON'; }
      }
    };
  });

  // ================= 7. 右上角小推车 (铲子选格) =================
  var cartBtn = document.createElement('div');
  cartBtn.id = '__cartBtn';
  cartBtn.title = '小推车：点击激活，再点草地格子种下';
  cartBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5.2 4h14.6l-2 8H7.2L5.2 4zM3 2v2h2l3.6 7.6-1.4 2.4H19v-2H9.4l-.6-1H17l2-6H5.2L3.4 2H3z"/></svg>';
  document.body.appendChild(cartBtn);

  var overlay = document.createElement('div');
  overlay.id = '__cartOverlay';
  overlay.style.cssText = 'position:fixed;display:none;z-index:999997;';
  document.body.appendChild(overlay);

  function hideCartOverlay() {
    overlay.innerHTML = ''; overlay.style.display = 'none';
    state.pendingCart = false; cartBtn.classList.remove('active');
  }

  function showCartOverlay() {
    if (typeof EDPZ === 'undefined' || !EDPZ) { alert('找不到 EDPZ，无法显示格子'); return; }
    var rect = EDPZ.getBoundingClientRect();
    var sx = rect.width / (EDPZ.offsetWidth || rect.width) || 1;
    var sy = rect.height / (EDPZ.offsetHeight || rect.height) || 1;

    overlay.style.left = rect.left + 'px'; overlay.style.top = rect.top + 'px';
    overlay.style.width = rect.width + 'px'; overlay.style.height = rect.height + 'px';
    overlay.style.display = 'block'; overlay.innerHTML = '';

    var cols = oS.ArP ? (oS.ArP.ArC[1] - 1) : 9;

    for (var R = 1; R <= oS.R; R++) {
      for (var C = 1; C <= cols; C++) {
        (function (R, C) {
          var cell = document.createElement('div');
          var left = (GetX(C) - 40) * sx;
          var top = (GetY(R) - 100) * sy;
          cell.style.cssText = 'position:absolute;box-sizing:border-box;left:' + left + 'px;top:' + top + 'px;width:' + (80 * sx) + 'px;height:' + (100 * sy) + 'px;border:1px dashed rgba(76,175,80,.55);cursor:pointer;';
          cell.onmouseenter = function () { cell.style.background = 'rgba(76,175,80,.35)'; };
          cell.onmouseleave = function () { cell.style.background = ''; };
          cell.onclick = function (e) {
            e.stopPropagation(); e.preventDefault();
            hideCartOverlay(); placeCartAt(R, C);
          };
          overlay.appendChild(cell);
        })(R, C);
      }
    }
  }

  function placeCartAt(R, C) {
    var k0 = R + '_' + C + '_0', k1 = R + '_' + C + '_1';
    if (oGd.$[k0] || oGd.$[k1]) { console.warn('格子已有东西:', R, C); return; }
    var PlantClass = oLawnCleaner;
    if (oGd.$LF[R] === 2 && typeof oPoolCleaner !== 'undefined') PlantClass = oPoolCleaner;
    
    try {
      var Obj = new PlantClass();
      Obj.Birth(GetX(C), GetY(R), R, C, [], null);
      console.log('✅ 小推车已放置在', R, C);
    } catch (e) { console.warn('放置失败:', e); }
  }

  cartBtn.onclick = function () {
    if (state.pendingCart) { hideCartOverlay(); console.log('小推车模式已取消'); }
    else {
      state.pendingCart = true; cartBtn.classList.add('active');
      showCartOverlay(); console.log('小推车模式：点击绿色格子放置');
    }
  };

  console.log('✅ 作弊面板注入成功！已移除铲子功能，保留提前下一波。');
})();