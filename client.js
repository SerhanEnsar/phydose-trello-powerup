/* PhyDose-CT Trello Power-Up
 * - Panoda "➕ Yeni kart": başlık + tür seç → hazır şablonlu kart
 * - Türü olmayan kartlarda "🧩 Tür seç" → şablonu karta giydirir
 * - Model eğitimi kartlarında 📊 metrik rozetleri
 * - Bitti listesinde "Bitti mi?" listesi eksikse uyarı
 * Tür tanımları: templates.js
 */
var BASE = new URL('./', window.location.href).href;
var ICON = BASE + 'icon.svg';
var V = '?v=4';
var DONE_LIST = /bitti/i;
var INFO_LIST = /bilgi/i;

function cardState(t) {
  return Promise.all([
    t.card('name', 'idList', 'labels', 'badges'),
    t.lists('id', 'name'),
    t.get('card', 'shared', 'metrics', null)
  ]).then(function (r) {
    var card = r[0];
    var list = r[1].filter(function (l) { return l.id === card.idList; })[0];
    return { card: card, listName: list ? list.name : '', type: phydoseTypeOf(card.labels), metrics: r[2] };
  });
}

function openTypePicker(t) {
  return t.popup({ title: 'Kart türünü seç', url: BASE + 'type.html' + V, height: 460 });
}

function openMetrics(t) {
  return t.popup({ title: 'Eğitim sonuçları', url: BASE + 'metrics.html' + V, height: 300 });
}

function badges(s, detailed) {
  var out = [];
  if (!s.type && !INFO_LIST.test(s.listName)) {
    out.push(detailed
      ? { title: 'Tür', text: '🧩 Tür seç', color: 'yellow', callback: openTypePicker }
      : { text: '🧩 Tür seç', color: 'yellow' });
  }

  if (s.type && s.type.id === 'egitim') {
    var m = s.metrics || {};
    [['psnr', 'PSNR', ' dB'], ['ssim', 'SSIM', ''], ['dhu', 'ΔHU', ' HU']].forEach(function (k) {
      if (m[k[0]] !== undefined && m[k[0]] !== '') {
        out.push({ title: k[1], text: detailed ? m[k[0]] + k[2] : k[1] + ' ' + m[k[0]], color: 'sky' });
      }
    });
    if (detailed) {
      out.push({ title: 'Sonuçlar', text: s.metrics ? '✏️ Düzenle' : '📊 Metrik gir', color: 'sky', callback: openMetrics });
    }
  }

  var b = s.card.badges || {};
  if (DONE_LIST.test(s.listName) && b.checkItems > 0 && b.checkItemsChecked < b.checkItems) {
    out.push({ title: 'Uyarı', text: '⚠ Bitti mi? listesi eksik (' + b.checkItemsChecked + '/' + b.checkItems + ')', color: 'red' });
  }
  return out;
}

TrelloPowerUp.initialize({
  'board-buttons': function () {
    return [{
      icon: { dark: ICON, light: ICON },
      text: '➕ Yeni kart',
      callback: function (t) {
        return t.popup({ title: 'Yeni kart', url: BASE + 'newcard.html' + V, height: 560 });
      }
    }];
  },

  'card-badges': function (t) {
    return cardState(t).then(function (s) { return badges(s, false); });
  },

  'card-detail-badges': function (t) {
    return cardState(t).then(function (s) { return badges(s, true); });
  },

  'card-buttons': function (t) {
    return t.card('labels').then(function (c) {
      return phydoseTypeOf(c.labels) ? [] : [{ icon: ICON, text: '🧩 Tür seç', callback: openTypePicker }];
    });
  }
}, { appKey: PHYDOSE_APP_KEY, appName: PHYDOSE_APP_NAME });
