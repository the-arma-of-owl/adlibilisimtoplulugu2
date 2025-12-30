# Adli Bilişim Topluluğu Web Sitesi

Adli Bilişim Topluluğu için geliştirilmiş, etkinlik odaklı web sitesi. Etkinlik timeline'ı, QR kod tabanlı giriş sistemi ve admin paneli içerir.

## Özellikler

- 🎯 **Etkinlik Timeline**: Yatay timeline ile etkinliklerin görüntülenmesi
- 🔐 **QR Kod Giriş Sistemi**: Güvenli QR kod tabanlı etkinlik girişi
- 👨‍💼 **Admin Paneli**: Etkinlik ve katılımcı yönetimi
- ⏱️ **Canlı Sayaç**: Etkinliklere kalan süre gösterimi
- 📱 **Responsive Tasarım**: Mobil uyumlu modern arayüz
- 💾 **Kalıcı Veritabanı**: Supabase PostgreSQL ile veri kalıcılığı

## Teknolojiler

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **QR Kod**: qrcode.react, html5-qrcode
- **Animasyonlar**: Framer Motion

## Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/the-arma-of-owl/adlibilisimtoplulugu2
cd abt
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Supabase Kurulumu

1. [Supabase](https://supabase.com) üzerinde yeni bir proje oluşturun
2. SQL Editor'de `supabase/migrations/001_initial_schema.sql` dosyasını çalıştırın
3. Supabase projenizin URL ve anon key'ini alın

### 4. Environment Variables

`.env.local` dosyası oluşturun (`.env.local.example` dosyasını referans alarak):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY gerekmez - admin işlemleri Auth ile yapılıyor
```

### 5. Görselleri Ekleyin

`public/` klasörüne şu dosyaları ekleyin:
- `logo.png` - Topluluk logosu
- `qr-instruction.gif` - QR kod kullanım talimatı GIF'i (opsiyonel)

### 6. İlk Admin Kullanıcısını Oluşturun

Supabase Dashboard > Authentication > Users bölümünden ilk admin kullanıcısını oluşturun.

### 7. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

### Admin Paneline Erişim

1. `/admin/login` adresine gidin
2. Oluşturduğunuz admin kullanıcı bilgileriyle giriş yapın

### Etkinlik Ekleme

1. Admin panelinde "Etkinlikler" bölümüne gidin
2. "Yeni Etkinlik Ekle" butonuna tıklayın
3. Etkinlik bilgilerini doldurun ve "Aktif Etkinlik" seçeneğini işaretleyin

### Katılımcı Ekleme

1. Admin panelinde "Etkinlikler" bölümüne gidin
2. İlgili etkinliğin yanındaki "Katılımcılar" linkine tıklayın
3. "Yeni Katılımcı Ekle" butonuna tıklayın
4. Katılımcı bilgilerini ve giriş kodunu girin (örn: FDG-SGS-DRH-GSE)

### QR Kod Okuma

1. Admin panelinde "QR Okuyucu" bölümüne gidin
2. "QR Kod Okumayı Başlat" butonuna tıklayın
3. Kamera erişimine izin verin
4. Katılımcının QR kodunu okutun

### Katılımcı Girişi

1. Ana sayfadan "Etkinlik Giriş" butonuna tıklayın
2. Giriş kodunu girin (örn: FDG-SGS-DRH-GSE)
3. Etkinlik sayfasında QR kodunuzu görüntüleyin
4. Etkinlik günü kapıda QR kodunuzu okutun

## Veritabanı Yapısı

### Events (Etkinlikler)
- Etkinlik bilgileri, tarih, konum
- Aktif etkinlik belirleme

### Participants (Katılımcılar)
- Katılımcı bilgileri (isim, telefon)
- Giriş kodu ve QR token
- Giriş durumu ve zamanı

### Settings (Ayarlar)
- WhatsApp iletişim bilgisi
- Hakkımızda metni
- Diğer site ayarları

## Önemli Notlar

- **Veri Kalıcılığı**: Tüm veriler Supabase PostgreSQL veritabanında kalıcı olarak saklanır. Hiçbir veri otomatik olarak silinmez.
- **Güvenlik**: Row Level Security (RLS) politikaları ile veri güvenliği sağlanmıştır.
- **QR Kod Güvenliği**: Her katılımcı için benzersiz QR token oluşturulur.

## Lisans

Bu proje özel kullanım içindir.
