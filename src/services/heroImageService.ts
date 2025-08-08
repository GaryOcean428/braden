import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeroImage {
  name: string;
  url: string;
  path: string;
  created_at?: string;
}

/**
 * Upload a hero image file to Supabase storage
 */
export async function uploadHeroImage(file: File): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${file.name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
    
    // Upload to hero-images bucket
    const { data, error } = await supabase.storage
      .from('hero-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('File uploaded successfully:', data.path);
    return data.path;
  } catch (error) {
    console.error('Hero image upload error:', error);
    throw error;
  }
}

/**
 * Get a signed URL for uploading (alternative method for more robust uploads)
 */
export async function createSignedUploadUrl(fileName: string): Promise<{ signedUrl: string; path: string }> {
  try {
    const { data, error } = await supabase.storage
      .from('hero-images')
      .createSignedUploadUrl(fileName, 60); // expires in 60 seconds

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return {
      signedUrl: data.signedUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Signed URL creation error:', error);
    throw error;
  }
}

/**
 * Upload using signed URL (more robust method)
 */
export async function uploadWithSignedUrl(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${file.name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
    
    // Get signed URL
    const { signedUrl, path } = await createSignedUploadUrl(fileName);
    
    // Upload file using signed URL
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    console.log('File uploaded successfully via signed URL:', path);
    return path;
  } catch (error) {
    console.error('Signed URL upload error:', error);
    throw error;
  }
}

/**
 * List all hero images
 */
export async function listHeroImages(): Promise<HeroImage[]> {
  try {
    const { data, error } = await supabase.storage
      .from('hero-images')
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw new Error(`Failed to list images: ${error.message}`);
    }

    // Convert to HeroImage objects with public URLs
    const images: HeroImage[] = data?.map(obj => {
      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(obj.name);
      
      return {
        name: obj.name,
        path: obj.name,
        url: urlData.publicUrl,
        created_at: obj.created_at
      };
    }) || [];

    return images;
  } catch (error) {
    console.error('List hero images error:', error);
    throw error;
  }
}

/**
 * Delete a hero image
 */
export async function deleteHeroImage(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('hero-images')
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    console.log('Image deleted successfully:', path);
  } catch (error) {
    console.error('Delete hero image error:', error);
    throw error;
  }
}

/**
 * Get public URL for a hero image
 */
export function getHeroImageUrl(path: string): string {
  const { data } = supabase.storage
    .from('hero-images')
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Upload hero image with progress and error handling
 */
export async function uploadHeroImageWithToast(file: File): Promise<string> {
  const toastId = toast.loading('Uploading hero image...');
  
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image must be smaller than 5MB');
    }

    // Try signed URL upload first (more robust)
    let path: string;
    try {
      path = await uploadWithSignedUrl(file);
    } catch {
      // Fallback to direct upload
      console.log('Falling back to direct upload...');
      path = await uploadHeroImage(file);
    }

    toast.success('Hero image uploaded successfully!', { id: toastId });
    return path;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    toast.error(message, { id: toastId });
    throw error;
  }
}