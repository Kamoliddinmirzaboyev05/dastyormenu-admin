// ─── Image Upload Service ────────────────────────────────────────────────────

/**
 * ImgBB orqali rasm yuklash
 * Bepul API: https://api.imgbb.com/
 */

const IMGBB_API_KEY = 'your-imgbb-api-key'; // Demo key, o'zingiznikini oling: https://api.imgbb.com/

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Rasmni ImgBB'ga yuklash
 */
export async function uploadImageToImgBB(file: File): Promise<ImageUploadResult> {
  try {
    console.log('📤 Uploading image to ImgBB:', file.name);

    // FormData yaratish
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    // ImgBB API'ga yuborish
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.data?.url) {
      console.log('✅ Image uploaded to ImgBB:', data.data.url);
      return {
        success: true,
        url: data.data.url,
      };
    } else {
      console.error('❌ ImgBB upload failed:', data);
      return {
        success: false,
        error: data.error?.message || 'Rasm yuklanmadi',
      };
    }
  } catch (error) {
    console.error('❌ ImgBB upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Xatolik yuz berdi',
    };
  }
}

/**
 * Rasmni Cloudinary'ga yuklash (alternative)
 */
export async function uploadImageToCloudinary(file: File): Promise<ImageUploadResult> {
  try {
    console.log('📤 Uploading image to Cloudinary:', file.name);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dastyor_menu'); // Cloudinary'da yaratish kerak
    formData.append('cloud_name', 'your-cloud-name'); // O'zingiznikini kiriting

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      console.log('✅ Image uploaded to Cloudinary:', data.secure_url);
      return {
        success: true,
        url: data.secure_url,
      };
    } else {
      console.error('❌ Cloudinary upload failed:', data);
      return {
        success: false,
        error: data.error?.message || 'Rasm yuklanmadi',
      };
    }
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Xatolik yuz berdi',
    };
  }
}

/**
 * Rasmni base64 ga o'girish (kichik rasmlar uchun)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Rasmni kichraytirish (optimization)
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              console.log('✅ Image resized:', {
                original: `${(file.size / 1024).toFixed(2)} KB`,
                resized: `${(resizedFile.size / 1024).toFixed(2)} KB`,
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
