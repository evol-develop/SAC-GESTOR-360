import { useState } from "react";
import { Outlet } from "react-router";

import Header from "./header";
import Footer from "@/components/footer";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <main className="relative grid w-full min-h-screen overflow-y-auto grid-rows-[auto,1fr,auto]">
        <Header open={open} />
        <div className="p-4">
          <Outlet />
        </div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
