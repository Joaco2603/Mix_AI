"use client";

import { useState, useEffect } from "react";
import ChatInput from "./chat-input";

interface WelcomeData {
  title: string;
  gradient: string;
}

interface WelcomeScreenProps {
  onSendMessage: (content: string) => void;
}

const welcomeData: WelcomeData[] = [
  {
    title: "¿Por dónde empezamos la mezcla?",
    gradient: "bg-gradient-to-r from-[#20D3C2] to-[#B52EDC]",
  },
  {
    title: "¿Qué sonido tienes en mente hoy?",
    gradient: "bg-gradient-to-r from-[#CF2475] to-[#F36C21]",
  },
  {
    title: "¿Listo para producir juntos?",
    gradient: "bg-gradient-to-r from-[#B52EDC] to-[#20D3C2]",
  },
  {
    title: "¿Cómo puede MixIA mejorar tu proyecto?",
    gradient: "bg-gradient-to-r from-[#F36C21] to-[#CF2475]",
  },
  {
    title: "Iniciemos algo que suene increíble",
    gradient: "bg-gradient-to-r from-[#20D3C2] to-[#F36C21]",
  },
  {
    title: "¿Qué mezcla quieres descubrir hoy?",
    gradient: "bg-gradient-to-r from-[#CF2475] to-[#B52EDC]",
  },
  {
    title: "Tu ingeniero de mezcla con IA está aquí",
    gradient: "bg-gradient-to-r from-[#B52EDC] to-[#F36C21]",
  },
  {
    title: "¿Listo para dar vida a nuevas ideas?",
    gradient: "bg-gradient-to-r from-[#F36C21] to-[#20D3C2]",
  },
  {
    title: "¿Qué vamos a crear en esta sesión?",
    gradient: "bg-gradient-to-r from-[#20D3C2] via-[#CF2475] to-[#B52EDC]",
  },
  {
    title: "Hagamos que la música cobre magia",
    gradient: "bg-gradient-to-r from-[#B52EDC] via-[#F36C21] to-[#20D3C2]",
  },
];

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const [currentWelcome, setCurrentWelcome] = useState<WelcomeData>({
    title: "",
    gradient: "",
  });

  useEffect(() => {
    const randomWelcome =
      welcomeData[Math.floor(Math.random() * welcomeData.length)];
    setCurrentWelcome(randomWelcome);
  }, []);

  return (
    <>
      {currentWelcome.title && currentWelcome.gradient && (
        <div className="flex flex-col items-center justify-center h-full px-4">
          <div className="w-full max-w-2xl">
            {/* Welcome Title */}
            <div className="text-center mb-8">
              <h1
                className={`text-3xl md:text-4xl font-semibold mb-2 font-sans ${currentWelcome.gradient} bg-clip-text text-transparent animate-in fade-in duration-500`}
              >
                {currentWelcome.title}
              </h1>
            </div>

            {/* Centered Composer */}
            <div className="w-full">
              <ChatInput onSendMessage={onSendMessage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
