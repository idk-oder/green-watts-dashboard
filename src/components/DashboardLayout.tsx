import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Leaf, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <button
              onClick={() => setDark(!dark)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </header>
          <main className="page-container">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
