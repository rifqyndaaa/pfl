# PRODUCT REQUIREMENT DOCUMENT (PRD) EVOLUTION
## SISTEM CRM & LANDING PAGE - BUIQ PLATFORM

Dokumen ini mendokumentasikan evolusi pembuatan Landing Page untuk platform BUIQ CRM mulai dari versi dasar (PRD v1), interaktif (PRD v2), hingga versi komplit yang terintegrasi penuh dengan Supabase database (PRD v3). Dokumen ini disusun untuk memenuhi tugas evaluasi minimal 3 tahap pengembangan lengkap dengan hasil dan bukti commit git.

---

## DAFTAR RIWAYAT COMMIT GIT (COMMIT HISTORY LOG)

Berikut adalah daftar commit yang digunakan sebagai bukti pengerjaan setiap tahapan evaluasi PRD:

| No. | Commit Hash | Pesan Commit | Kategori Evaluasi | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `cebe681` | p4 pt2 | PRD v1 (Dasar) | Struktur dasar landing page & layout awal |
| 2 | `b36661e` | Pertemuan 7 fix | PRD v1 (Dasar) | Penyempurnaan struktur menu & styling dasar |
| 3 | `b4034c0` | pertemuan10 | PRD v2 (Interaktif) | Pembuatan sandbox interaktif & carousel banner |
| 4 | `8ca372d` | Menambahkan 3 komponen Shadcn UI | PRD v2 (Interaktif) | Penambahan UI widget interaktif dan BUIQ Assistant |
| 5 | `768596a` | p13 tugas login superdatabase | PRD v3 (Komplit) | Koneksi Supabase Auth & login redirection |
| 6 | `d142f60` | perbaiki pertemuan 13 | PRD v3 (Komplit) | Perbaikan integrasi data CRM & data member |
| 7 | `969e653` | belum fix | PRD v3 (Komplit) | Sinkronisasi statis mockup dashboard & event log |

---

## EVALUASI PRD V1: PRD DASAR (BASIC LANDING PAGE)

### 1. Deskripsi Produk
PRD v1 berfokus pada pembuatan landing page dasar untuk memperkenalkan brand **BUIQ** kepada calon pengguna. Tujuan utama fase ini adalah menyajikan profil bisnis, visual yang bersih, dan navigasi menu statis agar audiens memahami proposisi nilai utama.

### 2. Kebutuhan Fitur (Features Requirement)
*   **Hero Section Dasar:** Header berisi judul utama ("BUIQ CRM Platform") dan deskripsi teks statis.
*   **Navigasi Header Statis:** Menu navigasi sederhana untuk berpindah antar section (`Home`, `Features`, `About`, `Contact`).
*   **Daftar Kategori Produk Statis:** Tampilan grid katalog pakaian pria, wanita, tas, dan aksesoris sebagai showcase bisnis ritel mode yang disasar.
*   **Footer Informasi:** Tautan media sosial (Instagram, TikTok, Facebook) dan informasi hak cipta.

### 3. Hasil & Antarmuka (UI/UX Results)
*   Desain minimalis berlatar belakang warna netral.
*   Menu navigasi sudah berfungsi memindahkan posisi scroll halaman (smooth scroll).
*   Gambar katalog statis dimuat dengan tata letak grid responsif.

### 4. Bukti Commit (Git Evidence)
*   **Commit Hash:** `cebe681b4decff...` (p4 pt2) & `b36661e...` (Pertemuan 7 fix)
*   **Status:** Selesai diimplementasikan.

---

## EVALUASI PRD V2: PRD INTERAKTIF (INTERMEDIATE LANDING PAGE)

### 1. Deskripsi Produk
PRD v2 bertujuan meningkatkan keterlibatan pengguna (*user engagement*) dengan memperkenalkan interaktivitas pada Landing Page. Pengguna dapat berinteraksi langsung dengan katalog produk dan mendapatkan bantuan cepat melalui widget chat pintar.

### 2. Kebutuhan Fitur (Features Requirement)
*   **Autoplay Carousel Banner:** Slide hero banner yang berputar otomatis setiap 8 detik untuk menampilkan pesan pemasaran berbeda (BUIQ Platform, Data-Driven Insights, Direct Customer).
*   **Live Storefront Sandbox & Filter Kategori:** Pengguna dapat memfilter produk yang tampil secara real-time berdasarkan kategori (Men's, Women's, Shoes, Accessories, Lifestyle).
*   **Keranjang Belanja Simulasi (Simulated Add to Bag):** Fitur penambahan barang ke tas belanja yang memicu Toast Notification dinamis (menampilkan simulasi pencatatan checkout oleh CRM BUIQ).
*   **BUIQ Assistant (AI Chatbot Widget):** Widget obrolan interaktif di pojok kanan bawah yang merespons pertanyaan cepat seputar *pricing*, *features*, *demo*, dan *integrations*.
*   **Slider Testimoni & Trust Stats:** Tampilan ulasan pelanggan secara dinamis beserta counter statistik reputasi platform (1,200+ Boutiques, 99.99% uptime).

