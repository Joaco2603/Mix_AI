"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Check, Mic, X } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { useTranscription } from "@/hooks/use-transcription";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface ChatComposerProps {
  onSendMessage: (message: string) => void;
}

/**
 * ChatInput
 *
 * Componente que maneja la entrada de texto y la grabación por voz.
 * - Soporta entrada por teclado y reconocimiento de voz (Web Speech API)
 * - Expone `onSendMessage` con el texto final enviado por el usuario
 *
 * Props:
 * - onSendMessage: (message: string) => void
 */
export default function ChatInput({ onSendMessage }: ChatComposerProps) {
  const [input, setInput] = useState("");
  const {
    isRecording,
    transcript,
    transcriptionSupported,
    startRecording,
    stopRecording,
    setTranscript,
  } = useTranscription();
  const { micSupported, micPermission, volume } = useAudio(isRecording);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (message) {
      onSendMessage(message);
      setInput("");
    }
  };

  const handleMicClick = () => {
    if (micSupported && micPermission === "granted" && transcriptionSupported) {
      startRecording();
    }
  };

  const handleCancelRecording = () => {
    stopRecording();
    setTranscript("");
  };

  const handleConfirmRecording = () => {
    stopRecording();
    setInput(transcript);
    setTranscript("");
  };

  const WaveAnimation = () => {
    const bars = Array.from({ length: 50 }, (_, i) => {
      const height = Math.max(4, volume * 60 + Math.random() * 10);
      return (
        <div
          key={i}
          className="bg-gray-400 rounded-sm"
          style={{
            width: "2px",
            height: `${height}px`,
            transition: "height 0.1s linear",
          }}
        />
      );
    });

    return (
      <div className="flex items-center w-full gap-1">
        <div className="flex-1 border-t-2 border-dotted border-gray-500"></div>
        <div className="flex items-center gap-0.5 justify-center px-8">
          {bars}
        </div>
        <div className="flex-1 border-t-2 border-dotted border-gray-500"></div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className="border border-zinc-700 rounded-2xl p-4 relative transition-all duration-500 ease-in-out overflow-hidden"
          style={{ backgroundColor: "#141415" }}
        >
          {isRecording ? (
            <div className="flex items-center justify-between h-12 animate-in fade-in-0 slide-in-from-top-2 duration-500 w-full">
              <WaveAnimation />
              <div className="flex items-center gap-2 ml-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelRecording}
                  className="h-8 w-8 p-0 text-white hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmRecording}
                  className="h-8 w-8 p-0 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: "#2DD4BF", color: "#032827" }}
                >
                  <Check className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu idea musical..."
                className="w-full bg-transparent text-gray-300 placeholder-gray-500 resize-none border-none outline-none text-base leading-relaxed min-h-[24px] max-h-32 transition-all duration-200"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />

              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleMicClick}
                    disabled={
                      !micSupported ||
                      micPermission !== "granted" ||
                      !transcriptionSupported
                    }
                    className="h-8 w-8 p-0 text-white hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 active:bg-red-600/20 active:text-red-400"
                  >
                    <Mic className="h-5 w-5 transition-transform duration-200" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim()}
                  className="h-8 w-8 p-0 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
