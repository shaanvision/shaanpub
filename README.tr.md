# ShaanPub (BETA)

Salt Okunur Fediverse Profilleri için Hafif Statik ActivityPub Sunucusu – Shaan Vision

---
_English documentation available in [README.md](README.md)_
---
## Genel Bakış

**ShaanPub**, kimlik doğrulama veya etkileşim özellikleri olmadan salt okunur bir Fediverse profili yayınlamak için tasarlanmış TypeScript tabanlı, statik bir ActivityPub sunucusudur. Kişisel portfolyo, blog veya marka kimliği yayını için uygundur. ShaanPub sayesinde içerikleriniz Mastodon ve Pleroma gibi Fediverse ağlarına ActivityPub protokolü ile entegre edilebilir.

- **Ana Dil**: TypeScript
- **Diğer Diller**: JavaScript, CSS
- **Lisans**: MIT
- **Durum**: BETA
- **Fediverse Örneği**: [@shaanvision@social.shaanvision.com.tr](https://social.shaanvision.com.tr/@shaanvision)

---

## Özellikler

- ActivityPub uyumlu JSON uç noktalarını uygular (WebFinger, actor, outbox vb.)
- Salt okunur profil ve içerik sunar, etkileşim/veri tabanı gerekmez
- Statik hosting ile kolayca kullanılabilir
- Basit JSON dosyaları ile kolay yapılandırma
- Profil ve gönderi verileriyle kolay kurulum
- Farklı Fediverse sunucularıyla uyumlu çalışacak şekilde tasarlanmıştır
- Profil doğrulama için açık anahtar yayınlama imkanı

---

## Fediverse Entegrasyon Örneği

- WebFinger:  
  `https://social.shaanvision.com.tr/.well-known/webfinger?resource=acct:shaanvision@social.shaanvision.com.tr`

Yanıt:
```json
{
  "subject": "acct:shaanvision@social.shaanvision.com.tr",
  "aliases": [
    "https://social.shaanvision.com.tr/users/shaanvision.json",
    "https://social.shaanvision.com.tr/@shaanvision"
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "type": "text/html",
      "href": "https://social.shaanvision.com.tr/@shaanvision"
    },
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://social.shaanvision.com.tr/users/shaanvision.json"
    }
  ]
}
```

- Actor Uç Noktası (`application/activity+json`):  
  `https://social.shaanvision.com.tr/users/shaanvision.json`

Yanıt:
```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    ...
  ],
  "id": "https://social.shaanvision.com.tr/users/shaanvision.json",
  "type": "Person",
  "preferredUsername": "shaanvision",
  "name": "Shaan Vision",
  "summary": "ShaanPub - Shaan Vision. Kurumlara modern yazılım çözümleri geliştiriyoruz ve açık kaynak felsefesini destekliyoruz. Teknoloji, kod ve gelecek üzerine konuşalım.",
  "inbox": "https://social.shaanvision.com.tr/users/shaanvision/inbox.json",
  "outbox": "https://social.shaanvision.com.tr/users/shaanvision/outbox.json",
  ... // detaylı örnek için dokümantasyona bakınız
}
```

---

## Kullanıma Başlangıç

### Gereksinimler

- Node.js v18+
- npm/yarn

### Kurulum

```sh
git clone https://github.com/shaanvision/shaanpub.git
cd shaanpub
npm install
```

### Yapılandırma

- Örnek dosyaları kopyalayın:
  ```sh
  cp config.json.example config.json
  cp posts.json.example posts.json
  ```
- `config.json` dosyasını (profil bilgileri) ve `posts.json` dosyasını (gönderiler) düzenleyin.
- `public.pem` dosyasına açık anahtarınızı yerleştirin.

#### Anahtar Çifti Üretme Örneği

```sh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

### Sunucuyu Çalıştırma

```sh
node server.mjs
```
Veya statik eksport için build araçlarını/scripts dizinini kullanabilirsiniz.

### Klasör Yapısı

- `src/` – Tüm TypeScript kaynak kodları
- `server.mjs` – HTTP sunucu & REST uç noktaları
- `config.json` – Profil yapılandırması
- `posts.json` – Gönderi verileri
- `public/` – Statik dosyalar
- `public.pem` – Açık anahtar
- Ek yapılandırmalar: Next.js, Tailwind, PostCSS

---

## API Uç Noktaları

- `/.well-known/webfinger` – WebFinger kaynağı
- `/users/{username}.json` – ActivityPub actor objesi (profil)
- `/users/{username}/outbox.json` – Gönderi/aktivite listesi
- `/users/{username}/inbox.json` – ActivityPub gelen kutusu (salt okunur)
- `/users/{username}/followers.json` – Takipçi listesi (statik/boş olabilir)

Tüm uç noktalar `application/activity+json` veya `application/jrd+json` formatında çalışır.

---

## Örnek Yapılandırma Dosyaları

Hızlı başlangıç için [`config.json.example`](config.json.example) ve [`posts.json.example`](posts.json.example) dosyalarını inceleyin.

---

## Fediverse Profil Keşfi & Görünürlük Notları

Profilinizin Mastodon veya benzeri arayüzlerde görünmesini istiyorsanız:

- **Aktivite Gerekliliği:** Profiliniz (actor) en az bir gönderi veya aktivite yayınlamış olmalıdır. Mastodon ve çoğu Fediverse istemcisi, uzak hesabı ancak ilk gönderi/outbox aktivitesi sonrası keşfeder ve gösterir.

- **Önbellek (Cache):** Mastodon (ve benzer platformlar) uzak hesap ve gönderi verilerini **12 veya 24 saat** boyunca önbelleğe alır. İlk gönderiniz yayımlandıktan sonra profilinizin görünmesi önbellek yenilemesi sonrası gerçekleşir. Profilde yapılan değişiklikler ve yeni gönderiler için de bu gecikme süresi geçerlidir.

- **İpucu:** Profilinizin hızlıca görünür olması için mutlaka bir gönderi yayınlayın. Güncellemelerin ve ilk görünmenin 12–24 saat arası gecikmeyle olabileceğini unutmayın.

- **Görünürlük Yardımı:**  
  Hesabınız ilk gönderiyi yayınladıktan sonra Mastodon veya uyumlu bir platformda hâlâ görünmüyorsa [shaanpub.shaanvision.com.tr](https://shaanpub.shaanvision.com.tr) adresini ziyaret edin. Burada görünürlük ve keşif sorunlarını gidermek için bilgi ve tanılama desteği bulabilirsiniz.

---

## Katkı Sağlama

- Fork'layın, geliştirin ve yeni özellik/rapor/bug düzeltmesi için pull request açın.
- Kod tabanı Tailwind/PostCSS ve modern TypeScript araçlarını kullanır.
- ActivityPub uyumluluğu konusunda sorun yaşarsanız issue açabilirsiniz.

---

## Lisans

GPL3 Lisansı – Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

---

## Linkler & Katkılar

- Web Sitesi: [https://shvn.tr](https://shvn.tr)
- GitHub: [https://github.com/shaanvision](https://github.com/shaanvision)
- GitLab: [https://gitlab.com/shaanvision](https://gitlab.com/shaanvision)
- Profil İkonu: ![Logo](https://www.shaanvision.com.tr/logo.png)

---
