# מדריך פריסה - אחוזת האלה

## 🚀 דפלוי מהיר (מומלץ)

### שימוש בסקריפטים אוטומטיים

#### Windows Batch (deploy.bat)
```bash
# הרץ את הסקריפט
deploy.bat

# או דרך npm
npm run deploy-full
```

#### PowerShell (deploy.ps1)
```bash
# הרץ את הסקריפט
powershell -ExecutionPolicy Bypass -File deploy.ps1

# או דרך npm
npm run deploy-ps
```

### מה הסקריפט עושה:
1. **עובר ל-master branch** - מוודא שאתה ב-branch הנכון
2. **דוחף שינויים** - מעדכן את master ב-GitHub
3. **עובר ל-gh-pages** - ה-branch המיועד לדפלוי
4. **מזג את master** - מעדכן את gh-pages עם השינויים
5. **בונה את האתר** - `npm run build` עם כל השיפורים
6. **מדפלוי** - מעתיק קבצים ודוחף ל-GitHub Pages

---

## 🚀 אפשרויות פריסה נוספות

### 1. Netlify (מומלץ)

#### פריסה אוטומטית מ-GitHub
1. התחבר ל-[Netlify](https://netlify.com)
2. לחץ על "New site from Git"
3. בחר את ה-repository שלך
4. הגדרות:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Node version:** 18

#### פריסה ידנית
```bash
# התקן Netlify CLI
npm install -g netlify-cli

# התחבר לחשבון
netlify login

# פריסה ראשונית
netlify deploy --dir=build

# פריסה ל-production
netlify deploy --prod --dir=build
```

### 2. Vercel

#### פריסה אוטומטית
1. התחבר ל-[Vercel](https://vercel.com)
2. ייבא את ה-repository
3. Vercel יזהה אוטומטית את ההגדרות

#### פריסה ידנית
```bash
# התקן Vercel CLI
npm install -g vercel

# פריסה
vercel --prod
```

### 3. GitHub Pages

```bash
# התקן gh-pages
npm install --save-dev gh-pages

# הוסף package.json:
"homepage": "https://username.github.io/repository-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# פריסה
npm run deploy
```

## 🔧 הגדרות Domain

### Netlify
1. עבור ל-Domain settings
2. הוסף custom domain
3. עדכן DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### Vercel
1. עבור ל-Domains
2. הוסף domain
3. עדכן DNS records לפי ההנחיות

## 📊 בדיקות אחרי פריסה

### 1. בדיקת ביצועים
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 2. בדיקת SEO
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Schema Markup Validator](https://validator.schema.org/)

### 3. בדיקת נגישות
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## 🔒 אבטחה

### HTTPS
- Netlify ו-Vercel מספקים HTTPS אוטומטי
- וודא שה-certificate פעיל

### Headers
הקבצים `netlify.toml` ו-`vercel.json` כוללים headers אבטחה:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options

## 📈 ניטור

### Analytics
הוסף Google Analytics:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking
הוסף Sentry:
```bash
npm install @sentry/react @sentry/tracing
```

## 🔄 עדכונים

### אוטומטי
- Netlify/Vercel יעדכנו אוטומטית מ-GitHub
- כל push ל-main branch יפרוס גרסה חדשה

### ידני
```bash
# עדכן קוד
git add .
git commit -m "Update"
git push

# או פריסה ישירה
npm run build
netlify deploy --prod --dir=build
```

## 🆘 פתרון בעיות

### שגיאות בנייה
```bash
# נקה cache
npm run build -- --reset-cache

# או
rm -rf node_modules package-lock.json
npm install
npm run build
```

### בעיות DNS
- בדוק שהרשומות נכונות
- המתן עד 48 שעות לפריסה מלאה
- השתמש ב-DNS checker

### בעיות ביצועים
- דחוס תמונות
- השתמש ב-WebP format
- הפעל CDN
- בדוק bundle size

## 📞 תמיכה

לבעיות טכניות:
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
