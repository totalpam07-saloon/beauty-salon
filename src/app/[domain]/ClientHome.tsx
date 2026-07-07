"use client";

import { useState } from "react";
import { Service, SalonSettings, PortfolioPhoto } from "@/store/salon";
import FeedViewer, { FeedReview } from "@/components/FeedViewer";
import TemplateClassic from "./templates/TemplateClassic";
import TemplateLuxe from "./templates/TemplateLuxe";
import TemplateSpa from "./templates/TemplateSpa";
import TemplatePop from "./templates/TemplatePop";
import TemplateEditorial from "./templates/TemplateEditorial";
import TemplatePlayful from "./templates/TemplatePlayful";
import TemplateRetro from "./templates/TemplateRetro";

export interface ClientHomeProps {
  services: Service[];
  settings: SalonSettings;
  portfolio: PortfolioPhoto[];
  reviews?: FeedReview[];
  tenantDomain: string;
  onOpenFeed?: (reviewId: string) => void;
}

export default function ClientHome(props: ClientHomeProps) {
  const [feedIndex, setFeedIndex] = useState<number | null>(null);
  const templateId = props.settings.templateId || 'classic';

  // We find the flattened index of the first media item of the clicked review
  const handleOpenFeed = (reviewId: string) => {
    if (!props.reviews) return;
    let index = 0;
    for (const r of props.reviews) {
      if (r.id === reviewId) {
        setFeedIndex(index);
        return;
      }
      index += r.media?.length || 0;
    }
    setFeedIndex(0); // fallback
  };

  const templateProps = { ...props, onOpenFeed: handleOpenFeed };

  let Content;
  switch (templateId) {
    case 'luxe':
      Content = <TemplateLuxe {...templateProps} />;
      break;
    case 'spa':
      Content = <TemplateSpa {...templateProps} />;
      break;
    case 'pop':
      Content = <TemplatePop {...templateProps} />;
      break;
    case 'editorial':
      Content = <TemplateEditorial {...templateProps} />;
      break;
    case 'playful':
      Content = <TemplatePlayful {...templateProps} />;
      break;
    case 'retro':
      Content = <TemplateRetro {...templateProps} />;
      break;
    case 'classic':
    default:
      Content = <TemplateClassic {...templateProps} />;
      break;
  }

  return (
    <>
      {Content}
      {feedIndex !== null && props.reviews && (
        <FeedViewer 
          reviews={props.reviews} 
          initialIndex={feedIndex} 
          onClose={() => setFeedIndex(null)}
          tenantDomain={props.tenantDomain} 
        />
      )}
    </>
  );
}
