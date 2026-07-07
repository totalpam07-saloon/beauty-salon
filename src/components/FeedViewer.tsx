"use client";

import { useEffect, useRef, useState } from "react";
import { Star, X, Share2, Heart, MessageCircle } from "lucide-react";
import { likeMediaAction, unlikeMediaAction } from "@/app/actions";

export interface FeedReview {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  serviceName: string;
  isAnonymous?: boolean;
  media: { id: string; url: string; type: 'image' | 'video'; likes?: number }[];
  likes_count?: number;
}

interface FeedViewerProps {
  reviews: FeedReview[];
  initialIndex: number;
  onClose: () => void;
  tenantDomain: string;
}

export default function FeedViewer({ reviews, initialIndex, onClose, tenantDomain }: FeedViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a flattened array of all media items to scroll through
  const feedItems = reviews.flatMap(review => 
    (review.media && review.media.length > 0 ? review.media : []).map(media => ({
      ...media,
      review
    }))
  );

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [likedMedia, setLikedMedia] = useState<Record<string, boolean>>({});
  const initialLikedMedia = useRef<Record<string, boolean>>({});

  const hasInitialScrolled = useRef(false);

  useEffect(() => {
    if (hasInitialScrolled.current) return;

    // Scroll to the initial review's first media
    let startIdx = 0;
    let found = false;
    for (let i = 0; i < reviews.length; i++) {
      if (i === initialIndex) {
        found = true;
        break;
      }
      startIdx += (reviews[i].media?.length || 0);
    }
    
    if (found && containerRef.current) {
      const container = containerRef.current;
      setTimeout(() => {
        container.scrollTo({ top: startIdx * container.clientHeight, behavior: 'instant' });
      }, 50);
      hasInitialScrolled.current = true;
    }
  }, [initialIndex, reviews]);

  useEffect(() => {
    // Load liked media from local storage
    try {
      const saved = localStorage.getItem(`likes_media_${tenantDomain}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLikedMedia(parsed);
        initialLikedMedia.current = parsed;
      }
    } catch(e) {}
  }, [tenantDomain]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveItemIndex(index);
            
            // Auto-play video if it's a video
            const video = entry.target.querySelector('video');
            if (video) {
              video.currentTime = 0;
              video.play().catch(e => console.log("Autoplay prevented:", e));
            }
          } else {
            // Pause video if it leaves viewport
            const video = entry.target.querySelector('video');
            if (video) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const slides = container.querySelectorAll('.feed-slide');
    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [feedItems]);

  const handleLike = async (reviewId: string, mediaId: string) => {
    if (!mediaId) return; // Fallback in case old data doesn't have an ID
    const isCurrentlyLiked = likedMedia[mediaId];
    
    // Optimistic update
    const newLiked = { ...likedMedia, [mediaId]: !isCurrentlyLiked };
    setLikedMedia(newLiked);
    try {
      localStorage.setItem(`likes_media_${tenantDomain}`, JSON.stringify(newLiked));
    } catch(e) {}

    if (isCurrentlyLiked) {
      await unlikeMediaAction(reviewId, mediaId);
    } else {
      await likeMediaAction(reviewId, mediaId);
    }
  };

  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (reviewId: string) => {
    if (isSharing) return;
    
    const url = `${window.location.origin}/`;
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: 'Avis Client',
          text: 'Découvrez cet avis !',
          url: url
        });
      } catch (e: any) {
        // AbortError is normal when user cancels. InvalidStateError happens on rapid clicks.
        // We avoid console.error so Next.js doesn't pop up the dev overlay.
        console.log("Share API cancelled or failed:", e.message);
        
        // If it's not an abort error, fallback to clipboard
        if (e.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          alert("Lien copié dans le presse-papier !");
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Lien copié dans le presse-papier !");
    }
  };

  if (feedItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="absolute top-0 inset-x-0 z-10 flex justify-between items-center p-4 md:p-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <h2 className="font-bold text-lg drop-shadow-md">Avis Clients</h2>
        <button 
          onClick={onClose}
          className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors pointer-events-auto"
        >
          <X size={24} />
        </button>
      </div>

      {/* Scrolling Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {feedItems.map((item, index) => {
          const { review } = item;
          // Use item.id for likes. Fallback to review.id if item.id is missing for older data.
          const currentMediaId = item.id || review.id;
          
          const isLiked = likedMedia[currentMediaId];
          const initiallyLiked = initialLikedMedia.current[currentMediaId];
          
          let likesCount = item.likes || 0;
          if (isLiked && !initiallyLiked) likesCount += 1;
          if (!isLiked && initiallyLiked) likesCount -= 1;

          return (
            <div 
              key={`${review.id}-${index}`} 
              data-index={index}
              className="feed-slide relative w-full h-full snap-start flex items-center justify-center bg-black overflow-hidden"
            >
              {/* Media Background */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                {item.type === 'video' ? (
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                  />
                ) : (
                  <>
                    {/* Blurred background to fill empty space for images */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110" 
                      style={{ backgroundImage: `url(${item.url})` }}
                    />
                    {/* Uncropped foreground image */}
                    <img 
                      src={item.url} 
                      alt={`Review media ${index}`} 
                      className="relative w-full h-full object-contain"
                    />
                  </>
                )}
              </div>

              {/* Gradient Overlay for Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Review Content (Bottom Left) */}
              <div className="absolute bottom-0 left-0 right-16 p-4 md:p-8 pb-8 md:pb-12 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center font-bold text-primary-foreground border border-white/20 shadow-lg">
                    {review.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight text-white drop-shadow-md">@{review.clientName.replace(/\s+/g, '').toLowerCase()}</h3>
                    <p className="text-white/80 text-xs drop-shadow-md">{review.serviceName}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={review.rating >= star ? "fill-yellow-400 text-yellow-400 drop-shadow-md" : "text-white/30"} />
                  ))}
                </div>

                <p className="text-white text-sm md:text-base font-medium leading-snug drop-shadow-md max-w-sm line-clamp-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Action Buttons (Right Side) */}
              <div className="absolute bottom-32 md:bottom-32 right-2 md:right-4 flex flex-col gap-6 items-center z-10">
                <button 
                  onClick={() => handleLike(review.id, item.id || review.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-active:scale-95 transition-transform">
                    <Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">{likesCount}</span>
                </button>

                <button 
                  onClick={() => handleShare(review.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-active:scale-95 transition-transform">
                    <Share2 size={24} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">Partager</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
