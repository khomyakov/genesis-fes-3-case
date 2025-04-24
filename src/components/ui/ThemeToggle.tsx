import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("fixed top-4 left-1/2 -translate-x-1/2 z-50", className)}>
      <div className="bg-background border border-border rounded-full p-1 shadow-md flex items-center justify-between">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "p-2 rounded-full transition-all",
            theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
          aria-label="Light mode"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "p-2 rounded-full transition-all",
            theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
          aria-label="Dark mode"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 