"use client";

import type { Message } from "@/types/chat";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Clock className="w-3 h-3 text-[#a1a1aa]" />;
      case "delivered":
        return <Check className="w-3 h-3 text-[#20D3C2]" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-[#CF2475]" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] md:max-w-[60%]",
          isUser ? "order-2" : "order-1"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-lg",
            isUser
              ? "bg-gradient-to-r from-[#B52EDC] to-[#20D3C2] text-white shadow-[#B52EDC]/20"
              : "bg-gradient-to-r from-[#CF2475] to-[#B52EDC] text-white shadow-[#CF2475]/20"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-inter">
            {message.content}
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 mt-2",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-xs text-[#a1a1aa]">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isUser && getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
