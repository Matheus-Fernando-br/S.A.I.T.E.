import Image from "next/image";

interface AIAvatarProps {
  size?: "sm" | "md" | "lg";
  /** Brilho suave enquanto a IA está gerando uma resposta. */
  active?: boolean;
}

export default function AIAvatar({ size = "md", active = false }: AIAvatarProps) {
  const sizes = {
    sm: { box: "h-8 w-8 rounded-xl", image: 22 },
    md: { box: "h-16 w-16 rounded-2xl", image: 44 },
    lg: { box: "h-24 w-24 rounded-3xl", image: 68 },
  };

  return (
    <div
      className={`flex ${sizes[size].box} shrink-0 items-center justify-center border border-[var(--border)] bg-gradient-to-br from-[#0b2233] via-[#081520] to-black transition-shadow duration-500 ${
        active ? "shadow-[0_0_0_3px_var(--accent-glow)]" : "shadow-[var(--shadow-sm)]"
      }`}
      aria-hidden
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={sizes[size].image}
        height={sizes[size].image}
      />
    </div>
  );
}
