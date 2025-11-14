# ShaanPub (BETA)

<div align="center">
  <img src="https://raw.githubusercontent.com/shaanvision/shaanpub/db5bf0ecea1a2da4129848675bb30ff69e249289/shaanpub-maskot.svg" alt="ShaanPub Maskotu" width="200">
</div>

Sadece Okunabilir Fediverse Profilleri için Hafif Statik ActivityPub Sunucusu – Shaan Vision

---
_İngilizce dokümantasyon [README.md](README.md) dosyasında mevcuttur_
---

## Genel Bakış

**ShaanPub**, sadece okunabilir Fediverse profilleri yayınlamak için tasarlanmış TypeScript tabanlı, statik bir ActivityPub sunucusudur (yani kamu portföyleri, bloglar ve kimlik yayını için uygundur; kimlik doğrulama veya etkileşimli özellikler içermez). ShaanPub, içeriğinizin ve profilinizin ActivityPub protokolünü kullanarak Mastodon ve Pleroma gibi Fediverse ağlarına entegre olmasını sağlar.

- **Ana Dil**: TypeScript
- **Diğer Diller**: JavaScript, CSS
- **Lisans**: GPL3
- **Durum**: BETA
- **Fediverse Örneği**: [@shaanvision@social.shaanvision.com.tr](https://social.shaanvision.com.tr/@shaanvision)

---

## Özellikler

- **Çoklu Kullanıcı Desteği**: Tek bir örnek üzerinde birden fazla Fediverse profili barındırın
- Kullanıcı profilleri için `/@kullaniciadi` formatında temiz URL'ler
- ActivityPub uyumlu JSON uç noktalarını uygular (WebFinger, aktör, giden kutusu, vb.)
- Genel, sadece okunabilir profiller ve içerik sunar
- Statik barındırma ile entegre olur (veritabanı gerektirmez)
- JSON dosyaları kullanarak basit yapılandırma
- Yapılandırma ve gönderi verilerini kopyalayarak kolay dağıtım
- Çeşitli Fediverse sunucularında tekdüze uyumluluk için tasarlanmıştır
- Profil doğrulaması için otomatik RSA anahtar üretimi
- Profesyonel tasarım ile modern, duyarlı kullanıcı arayüzü
- ShaanPub maskotu içeren paylaşımlı başlık ve altbilgi bileşenleri

---

## Yeni Özellikler (Son Güncellemeler)

### Çoklu Kullanıcı Desteği
- Tek bir `config.json` dosyasında birden fazla kullanıcı yapılandırın
- Her kullanıcı `/@kullaniciadi` adresinde kendi profil sayfasını alır
- Ana sayfa, yapılandırılmış tüm kullanıcıların listesini görüntüler
- Temiz, kullanıcı dostu URL'ler için URL yeniden yazma

### Yeniden Tasarlanmış Arayüz
- İlgi çekici düzene sahip modern ana sayfa
- Dinamik `ProfileHeader` ile profesyonel kullanıcı profil sayfaları
- Çağdaş tasarıma sahip güncellenmiş `PostCard` bileşeni
- ShaanPub maskotu içeren paylaşımlı `Header` bileşeni
- Kaynaklara bağlantılar içeren paylaşımlı `Footer` bileşeni
- Kullanıcı avatarlarında uzak görüntüler için destek

### Geliştirilmiş Anahtar Yönetimi
- `scripts/generate-keys.mjs` aracılığıyla otomatik RSA anahtar çifti üretimi
- `npm install` sırasında anahtarlar otomatik olarak üretilir (postinstall hook)
- Özel anahtarlar `.keys/` dizininde saklanır (güvenlik için gitignored)
- Genel anahtarlar ActivityPub doğrulaması için otomatik olarak kullanılır

---

## Fediverse Entegrasyon Örneği

- WebFinger:  
  `https://social.shaanvision.com.tr/.well-known/webfinger?resource=acct:shaanvision@social.shaanvision.com.tr`

Döner:
```json
{
  "subject": "acct:shaanvision@social.shaanvision.com.tr",
  "aliases": [
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
      "href": "https://social.shaanvision.com.tr/@shaanvision"
    }
  ]
}
```

- Aktör Uç Noktası (`application/activity+json`):  
  `https://social.shaanvision.com.tr/users/shaanvision.json`

Döner:
```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1",
    {
      "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
      "toot": "http://joinmastodon.org/ns#",
      "featured": {
        "@id": "toot:featured",
        "@type": "@id"
      },
      "discoverable": "toot:discoverable",
      "schema": "http://schema.org#",
      "PropertyValue": "schema:PropertyValue",
      "value": "schema:value"
    }
  ],
  "id": "https://social.shaanvision.com.tr/users/shaanvision.json",
  "type": "Person",
  "name": "Shaan Vision",
  "preferredUsername": "shaanvision",
  "summary": "ShaanPub - Shaan Vision. Modern kurumsal yazılım çözümleri geliştiriyor, açık kaynak destekçisi.",
  "inbox": "https://social.shaanvision.com.tr/users/shaanvision/inbox.json",
  "outbox": "https://social.shaanvision.com.tr/users/shaanvision/outbox.json",
  "followers": "https://social.shaanvision.com.tr/users/shaanvision/followers.json",
  "following": "https://social.shaanvision.com.tr/users/shaanvision/following.json",
  "icon": {
    "type": "Image",
    "mediaType": "image/png",
    "url": "https://www.shaanvision.com.tr/logo.png"
  },
  "image": {
    "type": "Image",
    "mediaType": "image/png",
    "url": "https://www.shaanvision.com.tr/logo.png"
  },
  "publicKey": {
    "id": "https://social.shaanvision.com.tr/users/shaanvision.json#main-key",
    "owner": "https://social.shaanvision.com.tr/users/shaanvision.json",
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
  },
  "attachment": [
    {
      "type": "PropertyValue",
      "name": "Website",
      "value": "<a href=\"https://www.shaanvision.com.tr\" rel=\"me nofollow noopener noreferrer\" target=\"_blank\">https://www.shaanvision.com.tr</a>"
    }
  ],
  "manuallyApprovesFollowers": true,
  "discoverable": true,
  "published": "2025-11-14T10:35:40.567Z"
}
```

---

## Başlarken

### Ön Gereksinimler

- Node.js v18+
- npm/yarn

### Kurulum

```sh
git clone https://github.com/shaanvision/shaanpub.git
cd shaanpub
npm install
```

**Not**: RSA anahtar çiftleri kurulum sırasında otomatik olarak oluşturulacaktır.

### Yapılandırma

#### Çoklu Kullanıcı Kurulumu

- Örnek yapılandırma dosyalarını kopyalayın:
  ```sh
  cp config.json.example config.json
  cp posts.json.example posts.json
  ```

- `config.json` dosyasını kullanıcılar dizisi ile düzenleyin:
  ```json
  {
    "users": [
      {
        "handle": "shaanvision",
        "name": "Shaan Vision",
        "bio": "Biyografiniz burada",
        "icon": "https://example.com/avatar.png"
      },
      {
        "handle": "digerkullanici",
        "name": "Diğer Kullanıcı",
        "bio": "Başka bir biyografi",
        "icon": "https://example.com/avatar2.png"
      }
    ]
  }
  ```

- `posts.json` dosyasını düzenleyin (gönderileri kullanıcı adına göre atayın):
  ```json
  {
    "posts": [
      {
        "author": "shaanvision",
        "slug": "ilk-gonderim",
        "content": "Merhaba Fediverse!",
        "published": "2025-01-01T00:00:00Z"
      }
    ]
  }
  ```

#### Anahtar Yönetimi

Anahtarlar kurulum sırasında `.keys/` dizininde otomatik olarak oluşturulur. Sistem şunları kullanır:
- `.keys/private.pem` – Özel anahtar (asla git'e commit edilmez)
- `.keys/public.pem` – Genel anahtar (ActivityPub doğrulaması için kullanılır)

Anahtarları manuel olarak yeniden oluşturmak için:
```sh
npm run generate-keys
```

### Sunucuyu Çalıştırma

#### Geliştirme
```sh
npm run dev
```

#### Üretim Derlemesi
```sh
npm run build
npm start
```

#### Statik Dışa Aktarma
```sh
npm run build
# Statik dosyalar `out/` dizininde olacaktır
```

### Klasör Yapısı

- `src/` – Temel TypeScript/React bileşenleri ve sayfaları
- `src/app/` – Next.js uygulama dizin yapısı
- `src/components/` – Yeniden kullanılabilir UI bileşenleri (Header, Footer, ProfileHeader, PostCard)
- `scripts/` – Yardımcı scriptler (anahtar üretimi, ActivityPub üretimi)
- `config.json` – Çoklu kullanıcı profil yapılandırması
- `posts.json` – Genel gönderi verileri
- `.keys/` – RSA anahtar çiftleri (gitignored)
- `public/` – Statik varlıklar
- `public/_redirects` – Statik barındırma için yeniden yazma
- Ek yapılandırmalar: Next.js, Tailwind, PostCSS

---

## URL Yapısı

- `/` – Tüm kullanıcıların listesini içeren ana sayfa
- `/@kullaniciadi` – Kullanıcı profil sayfası
- `/@kullaniciadi/posts/[slug]` – Bireysel gönderi sayfası
- `/.well-known/webfinger` – WebFinger uç noktası
- `/users/[handle].json` – ActivityPub aktör uç noktası
- `/users/[handle]/outbox.json` – Kullanıcının giden kutusu
- `/users/[handle]/inbox.json` – Kullanıcının gelen kutusu (sadece okunabilir)
- `/users/[handle]/followers.json` – Kullanıcının takipçileri

---

## API Uç Noktaları

Tüm uç noktalar `application/activity+json` veya `application/jrd+json` (WebFinger) sunar.

- `/.well-known/webfinger?resource=acct:kullaniciadi@domain`
  - WebFinger kaynak keşfi
- `/@kullaniciadi` (Accept: application/activity+json ile)
  - Kullanıcı profili için ActivityPub aktör nesnesi
- `/users/{handle}/outbox.json`
  - Genel etkinliklerin/gönderilerin listesi
- `/users/{handle}/inbox.json`
  - ActivityPub gelen kutusu için uç nokta (sadece okunabilir)
- `/users/{handle}/followers.json`
  - Takipçiler listesi (boş veya statik olabilir)

---

## Dağıtım

### Statik Barındırma (Netlify, Vercel, Cloudflare Pages)

1. Statik siteyi derleyin:
   ```sh
   npm run build
   ```

2. `out/` dizinini barındırma sağlayıcınıza dağıtın

3. URL yeniden yazma için `public/_redirects` dosyasının düzgün yapılandırıldığından emin olun

### Geleneksel Barındırma

1. Next.js sunucusunu derleyin ve başlatın:
   ```sh
   npm run build
   npm start
   ```

---

## Fediverse Profil Keşfi ve Görünürlük

### Önemli Notlar

- **Etkinlik Gerekli**: Profillerin Mastodon ve diğer Fediverse istemcileri tarafından keşfedilmesi için en az bir gönderi/etkinlik yayınlaması gerekir
- **Önbellekleme**: Mastodon uzak hesapları 12-24 saat önbelleğe alır. Yeni profiller ve güncellemeler görünmesi bu kadar sürebilir
- **İlk Gönderi**: Anında görünürlük için her kullanıcının `posts.json` dosyasında en az bir gönderisi olduğundan emin olun

### Görünürlük Yardımı

Yayınladıktan sonra hesabınız Mastodon veya diğer platformlarda görünmüyorsa:
- Tanılama ve sorun giderme için [shaanpub.shaanvision.com.tr](https://shaanpub.shaanvision.com.tr) adresini ziyaret edin

---

## Bilinen Sorunlar

- **Dinamik Sayfa Başlıkları**: Next.js 15 statik dışa aktarmalarında kullanıcı profil sayfası başlıkları doğru güncellenemeyebilir (kritik olmayan UI hatası)

---

## Katkıda Bulunma

- Yeni özellikler veya hata düzeltmeleri için fork edin, klonlayın ve pull request açın
- Kod tabanı Next.js 15, TypeScript, Tailwind CSS ve PostCSS kullanır
- Beklenmeyen ActivityPub uyumluluk sorunları bulursanız lütfen sorun bildirin

---

## Lisans
GPL3 Lisansı – Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.
---

## Bağlantılar ve Krediler

- Web Sitesi: [https://shvn.tr](https://shvn.tr)
- GitHub: [https://github.com/shaanvision](https://github.com/shaanvision)
- GitLab: [https://gitlab.com/shaanvision](https://gitlab.com/shaanvision)
- Profil İkonu: ![Logo](https://www.shaanvision.com.tr/logo.png)

---

## Bağımlılıklar

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- react-icons
- lucide-react

---
