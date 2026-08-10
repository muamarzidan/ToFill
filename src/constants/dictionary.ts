import type { FieldMatcher, ProfileData } from "../types/profile"

export const PROFILE_STORAGE_KEY = "autoapply_user_profile"

export const DEFAULT_PROFILE: ProfileData = {
  fullName: "Budi Santoso",
  nickname: "Budi",
  email: "budi.santoso@example.com",
  phone: "081234567890",
  birthPlace: "Jakarta",
  birthDate: "2002-05-15",
  address: "Jl. Telekomunikasi No. 1, Bandung, Jawa Barat",
  university: "Universitas Telkom",
  studentId: "1301210001",
  faculty: "Fakultas Informatika",
  major: "S1 Informatika",
  semester: "6",
  gpa: "3.85",
  startYear: "2021",
  gradYear: "2025",
  summary: "Saya adalah mahasiswa Software Engineering yang berdedikasi dengan ketertarikan tinggi pada pengembangan aplikasi web dan e-commerce.",
  linkedin: "https://linkedin.com/in/budisantoso",
  github: "https://github.com/budisantoso",
  portfolio: "https://budisantoso.dev",
  skills: "TypeScript, React, Node.js, Tailwind CSS, Git, PostgreSQL",
  experience: "Frontend Developer Intern di Tech Company (2024), Ketua Divisi R&D Himpunan Mahasiswa Informatika (2023)."
}

export const DICTIONARY_MAP: FieldMatcher[] = [
  { field: "fullName", regex: /nama\s?(lengkap)?|full\s?name|your\s?name/i, label: "Nama Lengkap" },
  { field: "nickname", regex: /nama\s?panggilan|nickname|call\s?name/i, label: "Nama Panggilan" },
  { field: "email", regex: /email|surel|e-mail|mail/i, label: "Email" },
  { field: "phone", regex: /telepon|telp|hp|handphone|whatsapp|wa|phone\s?number|no\s?\.\s?hp/i, label: "No. HP / WA" },
  { field: "birthPlace", regex: /tempat\s?lahir|place\s?of\s?birth/i, label: "Tempat Lahir" },
  { field: "birthDate", regex: /tanggal\s?lahir|tgl\s?lahir|date\s?of\s?birth|dob/i, label: "Tanggal Lahir" },
  { field: "address", regex: /alamat|domisili|address|residence/i, label: "Alamat / Domisili" },
  { field: "studentId", regex: /nim|npm|nomor\s?induk|student\s?id|nrp/i, label: "NIM / NPM" },
  { field: "university", regex: /universitas|perguruan\s?tinggi|kampus|asal\s?sekolah|university|institution|instansi/i, label: "Universitas / Kampus" },
  { field: "faculty", regex: /fakultas|faculty/i, label: "Fakultas" },
  { field: "major", regex: /program\s?studi|prodi|jurusan|major|study\s?program/i, label: "Program Studi / Jurusan" },
  { field: "semester", regex: /semester|tingkat/i, label: "Semester" },
  { field: "gpa", regex: /ipk|gpa|indeks\s?prestasi/i, label: "IPK" },
  { field: "startYear", regex: /tahun\s?masuk|start\s?year|entry\s?year/i, label: "Tahun Masuk" },
  { field: "gradYear", regex: /tahun\s?lulus|graduation\s?year|grad\s?year/i, label: "Tahun Lulus" },
  { field: "github", regex: /github|git\s?repository/i, label: "GitHub URL" },
  { field: "linkedin", regex: /linkedin|linked\s?in/i, label: "LinkedIn URL" },
  { field: "portfolio", regex: /portofolio|portfolio|website\s?pribadi|personal\s?website/i, label: "Portofolio / Website" },
  { field: "summary", regex: /deskripsi\s?diri|tentang\s?saya|about\s?me|summary|bio|profil\s?singkat/i, label: "Deskripsi Diri" },
  { field: "skills", regex: /keahlian|skills|kemampuan|skill\s?set/i, label: "Keahlian" },
  { field: "experience", regex: /pengalaman|experience|riwayat\s?organisasi/i, label: "Pengalaman Kerja / Organisasi" }
]
