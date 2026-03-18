# 🪪 Yazılımcı Kimlik Kartı

React Native ile geliştirilmiş, oyunlaştırma öğeleri içeren bir **Yazılımcı Profil Kartı** uygulaması.

Geliştiricilerin profil bilgilerini (ad, uzmanlık, seviye) görüntüleyin, "İşe Al" butonuyla durumlarını değiştirin ve XP kazanarak seviyeleri açın!

## 🎮 Oyunlaştırma Özellikleri

- **XP & Seviye Sistemi**: Her aksiyon XP kazandırır. 11 farklı seviye (Stajyer HR → İK Tanrısı)
- **12 Başarım / Rozet**: İlk Teklif, Takım Kurucu, CEO, Altın HR ve daha fazlası
- **Seviye Yol Haritası**: İlerlemenizi görsel olarak takip edin
- **Animasyonlu Kartlar**: Giriş animasyonları, buton efektleri, popup bildirimleri
- **Dinamik Durum Yönetimi**: Props (ad, uzmanlık, seviye) ve State (müsaitMi) kullanımı

## 📱 Ekran Görüntüleri

| Ana Ekran | Başarımlar |
|-----------|-----------|
| Geliştirici kartları, XP barı | Rozetler, istatistikler, yol haritası |

## 🚀 Nasıl Çalıştırılır?

### Gereksinimler
- Node.js (v18+)
- npm veya yarn
- Expo CLI
- Expo Go uygulaması (telefonda test için)

### Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/aleynaerrsln/YazilimciKimlikKarti.git

# Proje dizinine gidin
cd YazilimciKimlikKarti

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npx expo start
```

### Çalıştırma Seçenekleri

- **Android**: `npm run android` veya Expo Go ile QR kod tarayın
- **iOS**: `npm run ios` (macOS gerekli) veya Expo Go ile QR kod tarayın
- **Web**: `npm run web`

## 📦 APK İndirme

> APK dosyası: [Releases](https://github.com/aleynaerrsln/YazilimciKimlikKarti/releases) sayfasından indirilebilir.

## 🎥 Tanıtım Videosu

> YouTube linki: _Eklenecek_

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
> "Bu React Native kodunu production-ready hale getir: gradient kartlar, giriş animasyonları, XP/seviye sistemi, başarım popup'ları ekle. Context API ile global state yönet. Her aksiyon XP kazandırsın ve başarım rozetleri açılsın."

**Öğrenilen detay:** React Native'de `Animated.sequence` ve `Animated.parallel` ile karmaşık animasyon zincirleri oluşturulabiliyor. `Easing.out(Easing.back(1.2))` ile kartlara "bounce" efekti vererek çok daha profesyonel bir giriş animasyonu elde ettik.

## 👩‍💻 Geliştirici

**Aleyna Arslan** - AIgile Mobile Development Dersi

---

_Bu proje AIgile Mobile Development dersi kapsamında geliştirilmiştir._
