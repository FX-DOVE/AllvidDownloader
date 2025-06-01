import youtubedl from 'yt-dlp-exec';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUALITY_FORMATS = {
  '720': 'best[height<=720][ext=mp4]/best[ext=mp4]/best',
  '1080': 'best[height<=1080][ext=mp4]/best[ext=mp4]/best',
  '2k': 'best[height<=1440][ext=mp4]/best[ext=mp4]/best',
  '4k': 'best[height<=2160][ext=mp4]/best[ext=mp4]/best',
  'default': 'best'
};

const YT_DLP_PATH = path.join(__dirname, '../bin/yt-dlp');

export const getVideoUrl = async (url, quality = 'default') => {
  const format = QUALITY_FORMATS[quality] || QUALITY_FORMATS['default'];
  try {
    const output = await youtubedl(url, {
      format: format,
      getUrl: true,
      ytdlpPath: YT_DLP_PATH
    });
    const videoUrl = output.trim();
    if (!videoUrl) throw new Error('No downloadable video URL found');
    return videoUrl;
  } catch (error) {
    throw new Error('yt-dlp error: ' + error.message);
  }
};

export const downloadVideo = async (url) => {
  try {
    const options = {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      ytdlpPath: YT_DLP_PATH
    };

    const result = await youtubedl(url, options);
    return result;
  } catch (error) {
    throw new Error(`Failed to download video: ${error.message}`);
  }
}; 