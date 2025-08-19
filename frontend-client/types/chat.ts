export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  status: "sending" | "delivered" | "error"
}

export interface VoiceRecording {
  id: string
  blob: Blob
  duration: number
  transcription?: string
}
