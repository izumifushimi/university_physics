/* ==========================================================================
   app.js —— 应用启动、哈希路由、全局框架
   路由表：
     #/                       首页
     #/course                 课程总目录
     #/chapter/ch01           章节概览
     #/learn/ch01-s03         小节学习页
     #/labs                   互动实验室目录
     #/lab/lab-constant-accel 单个实验
     #/formulas               公式速查
     #/search?q=加速度        全站搜索
     #/me                     我的学习
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;

  const NAV = [
    { href: '#/course', label: '课程', match: /^#\/(course|chapter|learn|exam|prep|challenge)/ },
    { href: '#/labs', label: '互动实验', match: /^#\/(labs|lab\/)/ },
    { href: '#/formulas', label: '公式速查', match: /^#\/formulas/ },
    { href: '#/me', label: '我的学习', match: /^#\/me/ }
  ];

  const App = {
    root: null,
    cleanup: [],
    currentRoute: '',

    onCleanup: function (fn) { this.cleanup.push(fn); },

    header: function () {
      return '' +
        '<header class="site-header">' +
        '  <div class="header-inner">' +
        '    <a class="brand" href="#/"><span class="mark">φ</span>' +
        '      <span class="name">大学物理</span><span class="tag">学习站</span></a>' +
        '    <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mainNav">目录</button>' +
        '    <nav class="main-nav" id="mainNav" aria-label="主导航">' +
        NAV.map(function (n) { return '<a href="' + n.href + '">' + n.label + '</a>'; }).join('') +
        '    </nav>' +
        '    <form class="header-search" role="search" id="headerSearchForm">' +
        '      <span class="ico" aria-hidden="true">⌕</span>' +
        '      <label class="sr-only" for="headerSearch">搜索课程、公式与术语</label>' +
        '      <input type="search" id="headerSearch" name="q" placeholder="搜索知识点 / 公式" autocomplete="off">' +
        '      <kbd aria-hidden="true">/</kbd>' +
        '    </form>' +
        '  </div>' +
        '</header>';
    },

    footer: function () {
      return '' +
        '<footer class="site-footer"><div class="footer-inner">' +
        '  <p>大学物理学习站 · 课程内容为原创讲解，参考 OpenStax《University Physics》核对主题范围。</p>' +
        '  <div class="footer-links">' +
        '    <a href="#/course">课程目录</a>' +
        '    <a href="#/labs">互动实验</a>' +
        '    <a href="#/formulas">公式速查</a>' +
        '    <a href="#/me">我的学习</a>' +
        '  </div>' +
        '</div></footer>';
    },

    parseHash: function () {
      const raw = (location.hash || '#/').slice(1);
      const hashParts = raw.split('#'), routePart = hashParts.shift();
      const [pathPart, queryPart] = routePart.split('?');
      const query = Object.fromEntries(new URLSearchParams(queryPart || ''));
      let anchor = hashParts.join('#');
      try { anchor = decodeURIComponent(anchor); } catch (e) { anchor = ''; }
      return { path: pathPart || '/', query: query, anchor: anchor, raw: raw };
    },

    setActiveNav: function (path) {
      document.querySelectorAll('.main-nav a').forEach(function (a) {
        const match = NAV.find(function (n) { return n.href === a.getAttribute('href'); });
        if (match && match.match.test('#' + path)) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    },

    render: function () {
      const route = this.parseHash();
      const path = route.path;
      const key = path + JSON.stringify(route.query);
      if (key === this.currentRoute && route.anchor && document.getElementById(route.anchor)) { document.getElementById(route.anchor).scrollIntoView(); return; }
      this.currentRoute = key;

      // 清理上一页
      this.cleanup.forEach(function (fn) { try { fn(); } catch (e) { console.warn(e); } });
      this.cleanup = [];
      if (PHYS.lab && PHYS.lab.destroyAll) PHYS.lab.destroyAll();

      let view = null;
      let m;

      if (path === '/' || path === '') view = PHYS.views.home();
      else if (path === '/course') view = PHYS.views.course();
      else if ((m = path.match(/^\/chapter\/([a-z0-9\-]+)$/))) view = PHYS.views.chapter(m[1]);
      else if ((m = path.match(/^\/learn\/([a-z0-9\-]+)$/))) view = PHYS.views.section(m[1]);
      else if ((m = path.match(/^\/exam\/([a-z0-9\-]+)$/))) view = PHYS.views.exam(m[1]);
      else if ((m = path.match(/^\/prep\/([a-z0-9\-]+)$/))) view = PHYS.views.prep(m[1]);
      else if ((m = path.match(/^\/challenge\/([a-z0-9\-]+)$/))) view = PHYS.views.challenge(m[1]);
      else if (path === '/labs') view = PHYS.views.labs();
      else if ((m = path.match(/^\/lab\/([a-z0-9\-]+)$/))) view = PHYS.views.labPage(m[1]);
      else if (path === '/formulas') view = PHYS.views.formulas(route.query);
      else if (path === '/search') view = PHYS.views.search(route.query.q || '');
      else if (path === '/me') view = PHYS.views.me();
      else view = PHYS.views.notFound(path);

      if (!view) view = PHYS.views.notFound(path);

      const host = document.getElementById('view');
      host.innerHTML = view.html;

      document.title = (view.title ? view.title + ' · ' : '') + '大学物理学习站';
      this.setActiveNav(path);
      this.closeMobileNav();

      if (view.mount) {
        try { view.mount(host); } catch (e) { console.error('页面初始化失败：', e); }
      }

      // 滚动处理
      if (route.anchor && document.getElementById(route.anchor)) {
        document.getElementById(route.anchor).scrollIntoView();
      } else if (view.keepScroll) {
        const pos = PHYS.Store.getPosition();
        const restoreScroll = pos && pos.sectionId === view.sectionId ? pos.scroll || 0 : 0;
        requestAnimationFrame(function () { global.scrollTo(0, restoreScroll); });
      } else if (path !== '/search') {
        global.scrollTo(0, 0);
      }
    },

    closeMobileNav: function () {
      const nav = document.getElementById('mainNav');
      const btn = document.getElementById('navToggle');
      if (nav) nav.classList.remove('open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    },

    bindGlobal: function () {
      const self = this;

      document.getElementById('navToggle').addEventListener('click', function () {
        const nav = document.getElementById('mainNav');
        const open = nav.classList.toggle('open');
        this.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      const form = document.getElementById('headerSearchForm');
      const input = document.getElementById('headerSearch');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = input.value.trim();
        if (q) location.hash = '#/search?q=' + encodeURIComponent(q);
        input.blur();
        self.closeMobileNav();
      });

      // “/” 聚焦搜索，Esc 清空
      document.addEventListener('keydown', function (e) {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
        if (e.key === '/' && !typing) {
          e.preventDefault();
          input.focus();
          input.select();
        } else if (e.key === 'Escape') {
          if (document.activeElement === input && input.value) { input.value = ''; }
          self.closeMobileNav();
        }
      });

      document.addEventListener('click', function (event) {
        const a = event.target.closest && event.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href.startsWith('#/')) return;
        const target = document.getElementById(href.slice(1));
        if (target) { event.preventDefault(); target.scrollIntoView(); }
      });

      // 外部锚点跳转（课程内引用）
      document.addEventListener('click', function (e) {
        const a = e.target.closest && e.target.closest('a[data-xref]');
        if (!a) return;
        const id = a.getAttribute('data-xref');
        const f = PHYS.getFormula(id);
        if (f) {
          e.preventDefault();
          location.hash = '#/formulas?focus=' + encodeURIComponent(id);
        }
      });

      global.addEventListener('hashchange', function () { self.render(); });
    },

    start: function () {
      PHYS.Store.init();
      this.root = document.getElementById('view');
      document.getElementById('app-header').innerHTML = this.header();
      document.getElementById('app-footer').innerHTML = this.footer();
      this.bindGlobal();
      this.render();
    }
  };

  PHYS.App = App;
  document.addEventListener('DOMContentLoaded', function () { App.start(); });
})(typeof window !== 'undefined' ? window : globalThis);
