"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VoiceRecorder } from "./voice-recorder"
import { cn } from "@/lib/utils"

interface ChatComposerProps {
  onSendMessage: (message: string) => void
}

export function ChatComposer({ onSendMessage }: ChatComposerProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceToggle = () => {
    setShowVoiceRecorder(!showVoiceRecorder)
    setIsRecording(!isRecording)
  }

  const handleVoiceTranscription = (transcription: string) => {
    setMessage(transcription)
    setShowVoiceRecorder(false)
    setIsRecording(false)
  }

  const handleVoiceCancel = () => {
    setShowVoiceRecorder(false)
    setIsRecording(false)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`
    }
  }, [message])

  return (
    <div className="border-t border-[#2a2a3e] bg-[#0D0D1A] p-4">
      {showVoiceRecorder && (
        <VoiceRecorder
          onTranscription={handleVoiceTranscription}
          onCancel={handleVoiceCancel}
          isRecording={isRecording}
        />
      )}

      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={cn(
              "min-h-[44px] max-h-36 resize-none rounded-xl",
              "bg-[#1a1a2e] border-[#2a2a3e] text-white placeholder:text-[#a1a1aa]",
              "focus:border-[#F36C21] focus:ring-1 focus:ring-[#F36C21]",
              "pr-20 font-inter", // Added more right padding for both buttons
            )}
            rows={1}
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              onClick={handleVoiceToggle}
              variant="ghost"
              size="sm"
              className={cn(
                "w-8 h-8 p-0 shrink-0 transition-all duration-200",
                isRecording ? "bg-[#CF2475] hover:bg-[#CF2475]/80 pulse-wave" : "hover:bg-[#2a2a3e] hover:scale-105",
              )}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 text-[#a1a1aa] hover:text-[#20D3C2]" />
              )}
            </Button>

            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="sm"
              className={cn(
                "w-8 h-8 p-0 shrink-0 transition-all duration-200",
                message.trim()
                  ? "bg-[#F36C21] hover:bg-[#F36C21]/80 hover:scale-105 shadow-lg shadow-[#F36C21]/25"
                  : "bg-[#2a2a3e] cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
