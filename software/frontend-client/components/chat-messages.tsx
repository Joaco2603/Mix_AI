"use client";

import type React from "react";

import type { Message } from "@/types/chat";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

interface ChatMessagesProps {
  messages: Message[];
  isAssistantTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({
  messages,
  isAssistantTyping,
  messagesEndRef,
}: ChatMessagesProps) {
  // Renderiza la lista de mensajes y el indicador de escritura.
  // Mantener este componente lo más puro posible (presentacional)
  // facilita pruebas unitarias y separación de responsabilidades.
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-6 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isAssistantTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
