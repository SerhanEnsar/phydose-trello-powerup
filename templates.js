/* Kart türleri — TEK KAYNAK.
 * Yeni tür eklemek / değiştirmek için yalnızca bu dosyayı düzenleyin.
 * `label` panodaki etiket adıyla birebir aynı olmalı (etiket yoksa ilk kullanımda oluşturulur).
 */
var PHYDOSE_TYPES = [
  {
    id: 'kod', label: '💻 Kod', color: 'green',
    title: 'Kod / Geliştirme', hint: 'Yeni özellik, script, düzeltme',
    desc: '**Ne yapılacak?**\n\n\n**Nerede?** (hangi klasör / dosya)\n\n\n**Nasıl test edilecek?**\n\n\n**PR linki:**\n',
    checklist: ['Kod çalışıyor', 'Küçük bir testle denendi', 'PR açıldı ve linki karta eklendi', 'Bir ekip arkadaşı kontrol etti']
  },
  {
    id: 'egitim', label: '🧪 Model eğitimi', color: 'lime',
    title: 'Model eğitimi', hint: 'Bir eğitim denemesi ve sonuçları',
    desc: '**Ne deneniyor?** (amaç, önceki denemeden farkı)\n\n\n**Ayarlar:** model · veri · config dosyası\n\n\n**Sonuç:** (yalnızca gerçekten ölçülen değerler — kartta 📊 Metrik gir)\n\n\n**Yorum / sonraki adım:**\n',
    checklist: ['Config dosyası repoda', 'Eğitim tamamlandı', 'Sonuçlar girildi (📊 Metrik gir)', "Checkpoint Drive'a kaydedildi"]
  },
  {
    id: 'arastirma', label: '📚 Araştırma', color: 'purple',
    title: 'Araştırma', hint: 'Makale, patent, şartname okuma',
    desc: '**Soru:** neyi öğrenmek istiyoruz?\n\n\n**Kaynaklar:** (link + bir cümle özet)\n- \n\n**Sonuç:**\n',
    checklist: ['Kaynaklar bulundu', 'Her kaynağın linki açılıp doğrulandı', 'Özet yazıldı', 'Sonuç ekiple paylaşıldı']
  },
  {
    id: 'karar', label: '⚖️ Karar', color: 'pink',
    title: 'Karar', hint: 'Ekipçe seçim yapılacak konu',
    desc: '**Konu:**\n\n\n**Seçenekler:**\n1. \n2. \n\n**Önerimiz ve nedeni:**\n\n\n**Verilen karar:**\n',
    checklist: ['Seçenekler yazıldı', 'Cuma toplantısında konuşuldu', 'Karar verildi ve buraya yazıldı', 'İlgili dokümanlar güncellendi']
  },
  {
    id: 'dokuman', label: '📝 Doküman', color: 'sky',
    title: 'Doküman / Rapor', hint: 'Rapor, sunum, haftalık özet',
    desc: '**Ne için?**\n\n\n**Kim okuyacak?**\n\n\n**Link:**\n',
    checklist: ['Taslak yazıldı', 'Ekipten biri okudu', 'Son hali paylaşıldı']
  },
  {
    id: 'hata', label: '🐞 Hata', color: 'orange',
    title: 'Hata / Sorun', hint: 'Bozuk ya da beklenmedik davranış',
    desc: '**Ne oldu?**\n\n\n**Ne olmalıydı?**\n\n\n**Nasıl tekrar edilir?**\n1. \n\n**Hata mesajı / ekran görüntüsü:**\n',
    checklist: ['Hata tekrar edildi', 'Sebep bulundu', 'Düzeltildi', 'Düzeldiği kontrol edildi']
  },
  {
    id: 'toplanti', label: '📅 Toplantı', color: 'yellow',
    title: 'Toplantı', hint: 'Gündem ve alınan kararlar',
    desc: '**Tarih:**\n\n**Gündem:**\n- \n\n**Alınan kararlar:**\n- \n\n**Kim ne yapacak?**\n- \n',
    checklist: ['Gündem yazıldı', 'Toplantı yapıldı', 'Notlar eklendi', 'Çıkan işler kart olarak açıldı']
  },
  {
    id: 'gorev', label: '✅ Görev', color: 'blue',
    title: 'Genel görev', hint: 'Diğer her şey',
    desc: '**Ne yapılacak?**\n\n\n**Notlar:**\n',
    checklist: ['Yapıldı']
  }
];

var PHYDOSE_CHECKLIST = 'Bitti mi?';
// Trello API key herkese açıktır (gizli olan token'dır); REST izni için gerekli.
var PHYDOSE_APP_KEY = '74d317f63fdbac1528e78906eb14f273';
var PHYDOSE_APP_NAME = 'PhyDose';

function phydoseTypeOf(labels) {
  for (var i = 0; i < PHYDOSE_TYPES.length; i++) {
    for (var j = 0; j < (labels || []).length; j++) {
      if (labels[j].name === PHYDOSE_TYPES[i].label) return PHYDOSE_TYPES[i];
    }
  }
  return null;
}

/* Bir karta tür şablonunu uygular: etiket + açıklama + "Bitti mi?" listesi.
 * Mevcut açıklama silinmez; şablon altına eklenir. */
function phydoseApplyType(t, cardId, type, existingDesc) {
  var api = t.getRestApi();
  return Promise.all([api.getToken(), t.board('id', 'labels')]).then(function (r) {
    var token = r[0], board = r[1], desc = (existingDesc || '').trim();
    var call = phydoseCaller(token);

    var label = board.labels.filter(function (l) { return l.name === type.label; })[0];
    var labelId = label
      ? Promise.resolve(label.id)
      : call('POST', '/labels', { name: type.label, color: type.color, idBoard: board.id }).then(function (l) { return l.id; });

    return labelId.then(function (id) {
      return call('POST', '/cards/' + cardId + '/idLabels', { value: id }).catch(function () {});
    }).then(function () {
      return call('PUT', '/cards/' + cardId, { desc: desc ? type.desc + '\n---\n' + desc : type.desc });
    }).then(function () {
      return call('POST', '/cards/' + cardId + '/checklists', { name: PHYDOSE_CHECKLIST });
    }).then(function (cl) {
      // sırayı korumak için maddeleri tek tek ekle
      return type.checklist.reduce(function (p, item) {
        return p.then(function () { return call('POST', '/checklists/' + cl.id + '/checkItems', { name: item }); });
      }, Promise.resolve());
    });
  });
}

/* Trello REST çağrısı yapan küçük yardımcı (token, kullanıcının verdiği izinden gelir). */
function phydoseCaller(token) {
  var auth = 'key=' + encodeURIComponent(PHYDOSE_APP_KEY) + '&token=' + encodeURIComponent(token);
  return function (method, path, params) {
    var url = 'https://api.trello.com/1' + path + (path.indexOf('?') < 0 ? '?' : '&') + auth;
    var opts = { method: method };
    if (method !== 'GET') opts.body = new URLSearchParams(params || {});
    return fetch(url, opts).then(function (res) {
      if (!res.ok) throw new Error(method + ' ' + path + ' → ' + res.status);
      return res.json();
    });
  };
}
