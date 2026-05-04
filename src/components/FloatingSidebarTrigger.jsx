
import React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/adminSidebar/sidebar";
import { cn } from "@/lib/utils";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function FloatingSidebarTrigger() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  const leftClass = isMobile
    ? "left-4"
    : open
    ? "left-[calc(var(--sidebar-width)-2rem)]"
    : "left-4";

  return (
    <SidebarTrigger
      className={cn(
        "fixed top-16 z-50 transition-all duration-300 hidden md:flex", // hidden on mobile, flex on desktop
        open ? "left-[calc(var(--sidebar-width)-2rem)]" : "left-4"
      )}
     />
  );
}
