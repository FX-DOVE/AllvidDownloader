import { detectPlatform } from '../utils/detectPlatform.js';
import * as youtubeService from '../services/youtubeService.js';
import * as tiktokService from '../services/tiktokService.js';
import * as instagramService from '../services/instagramService.js';
import * as facebookService from '../services/facebookService.js';

const platformServices = {
  youtube: youtubeService,
  tiktok: tiktokService,
  instagram: instagramService,
  facebook: facebookService
};

export const downloadVideo = async (req, res) => {
  try {
    const { url, platform: providedPlatform, quality } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'URL is required'
      });
    }

    const platform = providedPlatform || detectPlatform(url);
    const service = platformServices[platform];

    if (!service) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Unsupported platform'
      });
    }

    const videoUrl = await service.getVideoUrl(url, quality);
    
    return res.json({ videoUrl });
  } catch (error) {
    return res.status(400).json({
      error: 'Bad Request',
      message: error.message
    });
  }
}; 