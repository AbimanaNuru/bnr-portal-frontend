"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/src/core/lib/utils";
import { useLayoutStore } from "@/src/core/store/useLayoutStore";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useLayoutStore();

    // Avoid hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
        // Sync initial class on mount since store might have loaded from localStorage
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, []);

    if (!mounted) return <div className="w-[52px] h-[28px]" />;

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none shadow-inner",
                theme === "dark" ? "bg-primary border-primary" : "bg-bg-hover border-border hover:bg-border/50"
            )}
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Toggle theme"
        >
            {/* Background Icons (stationary) */}
            <span className="absolute flex w-full justify-between px-1.5 pointer-events-none">
                <Sun className={cn("w-3.5 h-3.5 transition-colors duration-200", theme === "dark" ? "text-white" : "text-transparent")} />
                <Moon className={cn("w-3.5 h-3.5 transition-colors duration-200", theme === "light" ? "text-text-muted" : "text-transparent")} />
            </span>

            {/* Moving Thumb */}
            <span
                className={cn(
                    "pointer-events-none relative flex h-[22px] w-[22px] items-center justify-center transform rounded-full bg-bg-card shadow-sm ring-0 transition duration-200 ease-in-out",
                    theme === "dark" ? "translate-x-[26px]" : "translate-x-[2px]"
                )}
            >
                {theme === "dark" ? (
                    <Moon className="w-3.5 h-3.5 text-primary" />
                ) : (
                    <Sun className="w-3.5 h-3.5 text-text-secondary" />
                )}
            </span>
        </button>
    );
};

export default ThemeSwitcher;
