# הגדרת Google Analytics

## הוראות הגדרה

1. **צרו חשבון Google Analytics:**
   - לכו ל-[Google Analytics](https://analytics.google.com/)
   - התחברו עם חשבון Google שלכם
   - לחצו על "Start measuring"

2. **צרו נכס חדש:**
   - בחרו שם לנכס: "אחוזת האלה - Ella Estate"
   - בחרו את המדינה: Israel
   - בחרו את המטבע: ILS (שקל ישראלי)
   - בחרו את התעשייה: Travel & Tourism

3. **הגדירו את הנתונים:**
   - בחרו "Web" כפלטפורמה
   - הזינו את כתובת האתר: `https://ellaestate.com`
   - בחרו "Enhanced measurement" (מדידה משופרת)

4. **קבלו את ה-Measurement ID:**
   - לאחר ההגדרה, תקבלו Measurement ID שנראה כך: `G-XXXXXXXXXX`
   - העתיקו את ה-ID הזה

5. **החליפו את ה-ID בקוד:**
   - פתחו את הקובץ `public/index.html`
   - מצאו את השורות:
     ```html
     <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_MEASUREMENT_ID');
     </script>
     ```
   - החליפו את `GA_MEASUREMENT_ID` ב-ID שקיבלתם (למשל: `G-XXXXXXXXXX`)

6. **בדקו שהכל עובד:**
   - שמרו את הקובץ
   - בנו את האתר מחדש: `npm run build`
   - העלו את השינויים: `git push origin gh-pages`
   - בדקו ב-Google Analytics שהנתונים מתחילים להגיע

## מה Google Analytics ימדוד

- **מבקרים ייחודיים** - כמה אנשים שונים ביקרו באתר
- **דפים נצפים** - איזה דפים הכי פופולריים
- **זמן באתר** - כמה זמן מבקרים מבלים באתר
- **מקור התנועה** - איך אנשים מגיעים לאתר (חיפוש, רשתות חברתיות, וכו')
- **מיקום גיאוגרפי** - מאיפה המבקרים
- **מכשירים** - מובייל, דסקטופ, טאבלט

## טיפים חשובים

- **המתנו 24-48 שעות** עד שהנתונים יתחילו להופיע
- **בדקו את ה-Real-time reports** כדי לראות מבקרים בזמן אמת
- **הגדירו Goals** כדי למדוד המרות (למשל: לחיצה על "צור קשר")
- **השתמשו ב-Enhanced Ecommerce** אם תרצו למדוד הזמנות

## תמיכה

אם יש בעיות, בדקו:
1. שה-ID נכון
2. שהקוד נמצא ב-`<head>` של הדף
3. שאין שגיאות JavaScript בקונסול
4. שהאתר נטען כראוי
