/* ==========================================================================
   Echo Theme  ·  Interaction
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var SVG_CHEVRON = '<svg class="icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  var SVG_CHEVRON_FLIP = '<span class="icon-flip">' + SVG_CHEVRON + '</span>';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeToggle = $('#theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('echo-theme', next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#0f1117' : '#f6f7fb');
      // 通知评论区（giscus）等跟随切换
      window.dispatchEvent(new CustomEvent('echo:themechange', { detail: { theme: next } }));
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = $('#menu-toggle');
  var siteNav = $('#site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!siteNav.classList.contains('is-open')) return;
      if (siteNav.contains(e.target) || menuToggle.contains(e.target)) return;
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------- 回到顶部 + 首页导航吸顶切换 ---------- */
  var backTop = $('#back-to-top');
  var siteHeader = $('#site-header');
  var homeHero = $('.home-hero');
  var ticking = false;

  // 首页导航固定：透明悬浮在大图上，滚动过大图后切换为实底
  function updateHeader(top) {
    if (!siteHeader || !siteHeader.classList.contains('has-hero')) return;
    var threshold = homeHero
      ? Math.max(0, homeHero.offsetHeight - siteHeader.offsetHeight - 8)
      : 60;
    siteHeader.classList.toggle('is-scrolled', top > threshold);
  }

  function onScroll() {
    var top = window.scrollY || window.pageYOffset;
    if (backTop) backTop.classList.toggle('is-visible', top > 480);
    updateHeader(top);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener('resize', function () {
    updateHeader(window.scrollY || window.pageYOffset);
  }, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = $$('.post-card, .resource-card, .entry-card, .archive-year');
  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 6, 5) * 40 + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Copy buttons ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-copy]');
    if (!btn) return;
    var value = btn.getAttribute('data-copy');
    if (!value) return;
    copyText(value).then(function () {
      var original = btn.innerHTML;
      btn.classList.add('is-done');
      btn.innerHTML = '已复制';
      setTimeout(function () {
        btn.classList.remove('is-done');
        btn.innerHTML = original;
      }, 1600);
    });
  });

  /* ---------- Code block: 语言角标 + 复制 ---------- */
  var LANG_LABELS = {
    js: 'JavaScript', javascript: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', typescript: 'TypeScript', tsx: 'TSX',
    py: 'Python', python: 'Python', rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java',
    c: 'C', cpp: 'C++', cs: 'C#', php: 'PHP', swift: 'Swift', kt: 'Kotlin',
    sh: 'Shell', bash: 'Bash', zsh: 'Zsh', powershell: 'PowerShell', ps1: 'PowerShell',
    yml: 'YAML', yaml: 'YAML', json: 'JSON', toml: 'TOML', ini: 'INI', xml: 'XML',
    html: 'HTML', css: 'CSS', scss: 'SCSS', less: 'Less', vue: 'Vue',
    md: 'Markdown', markdown: 'Markdown', sql: 'SQL', diff: 'Diff', dockerfile: 'Dockerfile',
    nginx: 'Nginx', plaintext: 'Plaintext', text: 'Plaintext', ejs: 'EJS'
  };
  function langLabel(name) {
    if (!name) return 'Plaintext';
    var key = String(name).toLowerCase();
    return LANG_LABELS[key] || key.toUpperCase();
  }
  function codeLangOf(el) {
    var parts = String(el.className || '').split(/\s+/);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p || p === 'highlight' || p === 'code' || p === 'figure') continue;
      return p;
    }
    return '';
  }

  $$('figure.highlight').forEach(function (fig) {
    var lang = codeLangOf(fig);
    if (lang) {
      var tag = document.createElement('span');
      tag.className = 'code-lang';
      tag.textContent = langLabel(lang);
      fig.appendChild(tag);
    }
    if (fig.querySelector('.code-copy')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = '复制';
    btn.addEventListener('click', function () {
      var code = fig.querySelector('.code pre code') || fig.querySelector('code');
      copyText((code || fig).innerText).then(function () {
        btn.textContent = '已复制';
        btn.classList.add('is-done');
        setTimeout(function () {
          btn.textContent = '复制';
          btn.classList.remove('is-done');
        }, 1600);
      });
    });
    fig.appendChild(btn);
  });

  // 兜底：非 highlight 结构的代码块
  $$('.post-content pre').forEach(function (pre) {
    if (pre.closest('figure.highlight')) return;
    if (pre.querySelector('.code-copy')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = '复制';
    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      copyText((code || pre).innerText).then(function () {
        btn.textContent = '已复制';
        btn.classList.add('is-done');
        setTimeout(function () {
          btn.textContent = '复制';
          btn.classList.remove('is-done');
        }, 1600);
      });
    });
    pre.appendChild(btn);
  });

  /* ---------- 音乐播放器 ---------- */
  var audio = $('#music-audio');
  var musicCard = $('#music-card');
  if (audio && musicCard) {
    var playBtn = $('#music-play', musicCard);
    var prevBtn = $('#music-prev', musicCard);
    var nextBtn = $('#music-next', musicCard);
    var shuffleBtn = $('#music-shuffle', musicCard);
    var repeatBtn = $('#music-repeat', musicCard);
    var musicProgress = $('#music-progress', musicCard);
    var progressFill = $('#music-progress-fill', musicCard);
    var currentEl = $('#music-current', musicCard);
    var durationEl = $('#music-duration', musicCard);
    var volumeTrack = $('#music-volume-track', musicCard);
    var volumeFill = $('#music-volume-fill', musicCard);

    var srcs = (audio.getAttribute('data-srcs') || audio.getAttribute('src') || '')
      .split('|').map(function (s) { return s.trim(); }).filter(Boolean);
    var index = 0;
    var shuffle = false;
    var repeatOne = false;

    function fmt(sec) {
      if (!isFinite(sec) || sec < 0) sec = 0;
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    function setPlaying(on) {
      musicCard.classList.toggle('is-playing', on);
      if (playBtn) playBtn.setAttribute('aria-label', on ? '暂停' : '播放');
    }
    function load(i) {
      if (!srcs.length) return;
      index = (i + srcs.length) % srcs.length;
      audio.src = srcs[index];
      audio.load();
      progressFill && (progressFill.style.width = '0%');
      currentEl && (currentEl.textContent = '00:00');
    }
    if (srcs.length > 1) audio.removeAttribute('loop');

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (!srcs.length) return;
        if (audio.paused) audio.play().catch(function () {}); else audio.pause();
      });
    }
    ['play', 'pause'].forEach(function (evt) {
      audio.addEventListener(evt, function () { setPlaying(!audio.paused); });
    });
    audio.addEventListener('loadedmetadata', function () {
      durationEl && (durationEl.textContent = fmt(audio.duration));
      if (musicProgress) musicProgress.setAttribute('aria-valuemax', String(Math.round(audio.duration) || 0));
    });
    audio.addEventListener('timeupdate', function () {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progressFill && (progressFill.style.width = pct + '%');
      currentEl && (currentEl.textContent = fmt(audio.currentTime));
      if (musicProgress) musicProgress.setAttribute('aria-valuenow', String(Math.round(pct)));
    });
    audio.addEventListener('ended', function () {
      if (repeatOne) { audio.currentTime = 0; audio.play().catch(function () {}); return; }
      if (srcs.length > 1) { load(shuffle ? Math.floor(Math.random() * srcs.length) : index + 1); audio.play().catch(function () {}); }
      else setPlaying(false);
    });

    if (prevBtn) prevBtn.addEventListener('click', function () {
      if (audio.currentTime > 3) { audio.currentTime = 0; return; }
      if (srcs.length > 1) { load(index - 1); audio.play().catch(function () {}); }
      else audio.currentTime = 0;
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (srcs.length > 1) { load(shuffle ? Math.floor(Math.random() * srcs.length) : index + 1); audio.play().catch(function () {}); }
    });
    if (shuffleBtn) shuffleBtn.addEventListener('click', function () {
      shuffle = !shuffle;
      shuffleBtn.classList.toggle('is-on', shuffle);
    });
    if (repeatBtn) repeatBtn.addEventListener('click', function () {
      repeatOne = !repeatOne;
      repeatBtn.classList.toggle('is-on', repeatOne);
      audio.loop = repeatOne && srcs.length <= 1;
    });

    function seekFromEvent(e) {
      if (!audio.duration) return;
      var rect = musicProgress.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var ratio = Math.min(1, Math.max(0, x / rect.width));
      audio.currentTime = ratio * audio.duration;
    }
    if (musicProgress) {
      musicProgress.addEventListener('click', seekFromEvent);
      musicProgress.addEventListener('keydown', function (e) {
        if (!audio.duration) return;
        if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
      });
    }

    var defaultVolume = 0.8;
    function setVolume(v) {
      v = Math.min(1, Math.max(0, v));
      audio.volume = v;
      volumeFill && (volumeFill.style.width = (v * 100) + '%');
    }
    volumeFill && setVolume(defaultVolume);
    if (volumeTrack) {
      var draggingVol = false;
      function volFromEvent(e) {
        var rect = volumeTrack.getBoundingClientRect();
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        setVolume(x / rect.width);
      }
      volumeTrack.addEventListener('mousedown', function (e) { draggingVol = true; volFromEvent(e); e.preventDefault(); });
      window.addEventListener('mousemove', function (e) { if (draggingVol) volFromEvent(e); });
      window.addEventListener('mouseup', function () { draggingVol = false; });
      volumeTrack.addEventListener('touchstart', volFromEvent, { passive: true });
      volumeTrack.addEventListener('touchmove', volFromEvent, { passive: true });
    }

    if (srcs.length) load(0);
  }

  /* ---------- Calendar ---------- */
  $$('[data-calendar]').forEach(function (box) {
    var marks = (box.getAttribute('data-marks') || '').split(',').filter(Boolean);
    var markSet = {};
    marks.forEach(function (m) { markSet[m] = true; });

    var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    var cursor = new Date();
    cursor.setDate(1);

    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function key(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }

    function render() {
      var year = cursor.getFullYear();
      var month = cursor.getMonth();
      var firstDay = new Date(year, month, 1).getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var today = new Date();
      var todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());

      var html = '<div class="calendar-head">' +
        '<span class="calendar-title">' + year + ' 年 ' + (month + 1) + ' 月</span>' +
        '<span class="calendar-nav">' +
          '<button type="button" data-cal-prev aria-label="上个月">' + SVG_CHEVRON_FLIP + '</button>' +
          '<button type="button" data-cal-next aria-label="下个月">' + SVG_CHEVRON + '</button>' +
        '</span>' +
      '</div>' +
      '<div class="calendar-weekdays">' +
        weekdays.map(function (w) { return '<span>' + w + '</span>'; }).join('') +
      '</div>' +
      '<div class="calendar-days">';

      for (var i = 0; i < firstDay; i++) html += '<span class="calendar-day is-blank"></span>';
      for (var d = 1; d <= daysInMonth; d++) {
        var k = key(year, month, d);
        var cls = 'calendar-day';
        if (k === todayKey) cls += ' is-today';
        if (markSet[k]) cls += ' has-post';
        html += '<span class="' + cls + '">' + d + '</span>';
      }
      html += '</div>';
      box.innerHTML = html;

      var prev = box.querySelector('[data-cal-prev]');
      var next = box.querySelector('[data-cal-next]');
      if (prev) prev.addEventListener('click', function () { cursor.setMonth(cursor.getMonth() - 1); render(); });
      if (next) next.addEventListener('click', function () { cursor.setMonth(cursor.getMonth() + 1); render(); });
    }

    render();
  });
  /* ---------- TOC scroll spy ---------- */
  var tocLinks = $$('.toc-body a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var headings = tocLinks
      .map(function (a) {
        var id = decodeURIComponent((a.getAttribute('href') || '').replace(/^#/, ''));
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    var activeId = '';
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        activeId = entry.target.id;
        tocLinks.forEach(function (a) {
          a.classList.toggle('is-active', decodeURIComponent((a.getAttribute('href') || '').replace(/^#/, '')) === activeId);
        });
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

    headings.forEach(function (h) { spy.observe(h); });
  }

  /* ---------- Search ---------- */
  var overlay = $('#search-overlay');
  var input = $('#search-input');
  var results = $('#search-results');
  var status = $('#search-status');
  var openBtn = $('#search-toggle');
  var closeBtn = $('#search-close');
  var searchData = null;
  var searchLoading = false;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, query) {
    var safe = escapeHtml(text);
    if (!query) return safe;
    var pattern = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      return safe.replace(new RegExp('(' + pattern + ')', 'gi'), '<mark>$1</mark>');
    } catch (e) {
      return safe;
    }
  }

  function loadIndex() {
    if (searchData || searchLoading) return Promise.resolve(searchData);
    searchLoading = true;
    var url = (window.ECHO_ROOT || '/') + 'search.json';
    return fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchData = Array.isArray(data) ? data : [];
        searchLoading = false;
        return searchData;
      })
      .catch(function () {
        searchLoading = false;
        searchData = [];
        return searchData;
      });
  }

  function renderResults(list, query) {
    if (!list.length) {
      results.innerHTML = '<p class="search-hint">没有找到与「' + escapeHtml(query) + '」相关的内容</p>';
      return;
    }
    results.innerHTML = list.map(function (item) {
      var meta = [];
      if (item.resource && item.resourceType) {
        meta.push('<span class="badge">' + escapeHtml(item.resourceType) + '</span>');
      }
      if (item.date) meta.push('<span>' + escapeHtml(item.date) + '</span>');
      if (item.categories && item.categories.length) {
        meta.push('<span>' + escapeHtml(item.categories.join(' / ')) + '</span>');
      }
      return '<a class="search-result" href="' + escapeHtml(item.url) + '">' +
        '<div class="search-result-title">' + highlight(item.title, query) + '</div>' +
        '<div class="search-result-meta">' + meta.join('') + '</div>' +
        '</a>';
    }).join('');
  }

  function runSearch(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '';
      status.textContent = '输入关键词开始搜索';
      return;
    }
    loadIndex().then(function (data) {
      var matched = data.filter(function (item) {
        var haystack = [item.title, (item.tags || []).join(' '), (item.categories || []).join(' '), item.excerpt]
          .join(' ')
          .toLowerCase();
        return haystack.indexOf(q) > -1;
      }).slice(0, 30);
      status.textContent = '找到 ' + matched.length + ' 条结果';
      renderResults(matched, query.trim());
    });
  }

  function openSearch() {
    if (!overlay) return;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    loadIndex();
    setTimeout(function () { if (input) input.focus(); }, 40);
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (results) results.innerHTML = '';
    if (status) status.textContent = '输入关键词开始搜索';
  }

  if (openBtn) openBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
  }

  var searchTimer = null;
  if (input) {
    input.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var value = input.value;
      searchTimer = setTimeout(function () { runSearch(value); }, 160);
    });
  }

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeSearch();
      return;
    }
    if (e.key === '/' && !typing) {
      e.preventDefault();
      openSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
})();
