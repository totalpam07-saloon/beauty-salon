import { createClient } from "@/lib/supabase/client";

/**
 * Extracts the file path from a Supabase public URL and deletes it from the specified bucket.
 * @param url The public URL of the image
 * @param bucket The storage bucket name (defaults to "public-images")
 */
export async function deleteImageFromUrl(url: string | null | undefined, bucket: string = "public-images") {
  if (!url) return;

  try {
    const bucketStr = `/${bucket}/`;
    const index = url.indexOf(bucketStr);
    
    if (index !== -1) {
      // Extract everything after the bucket name as the file path
      const filePath = url.substring(index + bucketStr.length);
      
      if (filePath) {
        const supabase = createClient();
        const { error } = await supabase.storage.from(bucket).remove([filePath]);
        
        if (error) {
          console.error(`Failed to delete image at ${filePath} from bucket ${bucket}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error in deleteImageFromUrl:", error);
  }
}
