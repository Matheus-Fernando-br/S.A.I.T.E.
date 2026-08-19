interface AIAvatarProps {
  size?: "sm" | "md" | "lg";
}

export default function AIAvatar({ size = "md" }: AIAvatarProps) {
  const sizes = {
    sm: "h-9 w-9 text-lg",
    md: "h-16 w-16 text-2xl",
    lg: "h-24 w-24 text-4xl",
  };

  return (
    <div
      className={`flex ${sizes[size]} items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black shadow-xl`}
    >
      🤖
    </div>
  );
}
