import { execFile } from 'child_process';

const QUALITY_FORMATS = {
  '720': 'best[height<=720][ext=mp4]/best[ext=mp4]/best',
  '1080': 'best[height<=1080][ext=mp4]/best[ext=mp4]/best',
  '2k': 'best[height<=1440][ext=mp4]/best[ext=mp4]/best',
  '4k': 'best[height<=2160][ext=mp4]/best[ext=mp4]/best',
  'default': 'best'
};

export const getVideoUrl = async (url, quality = 'default') => {
  const format = QUALITY_FORMATS[quality] || QUALITY_FORMATS['default'];
  return new Promise((resolve, reject) => {
    execFile(
      'yt-dlp',
      ['-f', format, '-g', url],
      (error, stdout, stderr) => {
        if (error) {
          console.error('yt-dlp error:', stderr || error);
          return reject(new Error('Facebook video extraction failed: ' + (stderr || error.message)));
        }
        const videoUrl = stdout.trim();
        if (!videoUrl) {
          return reject(new Error('No downloadable video URL found'));
        }
        resolve(videoUrl);
      }
    );
  });
}; 