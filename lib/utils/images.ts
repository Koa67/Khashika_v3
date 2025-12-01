/**
 * Helper function to validate and sanitize image URLs.
 * Returns a placeholder if the URL is invalid or external.
 * 
 * @param url - The image URL to validate
 * @returns A valid local image path or placeholder
 */
export function getValidImageUrl(url: string | undefined | null): string {
  if (!url || url === '' || url === 'Image Manquante' || url.trim() === '') {
    return '/placeholder-image.svg';
  }
  
  // External URLs = broken, use placeholder
  if (url.startsWith('http')) {
    return '/placeholder-image.svg';
  }
  
  // If path doesn't start with /, assume it's in /images/products/
  if (!url.startsWith('/')) {
    // Check if it contains 'prod-' pattern (likely missing image)
    if (url.includes('prod-')) {
      return '/placeholder-image.svg';
    }
    // Check if it's a valid product image path format
    if (url.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return `/images/products/${url}`;
    }
    return '/placeholder-image.svg';
  }
  
  // If path starts with /images/products/, check for missing image patterns
  if (url.startsWith('/images/products/')) {
    // If it contains 'prod-' pattern, it's likely a missing image
    if (url.includes('prod-')) {
      return '/placeholder-image.svg';
    }
    // Check for double-encoded URLs (malformed encoding like %C3%83%C2%A9)
    // These will fail to load, so use placeholder immediately
    if (url.includes('%C3%83%C2')) {
      return '/placeholder-image.svg';
    }
    // Decode URL to handle properly encoded special characters
    try {
      const decoded = decodeURIComponent(url);
      // If decoding changed something and it's still a valid path, use decoded version
      if (decoded !== url && decoded.startsWith('/images/products/')) {
        return decoded;
      }
    } catch {
      // If decoding fails, use original URL and let onError handle it
    }
    // For p-X.jpg patterns, we'll let the browser try to load it
    // and use onError handler in components to fallback to placeholder
    // This avoids expensive file system checks on every render
    return url;
  }
  
  // Other valid paths starting with /
  return url;
}


