הנחיות דפלוי ידני ל-GitHub Pages
שלב 1: הכנה
# וודא שאתה בענף master
git checkout master

# בנה את הפרויקט
npm run build


שלב 2: מחיקת ענף gh-pages הישן
# מחק את הענף הישן
git push origin --delete gh-pages


שלב 3: יצירת ענף gh-pages חדש
# צור ענף חדש
git checkout --orphan gh-pages

# מחק את כל הקבצים (חוץ מ-.git)
git rm -rf .


שלב 4: העתקת קבצי build
# העתק את תוכן build לתיקייה הראשית
xcopy build\* . /E /H /Y

# מחק את תיקיית build
rmdir /S /Q build


שלב 5: קומיט ופוש
# הוסף הכל
git add .

# קומיט
git commit -m "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# דחוף לגיטהאב
git push origin gh-pages

# חזור לענף master
git checkout master
