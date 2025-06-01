const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const YT_DLP_VERSION = '2023.12.30';
const YT_DLP_URL = `https://github.com/yt-dlp/yt-dlp/releases/download/${YT_DLP_VERSION}/yt-dlp`;

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        fs.chmodSync(dest, '755'); // Make the file executable
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

async function main() {
  try {
    const binDir = path.join(__dirname, '..', 'node_modules', 'yt-dlp-exec', 'bin');
    const ytDlpPath = path.join(binDir, 'yt-dlp');

    // Create bin directory if it doesn't exist
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    console.log('Downloading yt-dlp...');
    await downloadFile(YT_DLP_URL, ytDlpPath);
    console.log('yt-dlp downloaded successfully!');

    // Verify the installation
    const version = execSync(`${ytDlpPath} --version`).toString().trim();
    console.log(`yt-dlp version: ${version}`);
  } catch (error) {
    console.error('Error downloading yt-dlp:', error);
    process.exit(1);
  }
}

main(); 