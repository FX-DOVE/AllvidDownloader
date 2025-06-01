const fs = require('fs');
const path = require('path');
const https = require('https');

const YT_DLP_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
const OUTPUT_DIR = path.join(__dirname, '../bin');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'yt-dlp');

// Create bin directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download yt-dlp
const file = fs.createWriteStream(OUTPUT_PATH);
https.get(YT_DLP_URL, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      // Make the file executable
      fs.chmodSync(OUTPUT_PATH, '755');
      console.log('yt-dlp downloaded and made executable successfully!');
    });
  });
}).on('error', (err) => {
  if (fs.existsSync(OUTPUT_PATH)) {
    fs.unlinkSync(OUTPUT_PATH);
  }
  console.error('Error downloading yt-dlp:', err);
}); 