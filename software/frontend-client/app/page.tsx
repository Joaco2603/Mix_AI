<<<<<<< HEAD
=======
// Página principal - envoltorio mínimo que monta la interfaz de chat.
// Mantener este archivo ligero facilita la integración con Next.js y el
// server-side rendering incremental. La UI y la lógica de la conversación
// viven en `components/chat-interface`.
>>>>>>> 122384a318a4f112711a971912eab3eae974404e
import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#0D0D1A] overflow-hidden">
      <ChatInterface />
    </div>
  )
}
