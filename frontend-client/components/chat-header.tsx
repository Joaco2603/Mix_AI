export function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-[#2a2a3e] bg-[#0D0D1A]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="flex gap-2 w-fit">
            {/* Cyan circle */}
            <div className="relative w-8 h-8 bg-[#1DCCB8] rounded-full">
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-2 bg-[#0D0D1A]"></div>
            </div>

            {/* Magenta circle */}
            <div className="relative w-8 h-8 bg-[#B42165] rounded-full">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-[#0D0D1A]"></div>
            </div>

            {/* Purple circle */}
            <div className="relative w-8 h-8 bg-[#BD11B6] rounded-full">
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-2 bg-[#0D0D1A]"></div>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="font-poppins font-medium text-2xl text-white">
              Mix
              <span>
                <span className="text-[#D85D28]">IA</span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
