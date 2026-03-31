"use client";

import {
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  Download,
  HelpCircle,
  Settings,
  Command,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 pointer-events-none"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-background) 0%, var(--color-background) 30%, transparent 100%)",
      }}
    >
      <div className="flex items-center gap-3 pointer-events-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted/50 transition-colors outline-none">
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8} className="w-64 rounded-2xl p-2">
            <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 text-sm">
              <ChevronLeft className="h-4 w-4" />
              Go to all projects
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 text-sm">
              <Download className="h-4 w-4" />
              Download Project
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 text-sm">
              <HelpCircle className="h-4 w-4" />
              Help
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-3 rounded-xl px-3 py-2.5 text-sm"
              onClick={toggleTheme}
            >
              <Sun className="h-4 w-4" />
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 text-sm">
              <Command className="h-4 w-4" />
              Command menu
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-base font-semibold font-heading">
          StudyFlow — Greek Mythology Project
        </h1>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <Tooltip>
          <TooltipTrigger
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] hover:bg-muted transition-colors"
            onClick={toggleTheme}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>

        <Avatar className="h-9 w-9 border border-border/15 backdrop-blur-3xl shadow-[var(--glass-shadow)]">
          <AvatarFallback className="text-xs bg-card">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
