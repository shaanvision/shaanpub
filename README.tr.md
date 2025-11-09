# ShaanPub

**[Click for English README](README.md)**

ShaanPub'a hoş geldiniz! Bu proje, Next.js ile oluşturulmuş modern, hafif ve genişletilebilir bir ActivityPub sunucusudur. Fediverse üzerinde kendi merkezi olmayan sosyal medya kimliğinizi barındırmanıza olanak tanır.

[Shaan Vision](https://www.shaanvision.com.tr) tarafından geliştirilmiştir.

## Özellikler ve Sınırlamalar

Bu proje, Fediverse'de bir varlık oluşturmanın basit ve verimli bir yolunu sunar. Profilinizi ve gönderilerinizi görüntülemek için bir web arayüzü içerir. Ancak, bu statik yaklaşımın getirdiği avantaj ve dezavantajları anlamak önemlidir.

### Avantajlar

*   **Hafif ve Hızlı:** Statik bir site olduğu için son derece hızlıdır ve minimum sunucu kaynağı gerektirir.
*   **Kolay Dağıtım:** Derleme süreci, Node.js'yi destekleyen herhangi bir platformda barındırılabilen basit bir statik dosya dizini oluşturur.
*   **Güvenli:** Kullanıcı etkileşimleri için dinamik sunucu tarafı işleme olmadığından, saldırı yüzeyi önemli ölçüde azalır.

### Dezavantajlar

*   **Salt Okunur Kimlik:** Bu statik bir uygulamadır, bu da dinamik ActivityPub özelliklerini desteklemediği anlamına gelir. Fediverse'deki kimliğiniz "salt okunur" olacaktır.
*   **Dinamik Etkileşim Yok:** Diğer kullanıcıları takip etme, takip edilme, bildirim alma veya içeriği gerçek zamanlı olarak birleştirme gibi işlevler desteklenmez.
*   **Manuel Güncellemeler:** Yeni gönderiler veya profil değişiklikleri, tüm sitenin yeniden oluşturulmasını ve yeniden dağıtılmasını gerektirir.

## Nasıl Çalışır?

ShaanPub, statik bir Next.js sitesinin gücünü özel bir Express.js sunucusuyla birleştiren hibrit bir mimari kullanır. İşte sürecin bir dökümü:

1.  **Statik Site Oluşturma:** `output: 'export'` ile yapılandırılmış `next build` komutu, Next.js ön yüzünün tamamen statik bir sürümünü `out/` dizinine oluşturur.
2.  **ActivityPub Dosyası Oluşturma:** Derlemeden sonra, `scripts/generate-static-activitypub.ts` betiği çalışır. ActivityPub için gerekli statik JSON dosyalarını (`actor.json`, `.well-known/webfinger` vb.) oluşturur ve bunları `out/` dizinine yerleştirir.
3.  **Özel Express Sunucusu:** Standart bir statik dosya sunucusu yerine, ShaanPub özel bir sunucu (`server.mjs`) kullanır. Bu, ActivityPub ve WebFinger rotaları için doğru `Content-Type` başlıklarını (ör. `application/activity+json`) ayarlamak için çok önemlidir, ki bu standart bir Next.js statik dışa aktarımı ile mümkün değildir. Sunucu ayrıca Next.js sayfaları için temiz URL yönlendirmesini de yönetir.

## Proje Yapısı

-   `src/app/`: Next.js uygulamasının yaşadığı yer burasıdır. Tüm ön yüz sayfaları ve bileşenleri buradadır.
-   `public/`: Bu dizin, doğrudan sunulan resimler ve yazı tipleri gibi statik varlıkları içerir.
-   `scripts/`: Bu dizin yardımcı betikleri içerir.
    -   `generate-static-activitypub.ts`: Bu betik, Next.js derlemesi tamamlandıktan sonra statik ActivityPub dosyalarını oluşturmaktan sorumludur.
-   `out/`: Bu dizin, derleme işlemi tarafından oluşturulur ve özel sunucu tarafından sunulan son statik siteyi ve ActivityPub dosyalarını içerir. **Bu dizini doğrudan düzenlemeyin.**
-   `server.mjs`: `out/` dizininden statik dosyaları sunan ve ActivityPub için özel yönlendirmeyi yöneten özel Express.js sunucusu.

## Başlarken

### Önkoşullar

-   Node.js (v18 veya üstü)
-   npm

### Kurulum

1.  Depoyu klonlayın:
    ```bash
    git clone <repository-url>
    ```
2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

### Yerel Geliştirme

1.  Next.js geliştirme sunucusunu çalıştırmak için (ön yüz çalışması için):
    ```bash
    npm run dev
    ```
2.  Statik siteyi ve ActivityPub dosyalarını oluşturmak için:
    ```bash
    npm run build
    ```
3.  Özel sunucuyu çalıştırmak ve tam uygulamayı test etmek için:
    ```bash
    npm start
    ```

## Dağıtım

ShaanPub'ı dağıtmak için, bir Node.js uygulamasını çalıştırabilen bir barındırma sağlayıcısına ihtiyacınız vardır.

1.  Kodunuzu barındırma sağlayıcısına itin.
2.  Derleme komutunun `npm run build` olarak ayarlandığından emin olun.
3.  Başlatma komutunun `npm start` olarak ayarlandığından emin olun.
4.  Sağlayıcı derlemeyi çalıştıracak, statik dosyaları oluşturacak ve ardından uygulamanızı sunmak için özel sunucuyu başlatacaktır.
