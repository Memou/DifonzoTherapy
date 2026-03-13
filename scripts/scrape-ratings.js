const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const LUMINO_URL = 'https://luminohealth.sunlife.ca/en/health-care-provider-profile/social-worker/difonzo-psychotherapy/melissa-di-fonzo-717392-947116/';

async function scrapeRatings() {
  try {
    console.log('🔍 Fetching Lumino page...');
    
    const response = await axios.get(LUMINO_URL, {
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
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept 4xx as well to handle errors gracefully
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Check if we got blocked
    if (response.status === 403) {
      console.log('⚠️ Received 403 Forbidden - website is blocking automated requests');
      console.log('💡 This is normal - GitHub Actions may have better success with different IP');
      throw new Error('403 Forbidden');
    }
    
    if (response.status !== 200) {
      console.log(`⚠️ Received status ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }
    
    console.log('✅ Page fetched successfully!');
    
    // Try multiple selectors to find ratings
    let count = null;
    
    // Method 1: Look for "X ratings" text
    const bodyText = $('body').text();
    let match = bodyText.match(/(\d+)\s+ratings/i);
    
    if (match) {
      count = parseInt(match[1]);
      console.log(`✅ Found ratings via text match: ${count}`);
    }
    
    // Method 2: Look for rating meta tags or structured data
    if (!count) {
      const ratingElement = $('[itemprop="ratingCount"], [data-rating-count]');
      if (ratingElement.length > 0) {
        count = parseInt(ratingElement.text() || ratingElement.attr('content'));
        console.log(`✅ Found ratings via structured data: ${count}`);
      }
    }
    
    if (count && !isNaN(count)) {
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
    } else {
      console.log('⚠️ Could not find ratings count, keeping existing fallback value');
      
      // Create fallback file if it doesn't exist
      const filePath = path.join(__dirname, '../js/ratings-data.json');
      const jsDir = path.join(__dirname, '../js');
      
      if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir, { recursive: true });
      }
      
      if (!fs.existsSync(filePath)) {
        const fallbackData = {
          count: 245,
          actualCount: null,
          lastUpdated: new Date().toISOString().split('T')[0],
          lastChecked: new Date().toISOString(),
          note: "Fallback value - scraping failed"
        };
        fs.writeFileSync(filePath, JSON.stringify(fallbackData, null, 2));
        console.log('📝 Created fallback ratings file');
      }
    }
  } catch (error) {
    console.error('❌ Error scraping ratings:', error.message);
    
    // Create fallback file if it doesn't exist
    const filePath = path.join(__dirname, '../js/ratings-data.json');
    const jsDir = path.join(__dirname, '../js');
    
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      const fallbackData = {
        count: 245,
        actualCount: null,
        lastUpdated: new Date().toISOString().split('T')[0],
        lastChecked: new Date().toISOString(),
        note: "Fallback value - scraping failed"
      };
      fs.writeFileSync(filePath, JSON.stringify(fallbackData, null, 2));
      console.log('📝 Created fallback ratings file due to error');
    }
    
    process.exit(0); // Don't fail the workflow
  }
}

scrapeRatings();
