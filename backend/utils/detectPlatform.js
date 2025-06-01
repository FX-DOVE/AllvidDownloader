export const detectPlatform = (url) => {
  if (!url) {
    throw new Error('URL is required');
  }

  const urlLower = url.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }
  if (urlLower.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (urlLower.includes('instagram.com')) {
    return 'instagram';
  }
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
    return 'facebook';
  }

  throw new Error('Unsupported platform');
}; 