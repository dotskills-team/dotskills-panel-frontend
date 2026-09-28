"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { navigationConfig } from "@/lib/dashboard-config";
import type { UserRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";

import { SidebarNavItems } from "./SidebarNavItems";
import Image from "next/image";

type PremiumSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onSearchClick?: () => void;
};

function openCommandMenu() {
  window.dispatchEvent(new CustomEvent("dotskills:open-command-menu"));
}

export function PremiumSidebar({
  onSearchClick,
  ...props
}: PremiumSidebarProps) {
  const { data: user, isLoading } = useCurrentUser();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const router = useRouter();
  const reset = useAuthStore((s) => s.reset);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const isCollapsed = state === "collapsed";
  const handleSearch = onSearchClick ?? openCommandMenu;

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      reset();
      router.replace("/login");
    }
  }

  if (isLoading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="border-b border-border/50 px-4 py-4">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (!user?.role) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="px-4 py-4">
          <p className="text-center text-sm text-destructive">
            Failed to load sidebar
          </p>
        </SidebarHeader>
      </Sidebar>
    );
  }

  const userRole = (user.role as UserRole) || "STAFF";
  const navGroups = navigationConfig[userRole] || navigationConfig.STAFF;
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
  const initials =
    `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <Sidebar
      {...props}
      className={cn(
        "border-r border-border/60 bg-gray-100 dark:bg-slate-950",
        props.className,
      )}
    >
      {/* Brand */}
      <SidebarHeader className="gap-3 border-b border-border/60 bg-gray-100 dark:bg-slate-950 px-3 py-4">
        {/* <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 shadow-[0_2px_10px_-2px_rgba(79,70,229,0.55)]">
            <span className="absolute left-1.75 top-1.75 h-1.5 w-1.5 rounded-full bg-white/90" />
            <span className="absolute bottom-1.75 right-1.75 h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="text-[13px] font-semibold text-white">D</span>
          </span>

          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                DotSkills
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                Panel
              </span>
            </div>
          )}
        </Link> */}
         <Link
  href="/dashboard"
  onClick={handleLinkClick}
  className="flex w-full items-center rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
>
  <Image
    src="/logo2.png"
    alt="DotSkills"
    width={200}
    height={80}
    className="h-auto w-full object-contain"
    priority
  />
</Link>

        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearch}
                className="h-9 w-9 rounded-lg border-border/60 dark:bg-slate-800 bg-gray-100/40 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Search menu (⌘K)</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={handleSearch}
            className="flex w-full items-center gap-2 rounded-lg border border-border/60 bg-gray-100/40 dark:bg-slate-800 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate text-left">Search menu...</span>
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border/60 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              ⌘K
            </kbd>
          </button>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="flex flex-col bg-gray-100 dark:bg-slate-950">
        <ScrollArea className="flex-1 px-2 py-3 max-h-[70vh]">
          <SidebarNavItems groups={navGroups} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SidebarContent>

      {/* Footer — user chip + logout */}
      <SidebarFooter className="z-100 bg-gray-100 dark:bg-slate-950 gap-2 border-t border-border/60 px-3 py-3">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
              {initials || "U"}
            </span>
            <div className="min-w-0 flex-1 leading-none">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.designation || userRole}
              </p>
            </div>
          </div>
        )}

        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
