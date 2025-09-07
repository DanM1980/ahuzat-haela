// Image optimization utilities
export const optimizeImageUrl = (url: string, width?: number, quality?: number) => {
  // For now, return original URL
  // In production, you can integrate with services like Cloudinary, ImageKit, or Next.js Image
  return url;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(url => preloadImage(url));
  await Promise.all(promises);
};
