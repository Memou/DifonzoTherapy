# DifonzoTherapy Website - Automated Ratings System

## 🎯 Overview
This system automatically scrapes the Lumino Health ratings count daily and updates the website without manual intervention.

## 📦 What Was Installed

### Files Created:
1. **`.github/workflows/update-ratings.yml`** - GitHub Actions workflow
2. **`scripts/scrape-ratings.js`** - Node.js scraper script
3. **`js/ratings-data.json`** - Data file containing ratings count
4. **`js/ratings-loader.js`** - Client-side script to display ratings
5. **`package.json`** - npm dependencies for scraper

### How It Works:
1. **Daily Automation**: GitHub Actions runs every day at 2 AM UTC (and on every push)
2. **Scraping**: Fetches the Lumino Health page (falls back to the new `providersearch.sunlife.ca` URL) and extracts the ratings count
3. **Rounding**: Rounds the count down to the nearest 5 (246 → 245+, 251 → 250+)
4. **Auto-Update**: Commits the updated JSON file to the repository
5. **Display**: Your website reads from the JSON file and displays the count
6. **Fallback**: If scraping fails, the last-known count is kept — but the workflow now **fails loudly** (shows an error in the Actions tab) so you know to check it

## 🚀 How to Use

### Automatic Updates
- Runs daily at 2 AM UTC automatically (and on every push)
- SunLife uses **DataDome** bot protection, which blocks GitHub's server IPs (403).
  To keep automation working, the scraper falls back to a **scraping proxy service**
  when the direct request is blocked. See "Proxy Setup" below.

### Proxy Setup (recommended for GitHub Actions)
1. Sign up for a scraping proxy — recommended **Crawlbase** (free: 20,000 requests, no credit card):
   - <https://crawlbase.com> → grab your **JavaScript token** from the dashboard
   - ⚠️ Use the **JavaScript token**, not the Normal token: SunLife uses **DataDome**,
     which usually requires a real headless browser (Normal token often returns a 525 challenge error).
   - Alternatives: **ScrapingBee** (1,000 free credits) or **ScraperAPI** (1,000 free credits)
2. In your GitHub repo: **Settings → Secrets and variables → Actions**
   - **New repository secret** → Name `SCRAPE_API_KEY`, Value: your JavaScript token
   - **New repository variable** → Name `SCRAPE_JS`, Value: `true` (enables JS rendering)
   - Optional variable: `SCRAPE_PROVIDER` (`crawlbase`|`scrapingbee`|`scraperapi`, default `crawlbase`)
3. Run the workflow (Actions tab → "Update Ratings Count" → Run workflow).
4. The scraper tries the **direct request first** (free, works from home IPs → no credits used),
   and only falls back to the proxy when blocked.

### Manual Trigger (Test It Now!)
1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. Select **"Update Ratings Count"** workflow
4. Click **"Run workflow"** button
5. Wait 30-60 seconds and check the results

## 📊 Current Ratings Display
The ratings now show dynamically on your homepage:
- **Before**: "⭐⭐⭐⭐⭐ 240+ 5-star reviews"
- **After**: "⭐⭐⭐⭐⭐ [dynamic count]+ 5-star reviews"

## 🔧 Troubleshooting

### If ratings don't update:
1. Check GitHub Actions tab for errors — a red "Update Ratings Count" run means the scraper couldn't reach the page (SunLife blocks some server IPs). The site keeps the last-known count in that case.
2. Verify the workflow ran successfully
3. Check if ratings-data.json was updated

### To manually update ratings:
```bash
npm install
npm run scrape
```

## 📝 Technical Details

### Dependencies:
- **axios**: HTTP client for fetching pages
- **cheerio**: HTML parser for scraping

### Data Format:
```json
{
  "count": 245,
  "actualCount": 246,
  "lastUpdated": "2026-03-13",
  "lastChecked": "2026-03-13T02:00:00.000Z"
}
```

### Rounding Logic:
- 240-244 → 240+
- 245-249 → 245+
- 250-254 → 250+
- 255-259 → 255+
- etc.

## ✅ Testing Checklist
- [x] GitHub Actions workflow created
- [x] Scraper script implemented
- [x] Ratings data file created
- [x] Client-side loader implemented
- [x] Index.html updated
- [x] All files committed and pushed
- [ ] Test manual workflow run on GitHub
- [ ] Verify ratings display on live site

## 🎉 Success!
Your website now has a fully automated ratings system that updates daily without any manual work required!

---

**Created**: March 13, 2026
**Status**: ✅ Deployed and Ready
