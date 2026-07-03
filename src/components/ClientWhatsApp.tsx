"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function ClientWhatsApp({ number }: { number: string }) {
  const pathname = usePathname();
  
  // Clean the number
  const cleanNumber = number.replace(/[^0-9]/g, '');
  
  // Adjust position based on where we are
  // Admin has a bottom nav bar, and settings has a floating save button
  let bottomClass = "bottom-6"; // Default for public pages
  
  if (pathname?.startsWith("/admin")) {
    if (pathname === "/admin/settings") {
      // Avoid bottom nav AND the floating save button on mobile
      bottomClass = "bottom-[160px] md:bottom-6"; 
    } else {
      // Avoid just the bottom nav on mobile
      bottomClass = "bottom-[85px] md:bottom-6";
    }
  }

  return (
    <a 
      href={`https://wa.me/${cleanNumber}`} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`fixed ${bottomClass} right-6 z-[110] bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in slide-in-from-bottom-5`}
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </a>
  );
}
