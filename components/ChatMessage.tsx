"use client";

interface ChatMessageProps {
  type: "bot" | "user";
  message: string;
}

export default function ChatMessage({ type, message }: ChatMessageProps) {
  if (type === "bot") {
    return (
      <div className="flex items-start gap-2 mb-4">
        {/* Bot avatar */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: "#F5C518" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5"
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
        </div>

        {/* Bot message bubble */}
        <div
          className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed text-gray-800"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {message}
        </div>
      </div>
    );
  }

  // User message — right-aligned
  return (
    <div className="flex justify-end mb-4">
      <div
        className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed text-gray-800"
        style={{ backgroundColor: "#FDE68A" }}
      >
        {message}
      </div>
    </div>
  );
}
