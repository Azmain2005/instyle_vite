
import React from "react";
import { PanelRightIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/adminSidebar/sidebar";
import { Button } from "@/components/ui/button";

export default function MobileSidebarToggle() {
  const { toggleSidebar, isMobile } = useSidebar();

  // Only render on mobile screens
  if (!isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="fixed top-4 right-4 z-[60] size-10 bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 rounded-xl md:hidden"
      aria-label="Toggle Menu"
    >
      <PanelRightIcon size={20} className="text-gray-900"  />
    </Button>
  );
}