import Link from "next/link";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AuthHeaderProps {
  className?: string;
  /** "inverted" is used on the dark illustration panel. */
  variant?: "default" | "inverted";
}

export function AuthHeader({ className, variant = "default" }: AuthHeaderProps) {
  const isInverted = variant === "inverted";

  return (
    <Link
      href="/login"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
    >
      {/* <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_2px_10px_-2px_rgba(79,70,229,0.55)]">
        <span className="absolute left-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-white/90" />
        <span className="absolute bottom-[7px] right-[7px] h-1.5 w-1.5 rounded-full bg-white/50" />
        <span className="text-[13px] font-semibold text-white">D</span>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            isInverted ? "text-white" : "text-foreground",
          )}
        >
          DotSkills
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            isInverted ? "text-white/60" : "text-muted-foreground",
          )}
        >
          Panel
        </span>
      </span> */}
      <Image
        src="/assets/dotskills-logo-loading.png"
        alt="DotSkills Panel"
        width={300}
        height={300}
        priority
        className="relative rounded-full h-40 w-40 select-none object-contain sm:h-24 sm:w-24 animate-loader-breathe will-change-transform"
      />
    </Link>
  );
}
