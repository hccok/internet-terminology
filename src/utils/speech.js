import { ref } from 'vue'

const isSpeaking = ref(false)

export function useSpeech() {
  const isSpeakable = (text) => /[a-zA-Z]/.test(text)

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.85

    utterance.onstart = () => { isSpeaking.value = true }
    utterance.onend = () => { isSpeaking.value = false }
    utterance.onerror = () => { isSpeaking.value = false }

    window.speechSynthesis.speak(utterance)
  }

  return { speak, isSpeakable, isSpeaking }
}
