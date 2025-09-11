# דפלוי אחוזת האלה ל-GitHub Pages
Write-Host "========================================" -ForegroundColor Green
Write-Host "   דפלוי אחוזת האלה ל-GitHub Pages" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

try {
    # [1/6] עובר ל-master branch
    Write-Host "[1/6] עובר ל-master branch..." -ForegroundColor Yellow
    git checkout master
    if ($LASTEXITCODE -ne 0) { throw "לא ניתן לעבור ל-master branch" }

    # [2/6] דוחף שינויים ל-master
    Write-Host "[2/6] דוחף שינויים ל-master..." -ForegroundColor Yellow
    git push origin master
    if ($LASTEXITCODE -ne 0) { throw "לא ניתן לדחוף ל-master" }

    # [3/6] עובר ל-gh-pages branch
    Write-Host "[3/6] עובר ל-gh-pages branch..." -ForegroundColor Yellow
    git checkout gh-pages
    if ($LASTEXITCODE -ne 0) { throw "לא ניתן לעבור ל-gh-pages branch" }

    # [4/6] מוזג את master ל-gh-pages
    Write-Host "[4/6] מוזג את master ל-gh-pages..." -ForegroundColor Yellow
    git merge master
    if ($LASTEXITCODE -ne 0) { throw "לא ניתן למזג את master" }

    # [5/6] בונה את האתר
    Write-Host "[5/6] בונה את האתר..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "הבנייה נכשלה" }

    # [6/6] מעתיק קבצים ומדפלוי
    Write-Host "[6/6] מעתיק קבצים ומדפלוי..." -ForegroundColor Yellow
    Copy-Item -Path "build\*" -Destination "." -Recurse -Force
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Deploy latest version - $timestamp"
    git push origin gh-pages

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   הדפלוי הושלם בהצלחה!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "האתר זמין ב: https://danm1980.github.io/ahuzat-haela/" -ForegroundColor Cyan
    Write-Host ""

    # חוזר ל-master branch
    Write-Host "חוזר ל-master branch..." -ForegroundColor Yellow
    git checkout master

} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   שגיאה בדפלוי: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "חוזר ל-master branch..." -ForegroundColor Yellow
    git checkout master
    exit 1
}

Write-Host ""
Write-Host "לחץ על Enter כדי לסגור..."
Read-Host
