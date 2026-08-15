import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY || "";


export interface FeedbackPayload {
  category: "feature_request" | "bug_report" | "form_support" | "general"
  message: string
  contact_info?: string
  rating?: number
  app_version?: string
}

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    return null
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

export async function submitFeedback(payload: FeedbackPayload): Promise<{ success: boolean; message?: string }> {
  const client = getSupabaseClient()

  if (!client) {
    return {
      success: false,
      message: "Konfigurasi Supabase belum disetel pada file .env (PLASMO_PUBLIC_SUPABASE_URL & PLASMO_PUBLIC_SUPABASE_ANON_KEY)."
    }
  }

  try {
    const { error } = await client.from("feedbacks").insert([
      {
        category: payload.category,
        message: payload.message.trim(),
        contact_info: payload.contact_info?.trim() || null,
        rating: payload.rating || null,
        app_version: payload.app_version || "1.0.0"
      }
    ])

    if (error) {
      return {
        success: false,
        message: error.message || "Gagal mengirim feedback ke server."
      }
    }

    return {
      success: true
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan."
    return {
      success: false,
      message: errorMsg
    }
  }
}
