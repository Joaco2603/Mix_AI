"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  onCancel: () => void
  isRecording: boolean
}

export function VoiceRecorder({ onTranscription, onCancel, isRecording }: VoiceRecorderProps) {
  const [transcription, setTranscription] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    if (isRecording) {
      startRecording()
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
        // Simulate audio level for demo
        setAudioLevel(Math.random() * 100)
      }, 100)
    } else {
      stopRecording()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording])

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscription(finalTranscript + interimTranscript)
      }

      recognitionRef.current.start()
    } else {
      // Fallback for demo purposes
      setTimeout(() => {
        setTranscription("This is a demo transcription since speech recognition is not available in this environment.")
      }, 2000)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleSend = () => {
    if (transcription.trim()) {
      onTranscription(transcription.trim())
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="mb-4 p-4 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", isRecording ? "bg-[#CF2475] pulse-wave" : "bg-[#a1a1aa]")} />
            <span className="text-sm text-[#a1a1aa] font-inter">
              {isRecording ? "Recording..." : "Recording stopped"}
            </span>
          </div>
          <span className="text-sm text-[#F36C21] font-mono">{formatTime(Math.floor(recordingTime / 10))}</span>
        </div>

        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-[#2a2a3e] text-[#a1a1aa] hover:text-[#CF2475]"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Audio Level Visualization */}
      <div className="flex items-center gap-1 mb-3 h-8">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 bg-gradient-to-t from-[#20D3C2] to-[#B52EDC] rounded-full transition-all duration-100",
              audioLevel > i * 5 ? "opacity-100" : "opacity-20",
            )}
            style={{
              height: `${Math.max(4, audioLevel > i * 5 ? Math.random() * 24 + 8 : 4)}px`,
            }}
          />
        ))}
      </div>

      {/* Transcription Preview */}
      {transcription && (
        <div className="mb-3 p-3 bg-[#0D0D1A] rounded-lg border border-[#2a2a3e]">
          <p className="text-sm text-white font-inter leading-relaxed">{transcription}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 justify-end">
        <Button
          onClick={handleSend}
          disabled={!transcription.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2 transition-all duration-200",
            transcription.trim()
              ? "bg-[#F36C21] hover:bg-[#F36C21]/80 hover:scale-105 shadow-lg shadow-[#F36C21]/25"
              : "bg-[#2a2a3e] cursor-not-allowed",
          )}
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-poppins font-medium">Send</span>
        </Button>
      </div>
    </div>
  )
}
