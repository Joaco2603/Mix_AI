"use client";

import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { WelcomeScreen } from "./welcome-screen";
import { generateConversationTitle } from "@/utils/conversation-title";
import type { Message } from "@/types/chat";
import ChatInput from "./chat-input";
import httpClient from "@/lib";

/**
 * ChatInterface
 *
 * Componente principal que orquesta la conversación entre el usuario
 * y el asistente. Gestiona el estado local de mensajes, título de la
 * conversación y la comunicación con la API mediante el adaptador HTTP.
 *
 * Responsabilidades:
 * - Mantener la lista de mensajes y estados (typing, conversationId)
 * - Enviar peticiones al backend usando `httpClient`
 * - Generar título de conversación una vez haya suficiente contexto
 */
export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(
    null!
  ) as React.RefObject<HTMLDivElement>;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAssistantTyping]);

  const hasUserMessages = messages.some((msg) => msg.role === "user");

  useEffect(() => {
    if (messages.length >= 2 && !conversationTitle) {
      const title = generateConversationTitle(messages);
      setConversationTitle(title);
    }
  }, [messages, conversationTitle]);



  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      status: "sending",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Update message status to delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 500);

    // Send request to actual API
    setIsAssistantTyping(true);

  try {
      // Make API call using the httpClient adapter
      const response = await httpClient.post('/chat', {
        question: content,
        // Solo incluir chatId si ya existe
        ...(conversationId && { chatId: conversationId }),
      });

      // Si es la primera vez, guardar el ID que retornó el servidor
      if (!conversationId && response.chatId) {
        setConversationId(response.chatId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer || "No response received",
        role: "assistant",
        timestamp: new Date(),
        status: "delivered",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API Error:', error);

      // Handle error by showing an error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        status: "error",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAssistantTyping(false);
    }
  };


  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      {!hasUserMessages ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <ChatMessages
              messages={messages}
              isAssistantTyping={isAssistantTyping}
              messagesEndRef={messagesEndRef}
            />
          </div>
          <div className="p-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </>
      )}
    </div>
  );
}