### 3. Hasil & Antarmuka (UI/UX Results)
*   Banner bergerak dinamis dengan animasi halus menggunakan `framer-motion`.
*   Filter tab katalog berjalan instan tanpa perlu reload halaman.
*   Pesan notifikasi toast muncul di atas layar setiap kali tombol "Add to bag" ditekan.
*   Chatbot merespons secara otomatis dengan mengetikkan jawaban sesuai kata kunci.

### 4. Bukti Commit (Git Evidence)
*   **Commit Hash:** `b4034c0...` (pertemuan10) & `8ca372d...` (Menambahkan 3 komponen Shadcn UI)
*   **Status:** Selesai diimplementasikan.

---

## EVALUASI PRD V3: PRD KOMPLIT (INTEGRATED CRM LANDING PAGE)

### 1. Deskripsi Produk
PRD v3 merupakan versi komplit yang memadukan Landing Page dengan modul CRM utama. Di fase ini, landing page bertindak sebagai pintu gerbang (*gateway*) otentikasi pengguna dan pemantauan data transaksi CRM ritel yang terhubung ke basis data Supabase.

### 2. Kebutuhan Fitur (Features Requirement)
*   **Dynamic Auth State Header:**
    *   Jika pengguna **belum login**, header menampilkan tombol **Login**.
    *   Jika pengguna **sudah login**, header menampilkan tombol **Dashboard** dan tombol **Logout** secara dinamis menggunakan `useAuth` context.
*   **Mockup Dashboard Preview Dinamis:** Representasi visual dashboard di sebelah kanan Hero Section yang menyajikan stats live members, live revenue tracker, dan log aktivitas CRM terbaru (seperti VIP upgrade & order tracking).
*   **Supabase Database Integration:**
    *   Sistem sinkronisasi untuk mendeteksi member tier (Bronze, Silver, Gold, Platinum) berdasarkan perolehan loyalty reward points yang disimpan di Supabase.
    *   Pencatatan data transaksi dan integrasi trigger database (`update_customer_crm_stats`) secara otomatis di sisi backend.
*   **Lead Capture Contact Form:** Form kontak di bagian bawah yang memvalidasi penginputan nama, email, dan pesan penawaran kerja sama brand.

### 3. Hasil & Antarmuka (UI/UX Results)
*   Header secara adaptif mengenali user yang sedang aktif. Pengguna yang sudah terautentikasi dapat berpindah langsung ke panel administrasi CRM (`/dashboard`).
*   Mockup dashboard menampilkan counter data riil yang hidup ("Live Members: 1,842" & "New Order +Rp 349,000" dengan animasi ping berulang).
*   Form kontak memberikan feedback pengiriman sukses saat tombol submit ditekan.

### 4. Bukti Commit (Git Evidence)
*   **Commit Hash:** `768596a...` (p13 tugas login superdatabase), `d142f60...` (perbaiki pertemuan 13), & `969e653...` (belum fix)
*   **Status:** Selesai diimplementasikan dan diverifikasi berjalan baik.

---

## CARA MENGEKSPOR DOKUMEN INI MENJADI PDF

Untuk menyerahkan dokumen ini kepada dosen dalam format PDF, Anda dapat mengikuti langkah-langkah mudah berikut:

1.  **Menggunakan VS Code (Markdown PDF Extension):**
    *   Instal ekstensi **Markdown PDF** oleh *yzane* di VS Code.
    *   Buka file `PRD_LandingPage_CRM.md` di editor.
    *   Klik kanan di area teks markdown, lalu pilih **Markdown PDF: Export (pdf)**.
2.  **Menggunakan Google Docs / Microsoft Word:**
    *   Salin (*copy*) seluruh teks di dalam file ini.
    *   Tempel (*paste*) ke Google Docs atau Microsoft Word.
    *   Atur pemformatan judul dan tabel agar rapi.
    *   Pilih menu **File > Download / Save As > PDF Document (.pdf)**.
3.  **Menggunakan Notion:**
    *   Buat halaman baru di Notion, paste teks ini.
    *   Klik ikon titik tiga `...` di pojok kanan atas Notion.
    *   Pilih **Export** dan ubah formatnya menjadi **PDF**.
