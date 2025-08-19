"use client"

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#CF2475] to-[#B52EDC] text-white shadow-lg shadow-[#CF2475]/20 border border-white/10">
          <div className="flex items-center gap-1 typing-dots">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-[#a1a1aa]">MixIA is typing...</span>
        </div>
      </div>
    </div>
  )
}
