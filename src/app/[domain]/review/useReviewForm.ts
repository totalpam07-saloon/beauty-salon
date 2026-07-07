import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { addReviewAction } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";

export function useReviewForm({
  tenantId,
  appointmentId,
  existingReview
}: {
  tenantId: string;
  appointmentId: string;
  existingReview?: any;
}) {
  const { t } = useI18n();
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isAnonymous, setIsAnonymous] = useState(existingReview?.is_anonymous || false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  
  // Initialize preview with existing media
  const initialMedia = existingReview?.media || (
    existingReview?.image_url ? [{id: crypto.randomUUID(), url: existingReview.image_url, type: 'image', likes: 0}] : 
    existingReview?.video_url ? [{id: crypto.randomUUID(), url: existingReview.video_url, type: 'video', likes: 0}] : 
    []
  );
  const [existingMedia, setExistingMedia] = useState<{id: string, url: string, type: 'image' | 'video', likes: number}[]>(initialMedia);
  const [previewUrls, setPreviewUrls] = useState<{url: string, type: 'image' | 'video'}[]>([]);
  
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [showEditForm, setShowEditForm] = useState(!existingReview);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        let mediaArray = [...existingMedia];

        if (filesToUpload.length > 0) {
          const uploadedMedia = await Promise.all(filesToUpload.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const isVideo = file.type.startsWith('video/');
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `reviews/${uniqueFileName}`;

            const { error: uploadError } = await supabase.storage
              .from('receipts') // we can reuse the receipts bucket since it's public
              .upload(filePath, file);

            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(filePath);
              return { id: crypto.randomUUID(), url: publicUrl, type: (isVideo ? 'video' : 'image') as 'video' | 'image', likes: 0 };
            }
            return null;
          }));
          
          mediaArray = [...mediaArray, ...(uploadedMedia.filter(m => m !== null) as {id: string, url: string, type: 'image'|'video', likes: number}[])];
        }

        await addReviewAction(tenantId, appointmentId, rating, comment, mediaArray, isAnonymous);
        setSubmitted(true);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return {
    t,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    isAnonymous,
    setIsAnonymous,
    filesToUpload,
    setFilesToUpload,
    existingMedia,
    setExistingMedia,
    previewUrls,
    setPreviewUrls,
    isPending,
    submitted,
    showEditForm,
    setShowEditForm,
    handleSubmit
  };
}
