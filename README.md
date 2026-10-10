# PhyDose Trello Power-Up

PhyDose-CT ekip panosu için küçük bir Trello Power-Up. GitHub Pages üzerinden statik olarak yayınlanır, içinde gizli bilgi yoktur.

## Ne yapar?
- **Kod rozeti:** Kart başlığı `[RQ3] …`, `[E0] …` veya `[ADR-001] …` ile başlıyorsa kartta renkli bir rozet çıkar.
- **Metrik rozetleri:** Deney kartında (`[E…]`) **📊 Metrik gir** butonuyla girilen PSNR, SSIM ve ΔHU değerleri karta rozet olarak eklenir.
- **Bitti uyarısı:** Kart *Bitti* listesindeyken checklist'i eksikse kırmızı "⚠ Bitti tanımı eksik" rozeti çıkar.
- **📂 Repo'da aç:** RQ kartı `research/questions.md`'yi, deney kartı `experiments/EX.md`'yi, ADR kartı `research/decisions/` klasörünü açar. Repo adresi Power-Up ayarlarında tanımlanır.

## Kurulum (Trello app admin)
1. **Basic information** → *Iframe connector URL*: `https://serhanensar.github.io/phydose-trello-powerup/`
2. **Capabilities**: `card-badges`, `card-detail-badges`, `card-buttons`, `show-settings`
3. Panoda **Power-Ups → Custom → PhyDose → Add**, ardından ayarlardan repo adresini girin.
