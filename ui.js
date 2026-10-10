/* Popup'lar için ortak yardımcılar: izin kontrolü ve tür listesi. */
var t = TrelloPowerUp.iframe({ appKey: PHYDOSE_APP_KEY, appName: PHYDOSE_APP_NAME });

function msg(text, isError) {
  var el = document.getElementById('msg');
  el.textContent = text;
  el.className = 'msg' + (isError ? ' err' : '');
}

/* İzin yoksa "İzin ver" butonu gösterir; izin varsa `ready()` çağrılır. */
function requireAuth(ready) {
  var api = t.getRestApi();
  api.isAuthorized().then(function (ok) {
    if (ok) return ready();
    document.getElementById('auth').classList.remove('hidden');
    document.getElementById('main').classList.add('hidden');
    document.getElementById('authBtn').onclick = function () {
      api.authorize({ scope: 'read,write', expiration: 'never' }).then(function () {
        document.getElementById('auth').classList.add('hidden');
        document.getElementById('main').classList.remove('hidden');
        ready();
      }).catch(function () { msg('İzin verilmedi. Tekrar deneyebilirsin.', true); });
    };
    t.sizeTo('body');
  });
}

/* Tür butonlarını çizer; tıklanınca onPick(type) çağrılır. */
function renderTypes(container, onPick) {
  PHYDOSE_TYPES.forEach(function (type) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'type';
    var parts = type.label.split(' ');
    b.innerHTML = '<span class="emoji">' + parts[0] + '</span><span><b></b><small></small></span>';
    b.querySelector('b').textContent = type.title;
    b.querySelector('small').textContent = type.hint;
    b.onclick = function () {
      container.querySelectorAll('.type').forEach(function (x) { x.classList.remove('selected'); });
      b.classList.add('selected');
      onPick(type);
    };
    container.appendChild(b);
  });
}
