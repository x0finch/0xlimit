import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shadcn/components/ui/dropdown-menu";
import { useTheme } from "@shadcn/components/theme-provider";
import { ConnectKitButton } from "connectkit";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 max-w-screen-2xl items-center px-4">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">Uniswap V3 Maker</span>
        </div>

        <div className="flex flex-1 space-x-2 justify-end items-center">
          <ThemeToggle />
          <ConnectKitButton />
        </div>
      </div>
    </header>
  );
};

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
