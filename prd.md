# Product Requirements Document (PRD)
## Project: AutoApply - Context-Aware Form Autofill Extension

### 1. Overview
AutoApply adalah *browser extension* yang dirancang untuk mengotomatisasi pengisian form lamaran kerja, magang, atau kepanitiaan. Ekstensi ini berfokus pada fleksibilitas tinggi untuk form independen (seperti Google Forms, Microsoft Forms, dan form lokal lainnya) dengan menggunakan logika pencocokan *Regex* ringan dan *DOM Parsing*. Data pengguna disimpan secara lokal (100% *Local Storage*) untuk menjamin privasi maksimal tanpa perlu otentikasi server.

### 2. Tech Stack Recommendations
Sebagai *Lead Developer*, tumpukan teknologi berikut dipilih untuk memastikan pengembangan yang cepat, performa ekstensi yang ringan, serta kompatibilitas lintas-browser (Chrome, Edge, Brave, Firefox):
*   **Framework Extension:** **React Plasmo**. Menyediakan *boilerplate* modern dengan *Hot Module Replacement* (HMR), sangat mempermudah pembuatan UI Popup dan *Options page*.
*   **UI & Komponen:** **React.js** (untuk interaktivitas) dan **Tailwind CSS** (untuk *styling* yang cepat dan konsisten di dalam *Shadow DOM* ekstensi).
*   **Bahasa Pemrograman:** **TypeScript**. Wajib untuk *type safety*, terutama saat menangani struktur objek data profil pengguna dan *DOM manipulation*.
*   **Manajemen State/Storage:** **@plasmohq/storage**. Pembungkus (*wrapper*) modern untuk `chrome.storage.local` yang mendukung *React Hooks* (`useStorage`).

### 3. Core Features & User Flow

#### A. Data Management Dashboard (Options Page)
Halaman pengaturan yang merangkap sebagai *dashboard* profil pengguna. Berbentuk *Single Page Application* (SPA).
*   **Kategori Form:**
    *   **Data Pribadi:** Nama Lengkap, Panggilan, Email, No. Telepon/WhatsApp, Tempat/Tanggal Lahir, Alamat Domisili.
    *   **Data Akademik:** Universitas, NIM (Nomor Induk Mahasiswa), Fakultas, Program Studi, Semester, IPK, Tahun Masuk, Tahun Lulus.
    *   **Data Profesional/Keahlian:** Deskripsi Diri (*Summary*), URL LinkedIn, URL GitHub, URL Portofolio, Daftar Keahlian (*Skills*), Pengalaman Kerja/Organisasi (Teks singkat).
*   **Fitur Tambahan:**
    *   Tombol *Export Data* (Unduh profil ke `.json`).
    *   Tombol *Import Data* (Unggah `.json` untuk memulihkan profil).

#### B. Trigger Mechanism (Popup UI)
Antarmuka kecil saat pengguna mengklik *icon* ekstensi di *toolbar*.
*   **State Deteksi:** Menampilkan status apakah halaman aktif terdeteksi sebagai "Form" (opsional, berdasarkan keberadaan elemen `<form>` atau `<input>`).
*   **Tombol Aksi Utama:** Tombol besar "Autofill Form Ini".
*   **Perilaku Eksekusi:** Saat diklik, *Popup* mengirim pesan (via `chrome.tabs.sendMessage`) ke *Content Script* untuk mulai mengeksekusi logika pencocokan dan pengisian.

#### C. Matching Engine (Content Script)
Logika inti yang berjalan di dalam konteks halaman web (*DOM*).
*   **DOM Traversal:** Mencari semua elemen `<input type="text"|"email"|"tel">`, `<textarea>`, dan `<select>`.
*   **Context Extraction:** Mengambil teks dari tag `<label>` yang membungkus *input*, atribut `placeholder`, atribut `name`, atau elemen teks terdekat (untuk kasus Google Form di mana struktur DOM-nya menggunakan `div` kustom sebagai label).
*   **Regex Dictionary Mapping:** Mencocokkan *Context Extraction* dengan *keys* di *Local Storage*. (Lihat Bab 4).
*   **Value Injection:** Menyuntikkan nilai profil pengguna ke kolom input dan memicu *event* `input` dan `change` bawaan DOM agar framework web (seperti React di sisi web) mendeteksi perubahan nilai.

### 4. Data Schema & Regex Mapping (Draft)

Struktur JSON yang disimpan di `chrome.storage.local` beserta *dictionary mapping*-nya:

```typescript
const profileData = {
  // Pribadi
  fullName: "Budi Santoso",
  email: "budi@example.com",
  phone: "08123456789",
  
  // Akademik
  university: "Universitas Telkom",
  studentId: "13012xxxx", // NIM
  faculty: "Fakultas Informatika",
  major: "S1 Informatika",
  semester: "6",
  gpa: "3.85",

  // Profesional
  github: "https://github.com/budisantoso",
  portfolio: "https://budisantoso.dev",
  summary: "Saya adalah seorang developer dengan ketertarikan di..."
};

// Regex Mapping Dictionary
const dictionaryMap = [
  { field: "fullName", regex: /nama\s?(lengkap)?|full\s?name/i },
  { field: "email", regex: /email|surel|e-mail/i },
  { field: "phone", regex: /telepon|telp|hp|handphone|whatsapp|wa|phone\s?number/i },
  { field: "studentId", regex: /nim|npm|nomor\s?induk\s?mahasiswa|student\s?id/i },
  { field: "university", regex: /universitas|perguruan\s?tinggi|kampus|asal\s?sekolah|university/i },
  { field: "faculty", regex: /fakultas|faculty/i },
  { field: "major", regex: /program\s?studi|prodi|jurusan|major/i },
  { field: "github", regex: /github|git/i },
  { field: "portfolio", regex: /portofolio|portfolio|website\s?pribadi/i }
];
```

### 5. Keamanan & Privasi
*   **Tanpa API Eksternal:** Tidak ada *fetch* atau *axios call* ke server luar.
*   **No Analytics (Tahap Awal):** Tidak ada pelacakan pengguna (*Google Analytics/Mixpanel*) untuk menjamin *trust* 100%.
*   **Storage Scope:** Menggunakan akses `storage` saja pada manifest, tanpa `identity` atau `background` yang selalu aktif.

### 6. Timeline & Fase Implementasi
*   **Fase 1: Setup & UI (Hari 1-2):**
    *   Inisialisasi *project* dengan Plasmo.
    *   Membuat *Options Page* (Dashboard Input Data) dengan Tailwind.
    *   Membuat *Popup UI* sederhana.
*   **Fase 2: Core Logic (Hari 3-4):**
    *   Pengembangan *Content Script* untuk mengekstrak DOM.
    *   Pembuatan modul `AutoFillEngine.ts` yang berisi Regex dan iterasi DOM.
    *   Pengujian injeksi nilai pada HTML statis biasa.
*   **Fase 3: Optimasi Google Form (Hari 5-6):**
    *   Pembuatan *parser* spesifik untuk menangani DOM spesifik milik Google Form (seperti *class* `whsOnd`, `zHQkBf`).
    *   Pengujian ekstensif pada Google Forms.
*   **Fase 4: Polish & Release (Hari 7):**
    *   Pembuatan *icon* dan *assets*.
    *   Uji coba kompilasi produksi (`plasmo build --zip`).
    *   Persiapan dokumentasi pengguna.
