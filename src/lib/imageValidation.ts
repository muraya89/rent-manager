export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return "Use a JPG, PNG or WebP image";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be under 5 MB";
  return null;
}
