"use client";

import { useState, useRef } from "react";
import { Link2, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { deleteImageFromUrl } from "@/lib/supabase/storage";
import Image from "next/image";

interface ImageInputProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export function ImageInput({ value, onChange, label, hint }: ImageInputProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState(value?.startsWith("data:") ? "" : (value || ""));
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUrlChange = (v: string) => {
    setUrlInput(v);
    onChange(v);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from('public-images')
        .upload(filePath, file);

      if (error) {
        alert("Failed to upload image.");
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public-images')
        .getPublicUrl(filePath);

      // Clean up the old image if it's a Supabase URL
      if (value && value !== publicUrl) {
        // We don't await this so the UI updates instantly
        deleteImageFromUrl(value);
      }

      onChange(publicUrl);
    } catch {
    } finally {
      setIsUploading(false);
    }
  };

  const clear = () => {
    if (value) {
      deleteImageFromUrl(value);
    }
    onChange("");
    setUrlInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const preview = value && value.length > 0 ? value : null;

  return (
    <div className="space-y-3">
      {label && <label className="text-xs font-bold text-foreground/60 ml-1 block">{label}</label>}
      {hint && <p className="text-xs text-foreground/40 ml-1 -mt-2">{hint}</p>}

      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMode("url")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all ${mode === "url" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground/60 hover:border-primary/40"}`}>
          <Link2 size={15} /> Coller URL
        </button>
        <button type="button" onClick={() => setMode("upload")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all ${mode === "upload" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground/60 hover:border-primary/40"}`}>
          <Upload size={15} /> Téléverser
        </button>
      </div>

      {/* URL Input */}
      {mode === "url" && (
        <input
          type="url"
          placeholder="https://exemple.com/photo.jpg"
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full bg-background border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground text-sm"
        />
      )}

      {/* File Upload */}
      {mode === "upload" && (
        <label className={`flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-primary/50 rounded-2xl transition-colors bg-background ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-primary/5"}`}>
          {isUploading ? (
            <Loader2 className="text-primary w-6 h-6 mb-1 animate-spin" />
          ) : (
            <Upload className="text-primary w-6 h-6 mb-1" />
          )}
          <span className="font-bold text-sm text-foreground/60">
            {isUploading ? "Téléversement..." : "Choisir une photo"}
          </span>
          <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={isUploading} />
        </label>
      )}

      {/* Preview */}
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm h-40">
          <Image src={preview} alt="Aperçu" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
          <button type="button" onClick={clear}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="w-full h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-foreground/20">
          <ImageIcon size={32} />
        </div>
      )}
    </div>
  );
}
