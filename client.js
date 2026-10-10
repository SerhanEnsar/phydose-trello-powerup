/* PhyDose-CT Trello Power-Up
 * - Başlıktaki [RQx] / [Ex] / [ADR-xxx] kodunu rozet olarak gösterir
 * - Deney kartlarında girilen PSNR / SSIM / ΔHU değerlerini rozet yapar
 * - Bitti listesinde checklist'i eksik kartlara uyarı rozeti koyar
 * - "Repo'da aç" ve "Metrik gir" kart butonları
 */
var BASE = new URL('./', window.location.href).href;
var ICON = BASE + 'icon.svg';
var DONE_LIST = /bitti/i;

function parseCode(name) {
  var m = /^\s*\[(RQ\d+|E\d+|ADR-\d+)\]/i.exec(name || '');
  if (!m) return null;
  var code = m[1].toUpperCase();
  if (code.indexOf('RQ') === 0) return { code: code, kind: 'rq', color: 'purple' };
  if (code.indexOf('ADR') === 0) return { code: code, kind: 'adr', color: 'pink' };
  return { code: code, kind: 'exp', color: 'lime' };
}

function repoPath(info) {
  if (info.kind === 'rq') return 'blob/{b}/research/questions.md';
  if (info.kind === 'exp') return 'blob/{b}/experiments/' + info.code + '.md';
  return 'tree/{b}/research/decisions';
}

function loadCardState(t) {
  return Promise.all([
    t.card('name', 'idList', 'badges'),
    t.lists('id', 'name'),
    t.get('card', 'shared', 'metrics', null)
  ]).then(function (r) {
    var card = r[0], lists = r[1];
    var list = lists.filter(function (l) { return l.id === card.idList; })[0];
    return { card: card, listName: list ? list.name : '', metrics: r[2] };
  });
}

function buildBadges(s, detailed) {
  var badges = [];
  var info = parseCode(s.card.name);
  if (info) badges.push({ title: 'Kod', text: info.code, color: info.color });

  var m = s.metrics;
  if (m) {
    [['psnr', 'PSNR', ' dB'], ['ssim', 'SSIM', ''], ['dhu', 'ΔHU', ' HU']].forEach(function (k) {
      if (m[k[0]] !== undefined && m[k[0]] !== '') {
        badges.push({ title: k[1], text: detailed ? m[k[0]] + k[2] : k[1] + ' ' + m[k[0]], color: 'sky' });
      }
    });
  }

  var b = s.card.badges || {};
  if (DONE_LIST.test(s.listName) && b.checkItems > 0 && b.checkItemsChecked < b.checkItems) {
    badges.push({
      title: 'Bitti tanımı',
      text: '⚠ Bitti tanımı eksik (' + b.checkItemsChecked + '/' + b.checkItems + ')',
      color: 'red'
    });
  }
  return badges;
}

function openSettings(t) {
  return t.popup({ title: 'PhyDose ayarları', url: BASE + 'settings.html', height: 230 });
}

TrelloPowerUp.initialize({
  'card-badges': function (t) {
    return loadCardState(t).then(function (s) { return buildBadges(s, false); });
  },

  'card-detail-badges': function (t) {
    return loadCardState(t).then(function (s) { return buildBadges(s, true); });
  },

  'card-buttons': function (t) {
    return Promise.all([
      t.card('name'),
      t.get('board', 'shared', 'repo', ''),
      t.get('board', 'shared', 'branch', 'main')
    ]).then(function (r) {
      var info = parseCode(r[0].name);
      var repo = (r[1] || '').replace(/\/+$/, '');
      var buttons = [];

      if (info) {
        if (repo) {
          buttons.push({
            icon: ICON,
            text: "📂 Repo'da aç",
            url: repo + '/' + repoPath(info).replace('{b}', r[2] || 'main'),
            target: 'PhyDose repo'
          });
        } else {
          buttons.push({ icon: ICON, text: "📂 Repo'da aç (ayar gerekli)", callback: openSettings });
        }
      }
      if (info && info.kind === 'exp') {
        buttons.push({
          icon: ICON,
          text: '📊 Metrik gir',
          callback: function (t) {
            return t.popup({ title: 'Deney metrikleri', url: BASE + 'metrics.html', height: 280 });
          }
        });
      }
      return buttons;
    });
  },

  'show-settings': openSettings
});
