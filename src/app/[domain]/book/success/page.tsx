"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export default function SuccessPage() {
  const { t } = useI18n();
  
  return (
    <div className="flex-1 w-full h-full min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50"></div>
        <CheckCircle className="w-16 h-16 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
        Mèsi! / Thank You!
      </h1>
      
      <p className="text-lg md:text-xl font-medium text-foreground/70 max-w-lg mb-10 leading-relaxed">
        Your appointment request and deposit screenshot have been received. 
        You will receive a confirmation once your payment is verified.
      </p>
      
      <Link href="/" className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
        Return Home
      </Link>
    </div>
  );
}
