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
1. **Daily Automation**: GitHub Actions runs every day at 2 AM UTC
2. **Scraping**: Fetches the Lumino Health page and extracts the ratings count
3. **Rounding**: Rounds the count down to the nearest 5 (246 → 245+, 251 → 250+)
4. **Auto-Update**: Commits the updated JSON file to the repository
5. **Display**: Your website reads from the JSON file and displays the count
6. **Fallback**: If scraping fails, it shows "245+" as a safe fallback

## 🚀 How to Use

### Manual Trigger (Test It Now!)
1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. Select **"Update Ratings Count"** workflow
4. Click **"Run workflow"** button
5. Wait 30-60 seconds and check the results

### Automatic Updates
- Runs daily at 2 AM UTC automatically
- No action required from you
- Check the Actions tab to see the history

## 📊 Current Ratings Display
The ratings now show dynamically on your homepage:
- **Before**: "⭐⭐⭐⭐⭐ 240+ 5-star reviews"
- **After**: "⭐⭐⭐⭐⭐ [dynamic count]+ 5-star reviews"

## 🔧 Troubleshooting

### If ratings don't update:
1. Check GitHub Actions tab for errors
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
