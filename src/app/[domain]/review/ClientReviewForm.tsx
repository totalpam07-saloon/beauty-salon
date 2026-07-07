"use client";

import { useReviewForm } from "./useReviewForm";
import { ReviewFormClassic } from "./ReviewFormClassic";
import { ReviewFormLuxe } from "./ReviewFormLuxe";
import { ReviewFormSpa } from "./ReviewFormSpa";
import { ReviewFormPop } from "./ReviewFormPop";
import { ReviewFormEditorial } from "./ReviewFormEditorial";
import { ReviewFormPlayful } from "./ReviewFormPlayful";
import { ReviewFormRetro } from "./ReviewFormRetro";

export default function ClientReviewForm({ 
  tenantId,
  appointmentId, 
  clientName, 
  serviceName, 
  date,
  existingReview,
  settings
}: { 
  tenantId: string;
  appointmentId: string;
  clientName: string;
  serviceName: string;
  date: string;
  existingReview?: any;
  settings?: any;
}) {
  const flow = useReviewForm({ tenantId, appointmentId, existingReview });

  const props = {
    tenantId,
    appointmentId,
    clientName,
    serviceName,
    date,
    settings,
    flow
  };

  switch (settings?.theme) {
    case "classic":
      return <ReviewFormClassic {...props} />;
    case "luxe":
      return <ReviewFormLuxe {...props} />;
    case "spa":
      return <ReviewFormSpa {...props} />;
    case "pop":
      return <ReviewFormPop {...props} />;
    case "editorial":
      return <ReviewFormEditorial {...props} />;
    case "playful":
      return <ReviewFormPlayful {...props} />;
    case "retro":
      return <ReviewFormRetro {...props} />;
    default:
      return <ReviewFormClassic {...props} />;
  }
}
