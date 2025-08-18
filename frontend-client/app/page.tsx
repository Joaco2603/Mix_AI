"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  FileText,
  MessageCircle,
  Moon,
  Sun,
  Upload,
  Menu,
  X,
  Send,
  Code,
  Copy,
  Download,
  Activity,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ActionLogEntry {
  id: string;
  action: string;
  timestamp: Date;
  status: "success" | "info" | "warning" | "error";
  details?: string;
}

type RightPanelMode = "chat" | "transcription" | "actionlog" | "mixer" | null;

export default function MixIADashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Ready");
  const [transcriptionText, setTranscriptionText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI assistant. How can I help you with your audio today?",
      timestamp: new Date(),
    },
  ]);

  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([
    {
      id: "1",
      action: "System Initialized",
      timestamp: new Date(),
      status: "success",
      details: "MixIA dashboard loaded successfully",
    },
  ]);

  const [chatInput, setChatInput] = useState("");
  const [chatMode, setChatMode] = useState<"text" | "json">("text");
  const [audioLevel, setAudioLevel] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const transcriptionScrollRef = useRef<HTMLDivElement>(null);
  const actionLogScrollRef = useRef<HTMLDivElement>(null);

  const [mixerSettings, setMixerSettings] = useState({
    masterVolume: 75,
    bassGain: 0,
    midGain: 0,
    trebleGain: 0,
    compressor: false,
    reverb: 25,
    echo: 0,
    noiseGate: false,
    limiter: true,
  });

  const addActionLog = useCallback(
    (action: string, status: ActionLogEntry["status"], details?: string) => {
      const newEntry: ActionLogEntry = {
        id: Date.now().toString(),
        action,
        timestamp: new Date(),
        status,
        details,
      };
      setActionLog((prev) => [...prev, newEntry]);
    },
    []
  );

  // Simulate audio level animation when recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-scroll transcription to bottom
  useEffect(() => {
    if (transcriptionScrollRef.current) {
      transcriptionScrollRef.current.scrollTop =
        transcriptionScrollRef.current.scrollHeight;
    }
  }, [transcriptionText]);

  // Auto-scroll action log to bottom
  useEffect(() => {
    if (actionLogScrollRef.current) {
      actionLogScrollRef.current.scrollTop =
        actionLogScrollRef.current.scrollHeight;
    }
  }, [actionLog]);

  // Simulate live transcription
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTranscribing) {
      const sampleTexts = [
        "Hello, this is a test transcription...",
        "The audio quality is excellent today.",
        "We're processing your audio in real-time.",
        "Machine learning algorithms are analyzing the speech patterns.",
        "Transcription accuracy is improving with each word.",
      ];
      let currentIndex = 0;

      interval = setInterval(() => {
        if (currentIndex < sampleTexts.length) {
          setTranscriptionText(
            (prev) => prev + (prev ? " " : "") + sampleTexts[currentIndex]
          );
          currentIndex++;
        } else {
          setIsTranscribing(false);
          addActionLog(
            "Transcription Completed",
            "success",
            "Live transcription finished"
          );
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTranscribing, addActionLog]);

  const handleRecord = () => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    setCurrentStatus(newRecordingState ? "Recording..." : "Ready");
    addActionLog(
      newRecordingState ? "Recording Started" : "Recording Stopped",
      "info",
      newRecordingState
        ? "Audio recording initiated"
        : "Audio recording completed"
    );
  };

  const handlePlay = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    setCurrentStatus(newPlayingState ? "Playing..." : "Ready");
    addActionLog(
      newPlayingState ? "Playback Started" : "Playback Stopped",
      "info",
      newPlayingState ? "Audio playback initiated" : "Audio playback completed"
    );
  };

  const handleTranscribe = () => {
    if (!isTranscribing) {
      setIsTranscribing(true);
      setTranscriptionText("");
      setCurrentStatus("Transcribing...");
      addActionLog(
        "Transcription Started",
        "info",
        "Live transcription initiated"
      );
      // Auto-open transcription panel
      setRightPanelMode("transcription");
    } else {
      setIsTranscribing(false);
      setCurrentStatus("Ready");
      addActionLog(
        "Transcription Stopped",
        "warning",
        "Live transcription manually stopped"
      );
    }
  };

  const handleCopyTranscription = () => {
    navigator.clipboard.writeText(transcriptionText);
    addActionLog(
      "Transcription Copied",
      "success",
      "Transcription copied to clipboard"
    );
  };

  const handleDownloadTranscription = () => {
    const blob = new Blob([transcriptionText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addActionLog(
      "Transcription Downloaded",
      "success",
      "Transcription saved as .txt file"
    );
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    addActionLog(
      "Message Sent",
      "info",
      `User message: "${chatInput.slice(0, 30)}${
        chatInput.length > 30 ? "..." : ""
      }"`
    );

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I understand your request. Let me help you process that audio data.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      addActionLog(
        "AI Response Received",
        "success",
        "AI assistant responded to user query"
      );
    }, 1000);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setCurrentStatus(`Uploaded: ${file.name}`);
      addActionLog(
        "File Uploaded",
        "success",
        `File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const toggleRightPanel = (mode: RightPanelMode) => {
    if (rightPanelMode === mode) {
      setRightPanelMode(null);
    } else {
      setRightPanelMode(mode);
    }
  };

  const ToolButton = ({
    icon: Icon,
    onClick,
    active = false,
    tooltip,
    className = "",
    badge,
  }: {
    icon: any;
    onClick: () => void;
    active?: boolean;
    tooltip: string;
    className?: string;
    badge?: string;
  }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`
        relative group h-12 w-12 rounded-xl transition-all duration-300 hover:scale-110
        ${
          active
            ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-400 shadow-lg shadow-teal-500/25"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }
        ${className}
      `}
    >
      <Icon className="h-5 w-5" />
      {badge && (
        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-orange-500 text-white">
          {badge}
        </Badge>
      )}
      <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {tooltip}
      </div>
    </Button>
  );

  const AudioVisualizer = () => {
    const bars = Array.from({ length: 32 }, (_, i) => {
      const height = isRecording
        ? Math.sin(Date.now() / 100 + i * 0.5) * 20 + 30 + audioLevel / 5
        : 10;
      return (
        <div
          key={i}
          className="bg-gradient-to-t from-teal-500 to-purple-500 rounded-full transition-all duration-100"
          style={{
            height: `${Math.max(4, height)}px`,
            width: "3px",
            transform: `rotate(${i * 11.25}deg) translateY(-40px)`,
            transformOrigin: "50% 40px",
          }}
        />
      );
    });

    return (
      <button className="relative w-32 h-32 mx-auto" onClick={handleRecord}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/10 to-purple-500/10 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gray-900/50 backdrop-blur-sm" />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20">{bars}</div>
        </div> */}

        {isRecording && (
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/50 animate-ping" />
        )}
        <Mic className="absolute inset-0 m-auto h-12 w-12 text-teal-500" />
      </button>
    );
  };

  const MiniWaveform = () => {
    const bars = Array.from({ length: 16 }, (_, i) => {
      const height = isRecording
        ? Math.sin(Date.now() / 150 + i * 0.8) * 8 + 12 + audioLevel / 10
        : 4;
      return (
        <div
          key={i}
          className="bg-gradient-to-t from-teal-500 to-purple-500 rounded-full transition-all duration-150"
          style={{
            height: `${Math.max(2, height)}px`,
            width: "2px",
          }}
        />
      );
    });

    return (
      <div className="flex items-end justify-center space-x-1 h-8">{bars}</div>
    );
  };

  const MixerSlider = ({
    label,
    value,
    onChange,
    min = -20,
    max = 20,
    step = 1,
    unit = "dB",
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-gray-500">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const MixerToggle = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{label}</label>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-teal-500"
      />
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-[#0D0D1A] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b transition-colors duration-300 ${
          isDarkMode
            ? "border-gray-800 bg-gray-900/50"
            : "border-gray-200 bg-white/50"
        } backdrop-blur-sm sticky top-0 z-40`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-poppins">
              MixIA
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-teal-500"
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px-80px)]">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8 h-full">
            {/* Audio Visualizer */}
            <div className="text-center">
              <AudioVisualizer />
              <div className="mt-4">
                <div
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Status:{" "}
                  <span className="text-teal-400 font-medium">
                    {currentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/25"
                  : isDarkMode
                  ? "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                  : "border-gray-300 hover:border-gray-400 bg-white/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload
                className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                  isDragOver ? "text-teal-400" : "text-gray-400"
                }`}
              />
              <p
                className={`text-lg font-medium transition-colors duration-300 ${
                  isDragOver
                    ? "text-teal-400"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                {isDragOver
                  ? "Drop your audio file here"
                  : "Drag & drop audio files or click to browse"}
              </p>
              <p
                className={`text-sm mt-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Supports MP3, WAV, M4A, FLAC, OGG, and more
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.aac,.wma"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <div
          className={`transition-all duration-300 ${
            rightPanelMode ? "w-96" : "w-0"
          } overflow-hidden border-l ${
            isDarkMode
              ? "border-gray-800 bg-gray-900/30"
              : "border-gray-200 bg-white/30"
          } backdrop-blur-sm`}
        >
          {rightPanelMode && (
            <div className="h-full flex flex-col">
              {/* Panel Header with Tabs */}
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold font-poppins">
                    {rightPanelMode === "chat" && "AI Assistant"}
                    {rightPanelMode === "transcription" && "Live Transcription"}
                    {rightPanelMode === "actionlog" && "Action Log"}
                    {rightPanelMode === "mixer" && "Audio Mixer"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRightPanelMode(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Panel-specific controls */}
                {rightPanelMode === "chat" && (
                  <div className="flex space-x-1 p-1 bg-gray-800 rounded-lg mt-2">
                    <Button
                      variant={chatMode === "text" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChatMode("text")}
                      className="flex-1 h-8 text-xs"
                    >
                      Text
                    </Button>
                    <Button
                      variant={chatMode === "json" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChatMode("json")}
                      className="flex-1 h-8 text-xs"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      JSON
                    </Button>
                  </div>
                )}

                {rightPanelMode === "transcription" && (
                  <div className="flex items-center justify-between mt-2">
                    <Badge
                      variant={isTranscribing ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {isTranscribing ? "Transcribing..." : "Ready"}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyTranscription}
                        className="h-8 w-8"
                        disabled={!transcriptionText}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownloadTranscription}
                        className="h-8 w-8"
                        disabled={!transcriptionText}
                        title="Download as .txt"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                {/* Chat Panel */}
                {rightPanelMode === "chat" && (
                  <div className="h-full flex flex-col">
                    <div
                      ref={chatScrollRef}
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg shadow-teal-500/25"
                                : isDarkMode
                                ? "bg-gray-800 text-gray-100 shadow-lg shadow-gray-800/25"
                                : "bg-white text-gray-900 shadow-lg"
                            }`}
                          >
                            <p className="text-sm font-inter">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`p-4 border-t ${
                        isDarkMode ? "border-gray-800" : "border-gray-200"
                      }`}
                    >
                      <div className="flex space-x-2">
                        {chatMode === "text" ? (
                          <Input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type your message..."
                            className={`flex-1 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-white border-gray-300"
                            }`}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
                          />
                        ) : (
                          <Textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder='{"prompt": "your request here"}'
                            className={`flex-1 font-mono text-xs resize-none ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700"
                                : "bg-white border-gray-300"
                            }`}
                            rows={3}
                          />
                        )}
                        <Button
                          onClick={handleSendMessage}
                          size="icon"
                          className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 shadow-lg shadow-teal-500/25"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transcription Panel */}
                {rightPanelMode === "transcription" && (
                  <div className="h-full flex flex-col">
                    <div
                      ref={transcriptionScrollRef}
                      className="flex-1 overflow-y-auto p-4"
                    >
                      {transcriptionText ? (
                        <div
                          className={`text-sm leading-relaxed ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {transcriptionText}
                          {isTranscribing && (
                            <span className="animate-pulse">|</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                          {isTranscribing
                            ? "Listening..."
                            : "Start transcription to see live text"}
                        </div>
                      )}
                    </div>
                    <div
                      className={`p-4 border-t ${
                        isDarkMode ? "border-gray-800" : "border-gray-200"
                      }`}
                    >
                      <div className="text-xs text-gray-500 text-center">
                        {transcriptionText.length} characters •{" "}
                        {transcriptionText.split(" ").length} words
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Log Panel */}
                {rightPanelMode === "actionlog" && (
                  <div className="h-full flex flex-col">
                    {/* Waveform during recording */}
                    {isRecording && (
                      <div
                        className={`p-4 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-2">
                            Recording Audio
                          </div>
                          <MiniWaveform />
                        </div>
                      </div>
                    )}

                    <div
                      ref={actionLogScrollRef}
                      className="flex-1 overflow-y-auto p-4 space-y-2"
                    >
                      {actionLog.map((entry) => (
                        <div
                          key={entry.id}
                          className={`p-3 rounded-lg border-l-4 ${
                            entry.status === "success"
                              ? "border-green-500 bg-green-500/10"
                              : entry.status === "error"
                              ? "border-red-500 bg-red-500/10"
                              : entry.status === "warning"
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-blue-500 bg-blue-500/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {entry.action}
                            </span>
                            <span className="text-xs text-gray-500">
                              {entry.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {entry.details && (
                            <p className="text-xs text-gray-600 mt-1">
                              {entry.details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mixer Panel */}
                {rightPanelMode === "mixer" && (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                      {/* Master Volume */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">
                          Master Controls
                        </h4>
                        <MixerSlider
                          label="Master Volume"
                          value={mixerSettings.masterVolume}
                          onChange={(value) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              masterVolume: value,
                            }));
                            addActionLog(
                              "Master Volume Changed",
                              "info",
                              `Set to ${value}%`
                            );
                          }}
                          min={0}
                          max={100}
                          unit="%"
                        />
                      </div>

                      {/* EQ Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">
                          3-Band EQ
                        </h4>
                        <MixerSlider
                          label="Bass"
                          value={mixerSettings.bassGain}
                          onChange={(value) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              bassGain: value,
                            }));
                            addActionLog(
                              "Bass EQ Adjusted",
                              "info",
                              `${value > 0 ? "+" : ""}${value}dB`
                            );
                          }}
                        />
                        <MixerSlider
                          label="Mid"
                          value={mixerSettings.midGain}
                          onChange={(value) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              midGain: value,
                            }));
                            addActionLog(
                              "Mid EQ Adjusted",
                              "info",
                              `${value > 0 ? "+" : ""}${value}dB`
                            );
                          }}
                        />
                        <MixerSlider
                          label="Treble"
                          value={mixerSettings.trebleGain}
                          onChange={(value) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              trebleGain: value,
                            }));
                            addActionLog(
                              "Treble EQ Adjusted",
                              "info",
                              `${value > 0 ? "+" : ""}${value}dB`
                            );
                          }}
                        />
                      </div>

                      {/* Effects Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">
                          Effects
                        </h4>
                        <MixerSlider
                          label="Reverb"
                          value={mixerSettings.reverb}
                          onChange={(value) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              reverb: value,
                            }));
                            addActionLog(
                              "Reverb Adjusted",
                              "info",
                              `${value}%`
                            );
                          }}
                          min={0}
                          max={100}
                          unit="%"
                        />
                        <MixerSlider
                          label="Echo"
                          value={mixerSettings.echo}
                          onChange={(value) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              echo: value,
                            }));
                            addActionLog("Echo Adjusted", "info", `${value}%`);
                          }}
                          min={0}
                          max={100}
                          unit="%"
                        />
                      </div>

                      {/* Processing Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">
                          Audio Processing
                        </h4>
                        <MixerToggle
                          label="Compressor"
                          checked={mixerSettings.compressor}
                          onChange={(checked) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              compressor: checked,
                            }));
                            addActionLog(
                              `Compressor ${checked ? "Enabled" : "Disabled"}`,
                              "info",
                              `Audio compression ${checked ? "on" : "off"}`
                            );
                          }}
                        />
                        <MixerToggle
                          label="Noise Gate"
                          checked={mixerSettings.noiseGate}
                          onChange={(checked) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              noiseGate: checked,
                            }));
                            addActionLog(
                              `Noise Gate ${checked ? "Enabled" : "Disabled"}`,
                              "info",
                              `Background noise filtering ${
                                checked ? "on" : "off"
                              }`
                            );
                          }}
                        />
                        <MixerToggle
                          label="Limiter"
                          checked={mixerSettings.limiter}
                          onChange={(checked) => {
                            setMixerSettings((prev) => ({
                              ...prev,
                              limiter: checked,
                            }));
                            addActionLog(
                              `Limiter ${checked ? "Enabled" : "Disabled"}`,
                              "info",
                              `Audio limiting ${checked ? "on" : "off"}`
                            );
                          }}
                        />
                      </div>

                      {/* Preset Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-teal-400 border-b border-gray-700 pb-2">
                          Presets
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const voicePreset = {
                                masterVolume: 80,
                                bassGain: -2,
                                midGain: 3,
                                trebleGain: 1,
                                compressor: true,
                                reverb: 15,
                                echo: 0,
                                noiseGate: true,
                                limiter: true,
                              };
                              setMixerSettings(voicePreset);
                              addActionLog(
                                "Voice Preset Applied",
                                "success",
                                "Optimized for voice recording"
                              );
                            }}
                            className="text-xs"
                          >
                            Voice
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const musicPreset = {
                                masterVolume: 75,
                                bassGain: 2,
                                midGain: 0,
                                trebleGain: 1,
                                compressor: false,
                                reverb: 35,
                                echo: 10,
                                noiseGate: false,
                                limiter: true,
                              };
                              setMixerSettings(musicPreset);
                              addActionLog(
                                "Music Preset Applied",
                                "success",
                                "Optimized for music playback"
                              );
                            }}
                            className="text-xs"
                          >
                            Music
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const podcastPreset = {
                                masterVolume: 85,
                                bassGain: -1,
                                midGain: 2,
                                trebleGain: 0,
                                compressor: true,
                                reverb: 5,
                                echo: 0,
                                noiseGate: true,
                                limiter: true,
                              };
                              setMixerSettings(podcastPreset);
                              addActionLog(
                                "Podcast Preset Applied",
                                "success",
                                "Optimized for podcast recording"
                              );
                            }}
                            className="text-xs"
                          >
                            Podcast
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const defaultPreset = {
                                masterVolume: 75,
                                bassGain: 0,
                                midGain: 0,
                                trebleGain: 0,
                                compressor: false,
                                reverb: 25,
                                echo: 0,
                                noiseGate: false,
                                limiter: true,
                              };
                              setMixerSettings(defaultPreset);
                              addActionLog(
                                "Default Preset Applied",
                                "info",
                                "Reset to default settings"
                              );
                            }}
                            className="text-xs"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 border-t transition-colors duration-300 ${
          isDarkMode
            ? "border-gray-800 bg-gray-900/90"
            : "border-gray-200 bg-white/90"
        } backdrop-blur-sm z-30`}
      >
        <div className="flex items-center justify-center space-x-2 p-4">
          <ToolButton
            icon={Mic}
            onClick={handleRecord}
            active={isRecording}
            tooltip="Toggle Recording"
            className={isRecording ? "animate-pulse" : ""}
          />
          <ToolButton
            icon={Square}
            onClick={() => {
              setIsRecording(false);
              setIsPlaying(false);
              setCurrentStatus("Ready");
              addActionLog(
                "All Playback Stopped",
                "info",
                "All audio operations stopped"
              );
            }}
            tooltip="Stop All"
          />
          <ToolButton
            icon={isPlaying ? Pause : Play}
            onClick={handlePlay}
            active={isPlaying}
            tooltip={isPlaying ? "Pause" : "Play"}
          />
          <ToolButton
            icon={FileText}
            onClick={handleTranscribe}
            active={isTranscribing}
            tooltip={
              isTranscribing ? "Stop Transcription" : "Start Live Transcription"
            }
            className={isTranscribing ? "animate-pulse" : ""}
          />
          <ToolButton
            icon={MessageCircle}
            onClick={() => toggleRightPanel("chat")}
            active={rightPanelMode === "chat"}
            tooltip="Toggle Chat"
          />
          <ToolButton
            icon={Activity}
            onClick={() => toggleRightPanel("transcription")}
            active={rightPanelMode === "transcription"}
            tooltip="Toggle Live Transcription"
            badge={isTranscribing ? "●" : undefined}
          />
          <ToolButton
            icon={Menu}
            onClick={() => toggleRightPanel("actionlog")}
            active={rightPanelMode === "actionlog"}
            tooltip="Toggle Action Log"
            badge={actionLog.length > 5 ? "!" : undefined}
          />
          <ToolButton
            icon={Sliders}
            onClick={() => toggleRightPanel("mixer")}
            active={rightPanelMode === "mixer"}
            tooltip="Toggle Audio Mixer"
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-64 transition-colors duration-300 ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } p-6`}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Tools</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant={isRecording ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleRecord();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>

              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  handlePlay();
                  setIsMobileMenuOpen(false);
                }}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button
                variant={isTranscribing ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  handleTranscribe();
                  setIsMobileMenuOpen(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isTranscribing ? "Stop Transcription" : "Start Transcription"}
              </Button>

              <Button
                variant={rightPanelMode === "chat" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  toggleRightPanel("chat");
                  setIsMobileMenuOpen(false);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>

              <Button
                variant={
                  rightPanelMode === "transcription" ? "default" : "ghost"
                }
                className="justify-start"
                onClick={() => {
                  toggleRightPanel("transcription");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Activity className="h-4 w-4 mr-2" />
                Live Transcription
              </Button>

              <Button
                variant={rightPanelMode === "actionlog" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  toggleRightPanel("actionlog");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Menu className="h-4 w-4 mr-2" />
                Action Log
              </Button>
              <Button
                variant={rightPanelMode === "mixer" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => {
                  toggleRightPanel("mixer");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Sliders className="h-4 w-4 mr-2" />
                Audio Mixer
              </Button>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className="text-sm">Dark Mode</span>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
