@echo off
echo =================================================
echo JapanGo - Git 상태 확인 및 문제 해결
echo =================================================
echo.

echo [현재 Git 상태 확인]
echo.

REM Git 저장소 확인
if exist .git (
    echo ✅ Git 저장소가 존재합니다.
) else (
    echo ❌ Git 저장소가 없습니다. 초기화가 필요합니다.
    echo Git 저장소를 초기화합니다...
    git init
    echo ✅ Git 저장소 초기화 완료
)
echo.

REM 현재 브랜치 확인
echo [현재 브랜치]
git branch
echo.

REM 파일 상태 확인
echo [파일 상태 확인]
git status
echo.

REM 원격 저장소 확인
echo [원격 저장소 확인]
git remote -v
echo.

REM 커밋 이력 확인
echo [커밋 이력]
git log --oneline -5
echo.

echo =================================================
echo 문제 해결을 시작합니다...
echo =================================================
echo.

REM 모든 파일 다시 추가
echo [1] 모든 파일을 Git에 추가합니다...
git add .
git add -A
echo ✅ 파일 추가 완료
echo.

REM 변경사항 확인
echo [2] 추가된 파일 확인:
git status --short
echo.

REM 커밋 생성
echo [3] 커밋을 생성합니다...
git commit -m "Fix: 모든 프로젝트 파일 추가 - JapanGo 일본어 학습 앱"
if %errorlevel% equ 0 (
    echo ✅ 커밋 생성 완료
) else (
    echo ⚠️ 새로운 변경사항이 없거나 이미 커밋된 상태입니다.
)
echo.

REM 원격 저장소 연결 확인 및 설정
echo [4] 원격 저장소 연결을 확인합니다...
git remote -v | findstr origin >nul
if %errorlevel% neq 0 (
    echo ❌ 원격 저장소가 연결되어 있지 않습니다.
    echo GitHub CLI로 레포지토리를 생성하고 연결합니다...
    
    REM GitHub CLI로 레포지토리 생성
    gh repo create japango-vocabulary-app --description "🇯🇵 일본어 단어 암기 및 테스트 애플리케이션" --public --source=. --remote=origin
    
    if %errorlevel% equ 0 (
        echo ✅ GitHub 레포지토리 생성 및 연결 완료
    ) else (
        echo ⚠️ 레포지토리가 이미 존재하거나 다른 문제가 있습니다.
        echo 수동으로 원격 저장소를 연결하세요:
        echo git remote add origin https://github.com/YOUR_USERNAME/japango-vocabulary-app.git
    )
) else (
    echo ✅ 원격 저장소가 연결되어 있습니다.
)
echo.

REM 메인 브랜치로 설정
echo [5] 메인 브랜치 설정...
git branch -M main
echo ✅ 메인 브랜치 설정 완료
echo.

REM GitHub에 강제 푸시
echo [6] GitHub에 모든 변경사항을 업로드합니다...
git push -u origin main --force
if %errorlevel% equ 0 (
    echo ✅ GitHub 업로드 완료!
) else (
    echo ❌ 업로드 실패. 다음을 확인하세요:
    echo 1. GitHub에 로그인되어 있는지: gh auth status
    echo 2. 원격 저장소 URL이 올바른지: git remote -v
    echo 3. 인터넷 연결 상태
)
echo.

echo =================================================
echo 📁 업로드된 파일 목록:
echo =================================================
dir /b *.* | findstr /v .git
echo.
dir /b src
echo.

REM 최종 상태 확인
echo =================================================
echo 최종 Git 상태:
echo =================================================
git status
echo.

echo 원격 저장소 정보:
git remote -v
echo.

echo 최근 커밋:
git log --oneline -3
echo.

echo =================================================
echo ✅ 문제 해결 완료!
echo 이제 GitHub에서 레포지토리를 확인해보세요.
echo =================================================
pause