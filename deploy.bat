@echo off
echo ========================================
echo    דפלוי אחוזת האלה ל-GitHub Pages
echo ========================================
echo.

echo [1/6] עובר ל-master branch...
git checkout master
if %errorlevel% neq 0 (
    echo שגיאה: לא ניתן לעבור ל-master branch
    pause
    exit /b 1
)

echo [2/6] דוחף שינויים ל-master...
git push origin master
if %errorlevel% neq 0 (
    echo שגיאה: לא ניתן לדחוף ל-master
    pause
    exit /b 1
)

echo [3/6] עובר ל-gh-pages branch...
git checkout gh-pages
if %errorlevel% neq 0 (
    echo שגיאה: לא ניתן לעבור ל-gh-pages branch
    pause
    exit /b 1
)

echo [4/6] מוזג את master ל-gh-pages...
git merge master
if %errorlevel% neq 0 (
    echo שגיאה: לא ניתן למזג את master
    pause
    exit /b 1
)

echo [5/6] בונה את האתר...
npm run build
if %errorlevel% neq 0 (
    echo שגיאה: הבנייה נכשלה
    pause
    exit /b 1
)

echo [6/6] מעתיק קבצים ומדפלוי...
xcopy build\* . /E /H /Y /Q
git add .
git commit -m "Deploy latest version - %date% %time%"
git push origin gh-pages

echo.
echo ========================================
echo    הדפלוי הושלם בהצלחה!
echo ========================================
echo האתר זמין ב: https://danm1980.github.io/ahuzat-haela/
echo.

echo חוזר ל-master branch...
git checkout master

echo.
echo לחץ על כל מקש כדי לסגור...
pause >nul
