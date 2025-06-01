import youtubedl from 'yt-dlp-exec';

const QUALITY_FORMATS = {
  '720': 'best[height<=720][ext=mp4]/best[ext=mp4]/best',
  '1080': 'best[height<=1080][ext=mp4]/best[ext=mp4]/best',
  '2k': 'best[height<=1440][ext=mp4]/best[ext=mp4]/best',
  '4k': 'best[height<=2160][ext=mp4]/best[ext=mp4]/best',
  'default': 'best'
};

export const getVideoUrl = async (url, quality = 'default') => {
  const format = QUALITY_FORMATS[quality] || QUALITY_FORMATS['default'];
  try {
    const output = await youtubedl(url, {
      format: format,
      getUrl: true
    });
    const videoUrl = output.trim();
    if (!videoUrl) throw new Error('No downloadable video URL found');
    return videoUrl;
  } catch (error) {
    throw new Error('yt-dlp error: ' + error.message);
  }
}; 