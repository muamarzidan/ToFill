import React, { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import {
  User,
  GraduationCap,
  Briefcase,
  Download,
  Upload,
  Save,
  CheckCircle2,
  RefreshCw,
  FileJson,
  ShieldCheck
} from "lucide-react"

import { DEFAULT_PROFILE, PROFILE_STORAGE_KEY } from "./constants/dictionary"
import type { ProfileData } from "./types/profile"
import "./style.css"


export default function OptionsIndex() {
  const [profile, setProfile] = useStorage<ProfileData>(
    PROFILE_STORAGE_KEY,
    DEFAULT_PROFILE
  )

  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "professional">("personal")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    })
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleResetDefault = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan profil ke data default?")) {
      setProfile(DEFAULT_PROFILE)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `AutoApply_Profile_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8")
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string)
          if (typeof parsed === "object" && parsed !== null) {
            setProfile({
              ...DEFAULT_PROFILE,
              ...parsed
            })
            setImportStatus("Profil berhasil diimpor!")
            setTimeout(() => setImportStatus(null), 3500)
          }
        } catch (err) {
          alert("File JSON tidak valid atau bermasalah.")
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] font-sans antialiased">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="font-semibold text-sm tracking-tight text-zinc-900">ToFill</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              v1.0.0
            </span>
          </div>
          {/* Action Bar */}
          <div className="flex items-center gap-2">
            {/* <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-zinc-300 text-zinc-700 text-xs font-medium hover:bg-zinc-50 hover:text-zinc-900 transition"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              Export
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-zinc-300 text-zinc-700 text-xs font-medium hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-zinc-500" />
              Import
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label> */}

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Profil
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Alerts */}
        {saveSuccess && (
          <div className="mb-6 px-4 py-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profil berhasil disimpan secara lokal (`chrome.storage.local`).</span>
          </div>
        )}

        {importStatus && (
          <div className="mb-6 px-4 py-3 rounded-md bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-2.5 text-xs">
            <FileJson className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Section Title Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Pengaturan Profil Autofill
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Data ini digunakan secara otomatis oleh ekstensi untuk mencocokkan bidang formulir di situs web.
          </p>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="md:col-span-1 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-1 space-y-0.5">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all ${
                  activeTab === "personal"
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <User className="w-4 h-4 text-zinc-500" />
                Data Pribadi
              </button>

              <button
                onClick={() => setActiveTab("academic")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all ${
                  activeTab === "academic"
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-zinc-500" />
                Data Akademik
              </button>

              <button
                onClick={() => setActiveTab("professional")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all ${
                  activeTab === "professional"
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Briefcase className="w-4 h-4 text-zinc-500" />
                Data Profesional
              </button>
            </div>

            {/* Privacy Card */}
            <div className="bg-white border border-zinc-200 rounded-lg p-3.5 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privasi Lokal</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Tersimpan 100% di memori browser lokal. Tidak ada pengiriman data ke server mana pun.
              </p>
            </div>

            <button
              onClick={handleResetDefault}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-zinc-200 text-rose-600 hover:bg-rose-50 transition text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Profil
            </button>
          </aside>

          {/* Form Content Area */}
          <main className="md:col-span-3">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              {/* Data Pribadi */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-900">Identitas Pribadi</h2>
                      <p className="text-xs text-zinc-500">Informasi identitas mendasar untuk pengisian formulir.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={profile.fullName || ""}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="contoh: Budi Santoso"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={profile.nickname || ""}
                        onChange={(e) => handleInputChange("nickname", e.target.value)}
                        placeholder="contoh: Budi"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">NIK (Nomor Induk Kependudukan / KTP)</label>
                      <input
                        type="text"
                        value={profile.nik || ""}
                        onChange={(e) => handleInputChange("nik", e.target.value)}
                        placeholder="contoh: 3214123456789012"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Umur / Usia</label>
                      <input
                        type="text"
                        value={profile.age || ""}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="contoh: 21"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="contoh: budi@gmail.com"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">No. Telepon / WhatsApp</label>
                      <input
                        type="tel"
                        value={profile.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="contoh: 081234567890"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={profile.birthPlace || ""}
                        onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                        placeholder="contoh: Jakarta"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={profile.birthDate || ""}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Alamat Domisili</label>
                    <textarea
                      rows={3}
                      value={profile.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="contoh: Jl. Tofil No. 1, Bandung, Jawa Barat"
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>
                </div>
              )}
              {/* Data Akademik */}
              {activeTab === "academic" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-900">Pendidikan & Akademik</h2>
                      <p className="text-xs text-zinc-500">Riwayat studi perguruan tinggi.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Universitas / Kampus</label>
                      <input
                        type="text"
                        value={profile.university || ""}
                        onChange={(e) => handleInputChange("university", e.target.value)}
                        placeholder="contoh: Universitas Tofill"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">NIM / NPM</label>
                      <input
                        type="text"
                        value={profile.studentId || ""}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                        placeholder="contoh: 1301210001"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Fakultas</label>
                      <input
                        type="text"
                        value={profile.faculty || ""}
                        onChange={(e) => handleInputChange("faculty", e.target.value)}
                        placeholder="contoh: Fakultas Informatika"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Program Studi / Jurusan</label>
                      <input
                        type="text"
                        value={profile.major || ""}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                        placeholder="contoh: S1 Sistem Informasi"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Semester</label>
                      <input
                        type="text"
                        value={profile.semester || ""}
                        onChange={(e) => handleInputChange("semester", e.target.value)}
                        placeholder="contoh: 6"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">IPK</label>
                      <input
                        type="text"
                        value={profile.gpa || ""}
                        onChange={(e) => handleInputChange("gpa", e.target.value)}
                        placeholder="contoh: 3.85"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Tahun Masuk</label>
                      <input
                        type="text"
                        value={profile.startYear || ""}
                        onChange={(e) => handleInputChange("startYear", e.target.value)}
                        placeholder="contoh: 2021"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Tahun Lulus (Estimasi)</label>
                      <input
                        type="text"
                        value={profile.gradYear || ""}
                        onChange={(e) => handleInputChange("gradYear", e.target.value)}
                        placeholder="contoh: 2025"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Data Profesional */}
              {activeTab === "professional" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-900">Profil Profesional & Portofolio</h2>
                      <p className="text-xs text-zinc-500">Tautan jejaring profesional, sosial media, dan riwayat pengalaman.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">URL LinkedIn</label>
                      <input
                        type="url"
                        value={profile.linkedin || ""}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        placeholder="contoh: https://linkedin.com/in/username"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">URL GitHub</label>
                      <input
                        type="url"
                        value={profile.github || ""}
                        onChange={(e) => handleInputChange("github", e.target.value)}
                        placeholder="contoh: https://github.com/username"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">URL Portofolio / Website</label>
                      <input
                        type="url"
                        value={profile.portfolio || ""}
                        onChange={(e) => handleInputChange("portfolio", e.target.value)}
                        placeholder="contoh: https://myportfolio.dev"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Instagram</label>
                      <input
                        type="text"
                        value={profile.instagram || ""}
                        onChange={(e) => handleInputChange("instagram", e.target.value)}
                        placeholder="contoh: https://instagram.com/username atau @username"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">X / Twitter</label>
                      <input
                        type="text"
                        value={profile.twitter || ""}
                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                        placeholder="contoh: https://x.com/username atau @username"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">TikTok</label>
                      <input
                        type="text"
                        value={profile.tiktok || ""}
                        onChange={(e) => handleInputChange("tiktok", e.target.value)}
                        placeholder="contoh: https://tiktok.com/@username atau @username"
                        className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Daftar Keahlian (Skills)</label>
                    <input
                      type="text"
                      value={profile.skills || ""}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      placeholder="contoh: UIUX, Excel, Pyhton, Word"
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Deskripsi Diri (Summary)</label>
                    <textarea
                      rows={3}
                      value={profile.summary || ""}
                      onChange={(e) => handleInputChange("summary", e.target.value)}
                      placeholder="contoh: Saya adalah mahasiswa Software Engineering yang berdedikasi dengan fokus pada pengembangan web frontend dan UI/UX modern..."
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Pengalaman Kerja / Magang</label>
                    <textarea
                      rows={3}
                      value={profile.workExperience || ""}
                      onChange={(e) => handleInputChange("workExperience", e.target.value)}
                      placeholder="contoh: Frontend Developer Intern di PT ABC (Feb 2024 - Jul 2024) - Mengembangkan web dashboard internal menggunakan React dan Tailwind CSS..."
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Pengalaman Organisasi / Kepanitiaan</label>
                    <textarea
                      rows={3}
                      value={profile.orgExperience || ""}
                      onChange={(e) => handleInputChange("orgExperience", e.target.value)}
                      placeholder="contoh: Ketua Divisi R&D Himpunan Mahasiswa (2023), Koordinator Acara National Tech Seminar (2022)..."
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </main>
    </div>
  )
}
