# מדריך הגדרת Google Places API לביקורות

## שלב 1: קבלת מפתח API

### 1.1 יצירת פרויקט ב-Google Cloud Console
1. עבור ל-[Google Cloud Console](https://console.cloud.google.com/)
2. התחבר עם חשבון Google שלך
3. לחץ על "New Project" או בחר פרויקט קיים
4. תן שם לפרויקט (למשל: "Ella Estate Website")

### 1.2 הפעלת Google Places API
1. בחר את הפרויקט שיצרת
2. עבור ל-"APIs & Services" > "Library"
3. חפש "Places API"
4. לחץ על "Places API" ובחר "Enable"

### 1.3 יצירת מפתח API
1. עבור ל-"APIs & Services" > "Credentials"
2. לחץ על "Create Credentials" > "API Key"
3. העתק את מפתח ה-API שנוצר
4. **חשוב**: הגבל את המפתח לדומיין שלך:
   - לחץ על המפתח שיצרת
   - ב-"Application restrictions" בחר "HTTP referrers"
   - הוסף את הדומיין שלך (למשל: `ellaestate.com/*`)

## שלב 2: קבלת Place ID

### 2.1 מציאת Place ID של העסק
1. עבור ל-[Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. חפש "אחוזת האלה" או את הכתובת המדויקת
3. העתק את ה-Place ID (נראה כמו: `ChIJN1t_tDeuEmsRUsoyG83frY4`)

### 2.2 בדיקה שהעסק קיים ב-Google Business Profile
1. ודא שהעסק רשום ב-[Google Business Profile](https://business.google.com/)
2. ודא שיש לו ביקורות
3. ודא שהעסק מאומת

## שלב 3: הגדרת משתני הסביבה

### 3.1 יצירת קובץ .env
צור קובץ `.env` בשורש הפרויקט עם התוכן הבא:

```env
# Google Places API Configuration
REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_GOOGLE_PLACE_ID=YOUR_PLACE_ID_HERE
```

### 3.2 החלפת הערכים
- החלף `YOUR_API_KEY_HERE` במפתח ה-API שקיבלת
- החלף `YOUR_PLACE_ID_HERE` ב-Place ID של העסק

### 3.3 דוגמה:
```env
REACT_APP_GOOGLE_API_KEY=AIzaSyBvOkBw3cUzF2dX9eY8hI7jK6lM5nP4qR3s
REACT_APP_GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4
```

## שלב 4: הפעלה מחדש

### 4.1 הפעלה מחדש של שרת הפיתוח
```bash
npm start
```

### 4.2 בדיקה שהכל עובד
1. פתח את הקונסול בדפדפן (F12)
2. בדוק שאין שגיאות
3. ודא שהביקורות נטענות

## שלב 5: בדיקות ופתרון בעיות

### 5.1 שגיאות נפוצות

#### "API key not valid"
- ודא שמפתח ה-API תקין
- ודא שה-API מופעל בפרויקט
- ודא שהמגבלות מוגדרות נכון

#### "Place not found"
- ודא שה-Place ID נכון
- ודא שהעסק קיים ב-Google Business Profile

#### "Quota exceeded"
- בדוק את המגבלות ב-Google Cloud Console
- שקול לשדרג את התוכנית

### 5.2 בדיקת ביצועים
- Google Places API מוגבל ל-5 ביקורות בלבד
- אם יש יותר ביקורות, רק 5 האחרונות יוצגו
- הביקורות מתעדכנות אוטומטית

## שלב 6: אבטחה

### 6.1 הגבלת מפתח ה-API
- הגבל לדומיין שלך בלבד
- אל תחשוף את המפתח בקוד הצד הלקוח
- שקול שימוש ב-proxy server

### 6.2 ניטור שימוש
- עקוב אחר השימוש ב-Google Cloud Console
- הגדר התראות על חריגה ממגבלות

## הערות חשובות

1. **מגבלות**: Google Places API מוגבל ל-5 ביקורות בלבד
2. **עלות**: יש מגבלות יומיות חינמיות, אחר כך יש תשלום
3. **עדכונים**: הביקורות מתעדכנות אוטומטית
4. **גיבוי**: הקוד כולל נתונים לדוגמה כגיבוי

## תמיכה

אם יש בעיות:
1. בדוק את הקונסול בדפדפן
2. בדוק את Google Cloud Console
3. עיין בתיעוד של Google Places API
