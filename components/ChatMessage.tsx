"use client";

interface ChatMessageProps {
  type: "bot" | "user";
  message: string;
  mainColor?: string;
  userColor?: string;
  chatIconType?: string | null;
  chatIconPreset?: string | null;
  logoUrl?: string | null;
}

const PRESET_ICONS: Record<string, string> = {
  home: "M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z",
  store: "M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z",
  heart: "M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z",
  star: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z",
  smile: "M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z",
  utensils: "M4 4v8h3v8h2V4H7v6H5V4H4Zm10 0v6.5c0 1.38 1.12 2.5 2.5 2.5H18v7h2V4h-2v7h-1.5c-.28 0-.5-.22-.5-.5V4h-2Z",
  scissors: "M9.75 9.362a.75.75 0 0 0-1.08.673v2.929a.75.75 0 0 0 1.08.674L12 12.576V14.5a2.5 2.5 0 1 1-5 0V12l-2.22 1.11a.75.75 0 0 0 .67 1.34L7.5 13.5v1a4 4 0 0 0 8 0v-1l2.05 1.025a.75.75 0 0 0 .67-1.34L16 12v-2.5a2.5 2.5 0 0 0-5 0v1.924l-1.25-.562Z",
  bone: "M15.59 3.59A2 2 0 0 1 18 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73l-1.4 8.54A2 2 0 0 1 20 16a2 2 0 0 1-2 2 2 2 0 0 1-1.73-1l-8.54 1.4A2 2 0 0 1 6 20a2 2 0 0 1-2-2c0-.74.4-1.39 1-1.73l1.4-8.54A2 2 0 0 1 4 6a2 2 0 0 1 2-2 2 2 0 0 1 1.73 1l8.54-1.4Z",
  medical: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-4H7v-2h4V7h2v4h4v2h-4v4Z",
};

function BotAvatar({ mainColor, chatIconType, chatIconPreset, logoUrl }: {
  mainColor: string;
  chatIconType?: string | null;
  chatIconPreset?: string | null;
  logoUrl?: string | null;
}) {
  // Use logo image
  if (chatIconType === "logo" && logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="shop"
        className="flex-shrink-0 w-9 h-9 rounded-full object-cover shadow-sm"
      />
    );
  }

  // Use preset icon
  const iconName = chatIconPreset || "home";
  const paths = PRESET_ICONS[iconName] || PRESET_ICONS.home;
  const isStroke = iconName === "smile" || iconName === "scissors";

  return (
    <div
      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
      style={{ backgroundColor: mainColor }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"
        fill={isStroke ? "none" : "white"}
        stroke={isStroke ? "white" : "none"}
        strokeWidth={isStroke ? 1.5 : 0}
      >
        {paths.split(" M").map((p, i) => (
          <path key={i} d={i === 0 ? p : `M${p}`} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
}

export default function ChatMessage({
  type, message, mainColor = "#06B6D4", userColor = "#EDE9FE",
  chatIconType, chatIconPreset, logoUrl,
}: ChatMessageProps) {
  if (type === "bot") {
    return (
      <div className="flex items-start gap-2 mb-4">
        <BotAvatar mainColor={mainColor} chatIconType={chatIconType} chatIconPreset={chatIconPreset} logoUrl={logoUrl} />
        <div
          className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed text-gray-800"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4">
      <div
        className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed text-gray-800"
        style={{ backgroundColor: userColor }}
      >
        {message}
      </div>
    </div>
  );
}

export { PRESET_ICONS };
