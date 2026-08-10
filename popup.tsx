import { useEffect, useState } from "react"
import { Settings, CheckCircle2, AlertCircle, FileText, ArrowRight } from "lucide-react"

import type { AutofillResponse } from "./src/types/profile"
import "./src/style.css"


export default function PopupIndex() {
  const [loading, setLoading] = useState(false)
  const [formDetected, setFormDetected] = useState<boolean | null>(null)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    // Check if current tab contains a form
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "CHECK_FORM_STATUS" },
          (response: AutofillResponse) => {
            if (chrome.runtime.lastError) {
              setFormDetected(false)
            } else if (response?.hasForm) {
              setFormDetected(true)
            } else {
              setFormDetected(false)
            }
          }
        )
      }
    })
  }, [])

  const handleAutofill = () => {
    setLoading(true)
    setResultMessage(null)
    setIsError(false)

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id
      if (!activeTabId) {
        setLoading(false)
        setIsError(true)
        setResultMessage("Tab aktif tidak terdeteksi.")
        return
      }

      chrome.tabs.sendMessage(
        activeTabId,
        { action: "AUTOFILL_EXECUTE" },
        (response: AutofillResponse) => {
          setLoading(false)
          if (chrome.runtime.lastError) {
            setIsError(true)
            setResultMessage("Ekstensi tidak dapat berkomunikasi dengan halaman ini. Coba refresh halaman.")
          } else if (response?.success) {
            setIsError(false)
            setResultMessage(
              response.filledCount && response.filledCount > 0
                ? `Berhasil mengisi ${response.filledCount} bidang formulir!`
                : "Form terdeteksi tetapi tidak ada bidang yang cocok."
            )
          } else {
            setIsError(true)
            setResultMessage(response?.message || "Gagal melakukan autofill.")
          }
        }
      )
    })
  }

  const openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL("options.html"))
    }
  }

  return (
    <div className="w-[320px] p-4 bg-white text-zinc-900 font-sans antialiased border border-zinc-200 shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-zinc-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">
            A
          </div>
          <span className="font-semibold text-xs text-zinc-900 tracking-tight">AutoApply</span>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            v1.0
          </span>
        </div>

        <button
          onClick={openOptionsPage}
          title="Pengaturan Dashboard"
          className="p-1 rounded-md border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Form Status */}
      <div className="mb-3">
        {formDetected === null && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 p-2.5 rounded-md border border-zinc-200">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span>Mendeteksi formulir pada halaman...</span>
          </div>
        )}
        {formDetected === true && (
          <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-md border border-emerald-200 font-medium">
            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Formulir terdeteksi</span>
          </div>
        )}
        {formDetected === false && (
          <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-md border border-zinc-200">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Tidak ada formulir yang terdeteksi</span>
          </div>
        )}
      </div>
      {/* Result Alert */}
      {resultMessage && (
        <div
          className={`mb-3 p-2.5 rounded-md border text-xs flex items-start gap-2 ${
            isError
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}
        >
          {isError ? (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <span>{resultMessage}</span>
        </div>
      )}
      {/* Action Button */}
      <button
        onClick={handleAutofill}
        disabled={loading}
        className="w-full py-2.5 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Proses Autofill...</span>
          </>
        ) : (
          <span>Autofill Form Ini</span>
        )}
      </button>
      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
        <span className="text-zinc-400 font-mono">100% Local</span>
        <button
          onClick={openOptionsPage}
          className="text-zinc-700 hover:text-zinc-900 font-medium inline-flex items-center gap-1"
        >
          Kelola Profil
          <ArrowRight className="w-3 h-3 text-zinc-400" />
        </button>
      </div>
    </div>
  )
}
