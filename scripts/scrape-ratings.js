const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('node:fs');
const path = require('node:path');

// SunLife migrated their provider pages to providersearch.sunlife.ca — try both URLs
// (the old URL redirects, but GitHub's datacenter IP may get a different result).
const LUMINO_URLS = [
  'https://luminohealth.sunlife.ca/en/health-care-provider-profile/social-worker/difonzo-psychotherapy/melissa-di-fonzo-717392-947116/',
  'https://providersearch.sunlife.ca/en/health-care-provider-profile/social-worker/difonzo-psychotherapy/melissa-di-fonzo-717392-947116/'
];

// Extract the ratings count from a parsed page using several strategies.
function extractCount($) {
  const bodyText = $('body').text();

  // Method 1: "X ratings" text
  let match = bodyText.match(/(\d+)\sratings/i);
  if (match) return Number.parseInt(match[1], 10);

  // Method 2: "X reviews" text
  match = bodyText.match(/(\d+)\sreviews/i);
  if (match) return Number.parseInt(match[1], 10);

  // Method 3: structured data / meta tags
  const ratingElement = $('[itemprop="ratingCount"], [data-rating-count], meta[itemprop="ratingCount"]');
  if (ratingElement.length > 0) {
    const val = Number.parseInt(ratingElement.first().attr('content') || ratingElement.first().text(), 10);
    if (!Number.isNaN(val)) return val;
  }

  // Method 4: JSON-LD structured data (aggregateRating.ratingCount)
  const jsonLdScripts = $('script[type="application/ld+json"]').map((i, el) => $(el).html()).get();
  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse(script);
      const found = (function walk(obj) {
        if (!obj || typeof obj !== 'object') return null;
        if (obj.ratingCount !== undefined && !Number.isNaN(Number.parseInt(obj.ratingCount, 10))) {
          return Number.parseInt(obj.ratingCount, 10);
        }
        for (const key of Object.keys(obj)) {
          const result = walk(obj[key]);
          if (result) return result;
        }
        return null;
      })(parsed);
      if (found) return found;
    } catch (e) {
      // Ignore invalid/empty JSON-LD blocks — they are optional on this page.
      console.debug('Skipping unparseable JSON-LD block:', e?.message);
    }
  }

  return null;
}

// Fetch a single provider URL and return the ratings count (or null if not found).
async function fetchCountFromUrl(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    },
    timeout: 15000,
    maxRedirects: 5,
    validateStatus: function (status) {
      return status >= 200 && status < 500; // Accept 4xx as well to handle errors gracefully
    }
  });

  if (response.status === 403) {
    console.log('⚠️ Received 403 Forbidden - website is blocking automated requests');
    return { count: null, error: '403 Forbidden' };
  }
  if (response.status !== 200) {
    console.log(`⚠️ Received status ${response.status} from ${url}`);
    return { count: null, error: `HTTP ${response.status}` };
  }

  console.log(`✅ Page fetched successfully (${response.status})`);

  const $ = cheerio.load(response.data);
  const count = extractCount($);
  if (count && !Number.isNaN(count)) {
    console.log(`✅ Found ratings count: ${count} via ${url}`);
    return { count };
  }

  console.log('⚠️ Could not extract ratings count from this URL, trying next...');
  return { count: null };
}

async function scrapeRatings() {
  try {
    console.log('🔍 Fetching Lumino page...');
    
    let count = null;
    let lastError = null;

    for (const url of LUMINO_URLS) {
      console.log(`🔍 Fetching ${url}...`);
      try {
        const result = await fetchCountFromUrl(url);
        if (result.count) {
          count = result.count;
          break;
        }
        if (result.error) lastError = result.error;
      } catch (error) {
        lastError = error.message;
        console.log(`⚠️ Error fetching ${url}: ${error.message}`);
      }
    }

    if (count && !Number.isNaN(count)) {
      const roundedCount = Math.floor(count / 5) * 5;

      const data = {
        count: roundedCount,
        actualCount: count,
        lastUpdated: new Date().toISOString().split('T')[0],
        lastChecked: new Date().toISOString()
      };

      const filePath = path.join(__dirname, '../js/ratings-data.json');

      // Ensure js directory exists
      const jsDir = path.join(__dirname, '../js');
      if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log(`✅ Successfully updated ratings: ${count} → ${roundedCount}+`);
      console.log(`📝 Data saved to: ${filePath}`);
      return; // Success — exit normally
    }

    // Failed to extract a count: keep the last-known data file (so the site
    // never loses its number), but FAIL LOUDLY so GitHub Actions shows an error.
    console.error('❌ Could not extract ratings count from any URL — keeping existing data file unchanged.');
    if (lastError) console.error(`   Last error: ${lastError}`);
    process.exit(1);
  } catch (error) {
    console.error('❌ Error scraping ratings:', error.message);
    process.exit(1); // Fail loudly so GitHub Actions shows the error
  }
}

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err?.message);
  process.exit(1); // Fail loudly so GitHub Actions shows the error
});

scrapeRatings().catch((err) => {
  console.error('❌ Fatal error:', err?.message);
  process.exit(1); // Fail loudly so GitHub Actions shows the error
});
