# הגדרת Google Business Profile API לביקורות

## סקירה כללית
האתר כולל כעת חלק ביקורות שמציג ביקורות מ-Google Business Profile. הקומפוננט מוכן לעבוד עם ה-API האמיתי, אך כרגע מציג נתונים לדוגמה.

## הגדרת API

### 1. קבלת מפתח API מ-Google
1. עבור ל-[Google Cloud Console](https://console.cloud.google.com/)
2. צור פרויקט חדש או בחר פרויקט קיים
3. הפעל את ה-APIs הבאים:
   - Google My Business API
   - Google Places API (אלטרנטיבה פשוטה יותר)

### 2. קבלת Place ID
1. עבור ל-[Google Places API Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. חפש את "אחוזת האלה" או את הכתובת המדויקת
3. העתק את ה-Place ID

### 3. הגדרת משתני סביבה
צור קובץ `.env` בשורש הפרויקט והוסף:

```env
REACT_APP_GOOGLE_API_KEY=your_api_key_here
REACT_APP_GOOGLE_PLACE_ID=your_place_id_here
```

### 4. אפשרויות API

#### אפשרות 1: Google My Business API (מתקדם)
- דורש OAuth2 authentication
- גישה מלאה לביקורות ונתונים נוספים
- דורש הגדרה מורכבת יותר

#### אפשרות 2: Google Places API (פשוט)
- דורש רק API key
- גישה מוגבלת לביקורות (5 ביקורות אחרונות)
- קל יותר להגדרה

## שימוש בקומפוננט

הקומפוננט `Reviews` כבר מוגדר לעבוד עם שתי האפשרויות:

```typescript
// שימוש ב-Google My Business API
const reviewsData = await googleBusinessService.fetchReviews();

// או שימוש ב-Google Places API
const reviewsData = await googleBusinessService.fetchReviewsFromPlacesAPI();
```

## מבנה הקבצים

- `src/components/Reviews/Reviews.tsx` - הקומפוננט הראשי
- `src/services/googleBusinessService.ts` - שירות ה-API
- `src/context/LanguageContext.tsx` - תרגומים

## תכונות

- ✅ תמיכה דו-לשונית (עברית/אנגלית)
- ✅ עיצוב רספונסיבי
- ✅ טעינה אסינכרונית
- ✅ טיפול בשגיאות
- ✅ נתונים לדוגמה כגיבוי
- ✅ סטטיסטיקות (דירוג ממוצע, מספר ביקורות)
- ✅ עיצוב תואם לשאר האתר

## הערות חשובות

1. **אבטחה**: לעולם אל תחשוף את מפתח ה-API בצד הלקוח. השתמש ב-proxy server או הגבל את הדומיין ב-Google Cloud Console.

2. **מגבלות API**: Google Places API מוגבל ל-5 ביקורות בלבד. עבור ביקורות מלאות, השתמש ב-Google My Business API.

3. **עדכונים**: הביקורות מתעדכנות אוטומטית בכל טעינת עמוד.

4. **ביצועים**: הקומפוננט כולל lazy loading ו-memoization לביצועים מיטביים.

## פתרון בעיות

### שגיאת "API credentials not configured"
- ודא שהוספת את משתני הסביבה הנכונים
- ודא שהקובץ `.env` נמצא בשורש הפרויקט
- הפעל מחדש את שרת הפיתוח

### שגיאת "API request failed"
- ודא שמפתח ה-API תקין
- ודא שה-Place ID נכון
- בדוק את המגבלות ב-Google Cloud Console

### ביקורות לא מוצגות
- הקומפוננט יציג נתונים לדוגמה אם ה-API לא זמין
- בדוק את הקונסול לשגיאות
- ודא שהעסק קיים ב-Google Business Profile

## תמיכה

לשאלות או בעיות, פנה למפתח או בדוק את התיעוד של Google Business Profile API.
