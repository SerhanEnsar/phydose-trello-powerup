# PhyDose Trello Power-Up

PhyDose-CT ekip panosu için küçük bir Trello Power-Up. GitHub Pages üzerinden statik olarak yayınlanır.

## Ne yapar?
- **➕ Yeni kart** (panonun üst çubuğunda): kartın adını yazar, türünü seçer ve listeyi belirlersin. Kart hazır şablonuyla oluşturulur.
- **🧩 Tür seç**: Türü olmayan her kartta görünür. Seçtiğin türün etiketi, doldurulacak açıklaması ve **Bitti mi?** listesi karta eklenir.
- **📊 Metrik gir**: Model eğitimi kartlarında PSNR, SSIM ve ΔHU sonuçları rozet olarak gösterilir.
- **⚠ Uyarı**: Bir kart *Bitti* listesine taşındığında **Bitti mi?** listesi eksikse uyarı rozeti çıkar.

## Türü değiştirmek / yeni tür eklemek
Yalnızca `templates.js` dosyasını düzenle. Ardından `index.html` ve `*.html` içindeki `?v=` sürüm numarasını bir artır; böylece tarayıcılar yeni sürümü indirir.

## Kurulum (Trello app admin)
1. **Basic information** → *Iframe connector URL*: `https://serhanensar.github.io/phydose-trello-powerup/`
2. **Capabilities**: `board-buttons`, `card-badges`, `card-detail-badges`, `card-buttons`
3. **Trello Auth → Allowed origins**: `https://serhanensar.github.io`
4. Her ekip üyesi ilk kullanımda bir kez **🔑 İzin ver** butonuna basar.
