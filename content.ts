import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"

import { DEFAULT_PROFILE, DICTIONARY_MAP, PROFILE_STORAGE_KEY } from "./src/constants/dictionary"
import type { AutofillMessage, AutofillResponse, ProfileData } from "./src/types/profile"


export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const storage = new Storage()

/**
 * Extract human-readable context label for an input element
 */
function extractInputContext(el: HTMLElement): string {
  const contextParts: string[] = []

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.placeholder) {
      contextParts.push(el.placeholder)
    }
  }

  const nameAttr = el.getAttribute("name") || ""
  const idAttr = el.getAttribute("id") || ""
  const ariaLabel = el.getAttribute("aria-label") || ""
  const ariaLabelledBy = el.getAttribute("aria-labelledby") || ""

  if (ariaLabel) contextParts.push(ariaLabel)
  if (nameAttr) contextParts.push(nameAttr)
  if (idAttr) contextParts.push(idAttr)
  if (ariaLabelledBy) {
    const labelEl = document.getElementById(ariaLabelledBy)
    if (labelEl && labelEl.textContent) {
      contextParts.push(labelEl.textContent)
    }
  }

  if (idAttr) {
    const explicitLabel = document.querySelector(`label[for="${CSS.escape(idAttr)}"]`)
    if (explicitLabel && explicitLabel.textContent) {
      contextParts.push(explicitLabel.textContent)
    }
  }

  const parentLabel = el.closest("label")
  if (parentLabel && parentLabel.textContent) {
    contextParts.push(parentLabel.textContent)
  }

  const gFormContainer = el.closest("div[role='listitem'], .geS5eb, .Qr73ne, .freebirdFormviewerComponentsQuestionBaseRoot")
  if (gFormContainer) {
    const headingEl = gFormContainer.querySelector("div[role='heading'], .M7eMe, .zHQkBf, .HoLrzb")
    if (headingEl && headingEl.textContent) {
      contextParts.push(headingEl.textContent)
    }
  }

  let sibling = el.previousElementSibling
  let depth = 0
  while (sibling && depth < 3) {
    if (sibling.textContent && sibling.textContent.trim().length < 100) {
      contextParts.push(sibling.textContent)
      break
    }
    sibling = sibling.previousElementSibling
    depth++
  }

  return contextParts.join(" ")
}


/**
 * Dispatch events so frameworks (React, Angular, Vue) register value changes
 */
function setNativeInputValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  if (el.value === value) return

  const valueSetter = Object.getOwnPropertyDescriptor(el, "value")?.set
  const prototype = Object.getPrototypeOf(el)
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(el, value)
  } else if (valueSetter) {
    valueSetter.call(el, value)
  } else {
    el.value = value
  }

  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
  el.dispatchEvent(new Event("blur", { bubbles: true }))
}


/**
 * Main Autofill Logic
 */
async function performAutofill(): Promise<{ filledCount: number; totalFields: number }> {
  let profile = await storage.get<ProfileData>(PROFILE_STORAGE_KEY)
  if (!profile) {
    profile = DEFAULT_PROFILE
  }

  const inputElements = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='image']):not([type='checkbox']):not([type='radio']), textarea, select"
    )
  )

  let filledCount = 0

  for (const el of inputElements) {
    if (el.disabled || el.readOnly || el.offsetParent === null) continue

    const contextText = extractInputContext(el)
    if (!contextText.trim()) continue

    for (const matcher of DICTIONARY_MAP) {
      if (matcher.regex.test(contextText)) {
        const valToInject = profile[matcher.field]
        if (valToInject && typeof valToInject === "string" && valToInject.trim() !== "") {
          setNativeInputValue(el, valToInject.trim())
          filledCount++
          break
        }
      }
    }
  }

  return {
    filledCount,
    totalFields: inputElements.length
  }
}

/**
 * Message Listener for Popup & Background triggers
 */
chrome.runtime.onMessage.addListener(
  (message: AutofillMessage, _sender, sendResponse: (response: AutofillResponse) => void) => {
    if (message.action === "CHECK_FORM_STATUS") {
      const inputs = document.querySelectorAll("input, textarea, select")
      sendResponse({
        success: true,
        hasForm: inputs.length > 0,
        totalFields: inputs.length
      })
      return true
    }

    if (message.action === "AUTOFILL_EXECUTE") {
      performAutofill()
        .then(({ filledCount, totalFields }) => {
          sendResponse({
            success: true,
            filledCount,
            totalFields
          })
        })
        .catch((err) => {
          sendResponse({
            success: false,
            message: err?.message || "Terjadi kesalahan saat mengisi form."
          })
        })
      return true
    }
  }
)
