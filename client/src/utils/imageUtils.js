import { getApiUrl } from "../config/api";

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path (can be relative or absolute URL)
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  // If it's already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path (starts with /), prepend the server URL
  if (imagePath.startsWith("/")) {
    return `${
      import.meta.env.VITE_API_URL || "http://localhost:5003"
    }${imagePath}`;
  }

  // If it's just a filename, assume it's in the uploads directory
  return getApiUrl(`/uploads/${imagePath}`);
};

/**
 * Get a placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (
  width = 800,
  height = 600,
  text = "No Image"
) => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(
    text
  )}`;
};

/**
 * Handle image loading errors by setting a fallback
 * @param {Event} event - The error event
 * @param {string} fallbackUrl - Optional fallback URL
 */
export const handleImageError = (event, fallbackUrl = null) => {
  const img = event.target;

  if (fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    // Use a placeholder image
    img.src = getPlaceholderImage(800, 600, "Image Not Found");
  }

  // Add error class for styling
  img.classList.add("image-error");
};

/**
 * Preload an image to check if it exists
 * @param {string} imageUrl - The image URL to check
 * @returns {Promise<boolean>} - Promise that resolves to true if image loads
 */
export const preloadImage = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};
