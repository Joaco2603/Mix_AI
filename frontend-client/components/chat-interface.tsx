"use client";

import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { WelcomeScreen } from "./welcome-screen";
import { generateConversationTitle } from "@/utils/conversation-title";
import type { Message } from "@/types/chat";
import ChatInput from "./chat-input";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string>("");
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

    // Simulate assistant response
    setIsAssistantTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${content}". This is a demo response from MixIA. In a real implementation, this would connect to an AI service for actual responses.`,
        role: "assistant",
        timestamp: new Date(),
        status: "delivered",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsAssistantTyping(false);
    }, 2000);
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
