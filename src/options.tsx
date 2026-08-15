import React, { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import {
  User,
  GraduationCap,
  Briefcase,
  Save,
  CheckCircle2,
  RefreshCw,
  FileJson,
  ShieldCheck,
  MessageSquarePlus,
  Send,
  Star,
  Sparkles,
  Bug,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  X
} from "lucide-react"

import { DEFAULT_PROFILE, PROFILE_STORAGE_KEY } from "./constants/dictionary"
import type { ProfileData } from "./types/profile"
import { submitFeedback, type FeedbackPayload } from "./lib/supabase"
import "./style.css"


export default function OptionsIndex() {
  const [profile, setProfile] = useStorage<ProfileData>(
    PROFILE_STORAGE_KEY,
    DEFAULT_PROFILE
  )

  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "professional" | "feedback">("personal")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

  // Feedback State
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackPayload["category"]>("feature_request")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackContact, setFeedbackContact] = useState("")
  const [feedbackRating, setFeedbackRating] = useState<number>(5)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackAlert, setFeedbackAlert] = useState<{ type: "success" | "error"; message: string; key: number } | null>(null)

  // Auto-dismiss feedback alert after 5 seconds
  useEffect(() => {
    if (feedbackAlert) {
      const timer = setTimeout(() => {
        setFeedbackAlert(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [feedbackAlert])

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

  const handleConfirmReset = () => {
    setProfile(DEFAULT_PROFILE)
    setShowResetModal(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackMessage.trim()) {
      setFeedbackAlert({
        type: "error",
        message: "Silakan isi pesan saran atau masukan Anda.",
        key: Date.now()
      })
      return
    }

    setFeedbackSubmitting(true)
    setFeedbackAlert(null)

    const result = await submitFeedback({
      category: feedbackCategory,
      message: feedbackMessage,
      contact_info: feedbackContact,
      rating: feedbackRating,
      app_version: "1.0.0"
    })

    setFeedbackSubmitting(false)

    if (result.success) {
      setFeedbackAlert({
        type: "success",
        message: "Terima kasih banyak! Masukan Anda berhasil dikirim ke database untuk pengembangan ToFill ke depan.",
        key: Date.now()
      })
      setFeedbackMessage("")
      setFeedbackContact("")
      setFeedbackRating(5)
    } else {
      setFeedbackAlert({
        type: "error",
        message: result.message || "Gagal mengirim masukan.",
        key: Date.now()
      })
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
            {activeTab === "feedback" ? "Kritik, Saran & Masukan" : "Pengaturan Profil Autofill"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {activeTab === "feedback"
              ? "Bantu kami menyempurnakan ToFill dengan memberikan ide fitur baru, laporan kendala, atau saran perbaikan."
              : "Data ini digunakan secara otomatis oleh ekstensi untuk mencocokkan bidang formulir di situs web."}
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

              <div className="pt-1 border-t border-zinc-100">
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all ${
                    activeTab === "feedback"
                      ? "bg-zinc-900 text-white font-semibold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <MessageSquarePlus className={`w-4 h-4 ${activeTab === "feedback" ? "text-zinc-200" : "text-amber-500"}`} />
                  Kirim Feedback
                </button>
              </div>
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
              type="button"
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-white border border-zinc-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition text-xs font-medium"
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

              {/* Form Feedback */}
              {activeTab === "feedback" && (
                <form onSubmit={handleSendFeedback} className="space-y-6">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-900">Kirim Kritik, Saran & Permintaan Fitur</h2>
                      <p className="text-xs text-zinc-500">Masukan Anda sangat berharga untuk terus mengembangkan dan menyempurnakan ToFill.</p>
                    </div>
                  </div>

                  {feedbackAlert && (
                    <div
                      key={feedbackAlert.key}
                      className={`relative overflow-hidden rounded-md border text-xs shadow-sm transition-all animate-in fade-in duration-150 ${
                        feedbackAlert.type === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                          : "bg-rose-50 border-rose-200 text-rose-950"
                      }`}
                    >
                      <div className="p-3.5 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          {feedbackAlert.type === "success" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-relaxed font-medium">{feedbackAlert.message}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFeedbackAlert(null)}
                          className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition shrink-0"
                          title="Tutup"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* 5-Second Countdown Progress Bar */}
                      <div className="w-full bg-zinc-200/40 h-1 overflow-hidden">
                        <div
                          className={`h-full animate-countdown-5s ${
                            feedbackAlert.type === "success" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Kategori Masukan */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-2">Jenis Masukan</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackCategory("feature_request")}
                        className={`flex items-center gap-2 p-2.5 rounded-md border text-xs text-left transition ${
                          feedbackCategory === "feature_request"
                            ? "border-zinc-900 bg-zinc-900 text-white font-medium shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Fitur Baru</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackCategory("form_support")}
                        className={`flex items-center gap-2 p-2.5 rounded-md border text-xs text-left transition ${
                          feedbackCategory === "form_support"
                            ? "border-zinc-900 bg-zinc-900 text-white font-medium shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Dukungan Form</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackCategory("bug_report")}
                        className={`flex items-center gap-2 p-2.5 rounded-md border text-xs text-left transition ${
                          feedbackCategory === "bug_report"
                            ? "border-zinc-900 bg-zinc-900 text-white font-medium shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <Bug className="w-3.5 h-3.5 shrink-0" />
                        <span>Lapor Bug</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackCategory("general")}
                        className={`flex items-center gap-2 p-2.5 rounded-md border text-xs text-left transition ${
                          feedbackCategory === "general"
                            ? "border-zinc-900 bg-zinc-900 text-white font-medium shadow-xs"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5 shrink-0" />
                        <span>Saran Umum</span>
                      </button>
                    </div>
                  </div>

                  {/* Rating Kepuasan */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">Rating Pengalaman Penggunaan</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 rounded hover:bg-zinc-100 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= feedbackRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-zinc-500 ml-2">
                        {feedbackRating === 5 && "Sangat Puas ⭐⭐⭐⭐⭐"}
                        {feedbackRating === 4 && "Puas ⭐⭐⭐⭐"}
                        {feedbackRating === 3 && "Cukup ⭐⭐⭐"}
                        {feedbackRating === 2 && "Kurang ⭐⭐"}
                        {feedbackRating === 1 && "Perlu Banyak Perbaikan ⭐"}
                      </span>
                    </div>
                  </div>

                  {/* Pesan Feedback */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Pesan Masukan / Deskripsi Permintaan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Tuliskan saran, kritik, atau link website formulir yang ingin didukung oleh ToFill..."
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>

                  {/* Kontak Pengguna (Opsional) */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Email atau Akun Kontak <span className="text-zinc-400 font-normal">(Opsional, jika bersedia dihubungi terkait saran ini)</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackContact}
                      onChange={(e) => setFeedbackContact(e.target.value)}
                      placeholder="contoh: emailanda@domain.com atau @username_telegram"
                      className="w-full px-3 py-2 rounded-md bg-white border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>

                  {/* Tombol Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={feedbackSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 transition active:scale-[0.98]"
                    >
                      {feedbackSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Mengirim ke Server...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </main>

      {/* Modal Konfirmasi Reset Profil */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-md w-full p-6 text-zinc-900 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-900">Reset Semua Data Profil?</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Tindakan ini akan mengosongkan seluruh data profil Anda (Data Pribadi, Akademik, dan Profesional) yang tersimpan di browser. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-2 rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-xs font-medium transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition shadow-xs active:scale-[0.98]"
              >
                Ya, Kosongkan Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
