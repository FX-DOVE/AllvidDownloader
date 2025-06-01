import express from 'express';
import { downloadVideo } from '../controllers/downloadController.js';
import { getVideoUrl } from '../services/youtubeService.js';
import https from 'https';

const router = express.Router();

router.post('/download', downloadVideo);

// Proxy endpoint for downloading the video
router.get('/proxy', async (req, res) => {
  const { url, filename = 'video.mp4' } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  try {
    // Add headers for TikTok
    const options = url.includes('tiktok.com')
      ? { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.tiktok.com/' } }
      : {};

    https.get(url, options, (stream) => {
      // Forward Content-Length header
      if (stream.headers && stream.headers['content-length']) {
        res.setHeader('Content-Length', stream.headers['content-length']);
      }
      // Always force download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      stream.pipe(res);
    }).on('error', (err) => {
      res.status(500).json({ error: 'Failed to fetch video stream', message: err.message });
    });
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
});

export default router; 