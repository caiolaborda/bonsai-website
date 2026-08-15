import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CMS_DOMAIN = 'https://bonsai-control.netlify.app';
const API_ENDPOINT = `${CMS_DOMAIN}/api/public/portfolio?cb=${Date.now()}`; // cache buster to ensure fresh fetch during build
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/portfolio.json');
const PREVIEWS_DIR = path.resolve(__dirname, '../public/assets/previews');

// Check if FFmpeg is installed and accessible on this machine (safe failover for Netlify)
function hasFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function syncPortfolio() {
  console.log(`[SYNC] Fetching latest portfolio data from ${API_ENDPOINT}...`);
  try {
    const res = await fetch(API_ENDPOINT);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error('Invalid response payload format');
    }

    console.log(`[SYNC] Received ${json.data.length} nodes from CMS.`);

    const ffmpegAvailable = hasFfmpeg();
    if (ffmpegAvailable) {
      console.log(`[SYNC] FFmpeg detected. Missing video thumbnails will be auto-generated.`);
      if (!fs.existsSync(PREVIEWS_DIR)) {
        fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
      }
    } else {
      console.log(`[SYNC] FFmpeg not found (expected if on Netlify). Skipping local thumbnail generation.`);
    }

    const mapped = await Promise.all(json.data.map(async node => {
      let category = node.properties?.portfolio_category?.toLowerCase();
      const mime = (node.properties?.mimeType || '').toLowerCase();
      const tags = (node.properties?.tags || '').toLowerCase();
      
      // Smart fallback if the user hasn't set portfolio_category yet
      if (!category) {
        if (mime.includes('video') || mime.includes('audio') || tags.includes('video')) {
          category = 'media';
        } else {
          category = 'design';
        }
      }

      // Determine media type (Video vs Image)
      let videoUrl = null;
      let image = null;

      if (node.type === 'bookmark') {
        image = node.properties?.imageUrl || null;
      } else if (node.publicUrl) {
        const isAbsolute = node.publicUrl.startsWith('http') || node.publicUrl.startsWith('/assets');
        const url = isAbsolute ? node.publicUrl : `${CMS_DOMAIN}${node.publicUrl}`;
        if (mime.includes('video') || mime.includes('audio')) {
          videoUrl = url;
        } else {
          image = url;
        }
      }

      // Parse tags properly
      let finalTags = [];
      if (node.properties?.tags) {
        finalTags = node.properties.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      // Inject screenshot carousels for specific design projects
      let images = null;
      if (node.id === '156f7f15-8280-4b96-b5b8-e080eacd6f15') {
        image = "/assets/screenshots/cider_1.png";
        images = ["/assets/screenshots/cider_1.png", "/assets/screenshots/cider_2.png", "/assets/screenshots/cider_3.png"];
      } else if (node.id === '6e9551b3-66da-4882-8e90-221fad500356') {
        image = "/assets/screenshots/roots_1.png";
        images = ["/assets/screenshots/roots_1.png", "/assets/screenshots/roots_2.png", "/assets/screenshots/roots_3.png"];
      } else if (node.id === '70b578c2-517b-4538-ac4a-1f3c860586de') {
        image = "/assets/screenshots/daily_1.png";
        images = ["/assets/screenshots/daily_1.png", "/assets/screenshots/daily_2.png", "/assets/screenshots/daily_3.png"];
      } else if (node.title && node.title.includes('Dollar School')) {
        images = ["/assets/screenshots/daily_1.png", "/assets/screenshots/daily_2.png", "/assets/screenshots/daily_3.png"];
      } else if (node.title && node.title.includes('True Life')) {
        image = "/assets/screenshots/truelife_1.png";
        images = ["/assets/screenshots/truelife_1.png", "/assets/screenshots/truelife_2.png", "/assets/screenshots/truelife_3.png"];
      } else if (node.title && node.title.includes('GeoPin')) {
        image = "/assets/screenshots/geopin_1.png";
        images = ["/assets/screenshots/geopin_1.png", "/assets/screenshots/geopin_2.png", "/assets/screenshots/geopin_3.png"];
      } else if (node.title && node.title.includes('Space Golf')) {
        image = "/assets/spacegolf_mockup.jpg";
        images = ["/assets/spacegolf_mockup.jpg", "/assets/spacegolf_actual.png"];
      }

      let previewVideoUrl = null;

      // AUTOMATED MEDIA EXTRACTION
      if (videoUrl && ffmpegAvailable) {
        const posterFilename = `${node.id}.jpg`;
        const posterPath = path.join(PREVIEWS_DIR, posterFilename);
        const publicPosterPath = `/assets/previews/${posterFilename}`;
        
        const clipFilename = `${node.id}_preview.mp4`;
        const clipPath = path.join(PREVIEWS_DIR, clipFilename);
        const publicClipPath = `/assets/previews/${clipFilename}`;
        
        let needsPoster = !image && !fs.existsSync(posterPath);
        let needsClip = !fs.existsSync(clipPath);

        if (needsPoster || needsClip) {
          console.log(`[FFMPEG] Processing media for ${node.id}...`);
          try {
            // Get duration
            const durationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoUrl}"`;
            const durationStr = execSync(durationCmd).toString().trim();
            const duration = parseFloat(durationStr) || 10;
            const midpoint = Math.floor(duration / 2);
            
            if (needsPoster) {
              const extractPosterCmd = `ffmpeg -y -ss ${midpoint} -i "${videoUrl}" -vframes 1 -q:v 2 "${posterPath}"`;
              execSync(extractPosterCmd, { stdio: 'ignore' });
            }

            if (needsClip) {
              const extractClipCmd = `ffmpeg -y -ss ${midpoint} -i "${videoUrl}" -t 4 -c:v libx264 -crf 24 -preset fast -vf "scale=-2:480" -an -movflags +faststart "${clipPath}"`;
              execSync(extractClipCmd, { stdio: 'ignore' });
            }
            console.log(`[FFMPEG] Successfully processed media at ${midpoint}s`);
          } catch (e) {
            console.error(`[FFMPEG WARNING] Stream failed for ${node.id} (${e.message}). Attempting local download fallback...`);
            try {
              const tempVideo = path.join(PREVIEWS_DIR, `temp_${node.id}.mp4`);
              execSync(`curl -s -L -o "${tempVideo}" "${videoUrl}"`);
              
              const durationCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempVideo}"`;
              const durationStr = execSync(durationCmd).toString().trim();
              const duration = parseFloat(durationStr) || 10;
              const midpoint = Math.floor(duration / 2);
              
              if (needsPoster) {
                execSync(`ffmpeg -y -ss ${midpoint} -i "${tempVideo}" -vframes 1 -q:v 2 "${posterPath}"`, { stdio: 'ignore' });
              }
              if (needsClip) {
                execSync(`ffmpeg -y -ss ${midpoint} -i "${tempVideo}" -t 4 -c:v libx264 -crf 24 -preset fast -vf "scale=-2:480" -an -movflags +faststart "${clipPath}"`, { stdio: 'ignore' });
              }
              
              if (fs.existsSync(tempVideo)) {
                fs.unlinkSync(tempVideo);
              }
              console.log(`[FFMPEG] Successfully processed media locally at ${midpoint}s`);
            } catch (err) {
              console.error(`[FFMPEG ERROR] Local fallback failed for ${node.id}:`, err.message);
            }
          }
        }
        
        // If file exists now (either newly generated or previously cached), use it!
        if (!image && fs.existsSync(posterPath)) {
          image = publicPosterPath;
        }
        if (fs.existsSync(clipPath)) {
          previewVideoUrl = publicClipPath;
        }
      }

      return {
        id: node.id,
        title: node.title,
        category: category, 
        description: node.properties?.portfolio_description || '',
        url: node.properties?.url || node.properties?.URL || null,
        image: image,
        images: images,
        videoUrl: videoUrl,
        previewVideoUrl: previewVideoUrl,
        tags: finalTags
      };
    }));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapped, null, 2));
    console.log(`[SYNC] Successfully wrote ${mapped.length} items to src/data/portfolio.json`);
    
  } catch (error) {
    console.error(`[SYNC ERROR] Failed to sync portfolio:`, error.message);
    process.exit(1); // Exit with error so Netlify build fails if sync fails
  }
}

syncPortfolio();
