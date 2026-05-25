import { BadgeCheck } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

export default function Header() {
  const vNumber = typeof window !== "undefined" ? localStorage.getItem("currentVNumber") : null;
  const profileLink = vNumber ? `/auto-bhaiya/${vNumber}/profile` : "/";

  return (
    <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-2 pb-0.5 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <a href="/">
          <div className="flex items-center gap-2">
            <div className="h-21 w-21">
              <img
                src="/logo.png"
                alt="Auto Bhaiya Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white">
                Auto Bhaiya
              </h1>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Partner App
              </span>
            </div>
          </div>
        </a>
        {/* Clerk Auth / Profile */}
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-primary hover:underline">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-medium bg-primary text-white px-3 py-1 rounded-full hover:bg-primary-dark">Sign Up</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>
      </div>
    </header>
  );
}
