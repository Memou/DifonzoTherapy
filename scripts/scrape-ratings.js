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

// --- Proxy service configuration (used when SunLife blocks the request, e.g. in GitHub Actions) ---
// SCRAPE_API_KEY  : token from your proxy provider — set as a GitHub Actions secret.
// SCRAPE_PROVIDER : 'crawlbase' (default; 20k free req) | 'scrapingbee' (1k free credits) | 'scraperapi' (1k free credits)
// SCRAPE_JS       : 'true' to enable JS rendering (Crawlbase 'javascript', others 'render_js'/'render').
//                   Leave 'false' when possible — the page is server-rendered and plain requests are cheaper.
const SCRAPE_API_KEY = process.env.SCRAPE_API_KEY || '';
const SCRAPE_PROVIDER = (process.env.SCRAPE_PROVIDER || 'crawlbase').toLowerCase();
const SCRAPE_JS = (process.env.SCRAPE_JS || 'false').toLowerCase() === 'true';

// Build the proxy API URL for the chosen provider. Returns null when no key is configured.
function buildProxyUrl(targetUrl) {
  if (!SCRAPE_API_KEY) return null;
  const enc = encodeURIComponent(targetUrl);
  switch (SCRAPE_PROVIDER) {
    case 'scrapingbee':
      return `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPE_API_KEY}&url=${enc}&render_js=${SCRAPE_JS}&premium_proxy=true`;
    case 'scraperapi':
      return `https://api.scraperapi.com/?api_key=${SCRAPE_API_KEY}&url=${enc}&render=${SCRAPE_JS}&premium=true`;
    case 'crawlbase':
    default:
      return `https://api.crawlbase.com/?token=${SCRAPE_API_KEY}&url=${enc}&javascript=${SCRAPE_JS}`;
  }
}

// Simple GET that succeeds on 2xx/3xx and returns null on any failure (no throw).
async function httpGet(url) {
  try {
    return await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400
    });
  } catch (error) {
    console.log(`⚠️  Request failed for ${url.slice(0, 90)}: ${error.message}`);
    return null;
  }
}

// Fetch a single provider URL (direct first, then via proxy if configured)
// and return the ratings count (or null if not found).
async function fetchCountFromUrl(url) {
  let response = await httpGet(url); // direct — works from residential IPs, uses no proxy credits

  if (!response && SCRAPE_API_KEY) {
    const proxyUrl = buildProxyUrl(url);
    console.log(`🔁 Direct fetch blocked — retrying via ${SCRAPE_PROVIDER} proxy...`);
    response = await httpGet(proxyUrl);
  }

  if (!response) {
    return { count: null, error: 'fetch failed (direct and proxy)' };
  }

  console.log(`✅ Page fetched successfully (${response.status})`);

  const $ = cheerio.load(response.data);
  const count = extractCount($);
  if (count && !Number.isNaN(count)) {
    console.log(`✅ Found ratings count: ${count} via ${url}`);
    return { count };
  }

  console.log('⚠️  Could not extract ratings count from this URL, trying next...');
  return { count: null, error: 'no ratings count found in page' };
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
