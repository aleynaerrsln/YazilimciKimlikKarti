# 🪪 Yazılımcı Kimlik Kartı

## 🎯 Projenin Amacı

Bu uygulama, yazılım dünyasındaki geliştiricileri keşfetmenizi ve hayalinizdeki ekibi kurmanızı sağlayan interaktif bir **Yazılımcı Profil Kartı** platformudur. React Native ile geliştirilmiştir.

Kullanıcılar, farklı uzmanlık alanlarından geliştiricilerin profillerini inceleyebilir, yetenek seviyelerini görebilir, favorilerine ekleyebilir ve "İşe Al" butonuyla sanal bir ekip oluşturabilir. Uygulama, tüm bu etkileşimleri **oyunlaştırma** mekanikleriyle zenginleştirerek kullanıcıyı motive eder.

### Temel Özellikler
- **7 farklı geliştirici profili** (Mobile, Backend, Frontend, DevOps, AI/ML, Fullstack, UI/UX)
- **İşe Al / Serbest Bırak** toggle mekanizması (`musaitMi` state yönetimi)
- **Kart detayları**: Bio, deneyim, proje sayısı, maaş, yetenek barları
- **Yıldız puanlama sistemi** (rating)
- **Favori (kalp) butonu** ile beğenme
- **Seviyeye göre filtreleme** (Junior, Mid-Level, Senior, Lead)
- **Toplam maaş bütçesi hesaplayıcı** (canlı güncelleme)
- **Hepsini İşe Al & Sıfırla** toplu aksiyon butonları
- **Takım ilerleme barı** ve tam kadro konfeti animasyonu

## 🎮 Oyunlaştırma Özellikleri

- **XP & Seviye Sistemi**: Her işe alım +20 XP, her serbest bırakma +5 XP. 11 farklı seviye (Stajyer HR → İK Tanrısı)
- **12 Başarım / Rozet**: İlk Teklif, Takım Kurucu, CEO, Altın HR, Tam Kadro ve daha fazlası
- **Başarım Popup Bildirimleri**: Altın gradient animasyonlu bildirimler, parlama efekti
- **Seviye Yol Haritası**: İlerlemenizi görsel olarak takip edin
- **Animasyonlu Kartlar**: Bounce giriş animasyonları, genişleme efektleri, skill bar animasyonları
- **Konfeti Patlaması**: Tüm ekip kurulduğunda 20 parçacıklı dönen konfeti

## 📱 Ekran Görüntüleri

| Ana Ekran | Kart Detayı | Başarımlar |
|-----------|-------------|-----------|
| Geliştirici kartları, XP barı, maaş paneli | Skill bar'lar, bio, istatistikler | Rozetler, seviye yol haritası |

## 🚀 Nasıl Çalıştırılır?

### Gereksinimler
- Node.js (v18+)
- npm veya yarn
- Expo CLI
- Expo Go uygulaması (telefonda test için)

### Kurulum

```bash
# 1. Repoyu klonlayın
git clone https://github.com/aleynaerrsln/YazilimciKimlikKarti.git

# 2. Proje dizinine gidin
cd YazilimciKimlikKarti

# 3. Bağımlılıkları yükleyin
npm install

# 4. Uygulamayı başlatın
npx expo start
```

### Çalıştırma Seçenekleri

- **Android**: `npm run android` veya Expo Go ile QR kod tarayın
- **iOS**: `npm run ios` (macOS gerekli) veya Expo Go ile QR kod tarayın
- **Web**: `npm run web`

## 📦 APK İndirme

> APK dosyası: [Releases](https://github.com/aleynaerrsln/YazilimciKimlikKarti/releases) sayfasından indirilebilir.

## 🎥 Tanıtım Videosu

> YouTube linki: https://www.youtube.com/shorts/hw6z7qpq3Ak

## 🛠️ Kullanılan Teknolojiler

- **React Native** + **Expo** (SDK 54)
- **TypeScript**
- **Expo Router** (File-based routing)
- **expo-linear-gradient** (Gradient arka planlar)
- **React Native Animated API** (Animasyonlar)
- **Context API** (Global state yönetimi)

## 📂 Proje Yapısı

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx       # Ana ekran - Geliştirici kartları
│   │   ├── explore.tsx     # Başarımlar ve istatistikler
│   │   └── _layout.tsx     # Tab navigasyon
│   └── _layout.tsx         # Root layout + GameProvider
├── context/
│   └── GameContext.tsx      # Oyun state yönetimi (XP, seviye, başarımlar)
└── README.md
```

## 🤖 AI Prompt Özeti

**En iyi prompt:**
> "Bu React Native kodunu production-ready hale getir: gradient kartlar, giriş animasyonları, XP/seviye sistemi, başarım popup'ları ekle. Context API ile global state yönet. Her aksiyon XP kazandırsın ve başarım rozetleri açılsın. Skill bar animasyonları, yıldız rating, favori butonu ve toplam maaş hesaplayıcı ekle."

**Öğrenilen detay:** React Native'de `Animated.sequence` ve `Animated.parallel` ile karmaşık animasyon zincirleri oluşturulabiliyor. `Easing.out(Easing.back(1.2))` ile kartlara "bounce" efekti vererek çok daha profesyonel bir giriş animasyonu elde ettik. Ayrıca `Context API` ile birden fazla ekran arasında oyun state'ini (XP, başarımlar) paylaşmak çok kolay.

## 👩‍💻 Geliştirici

**Aleyna Erarslan** - AIgile Mobile Development Dersi

---

_Bu proje AIgile Mobile Development dersi kapsamında geliştirilmiştir._
