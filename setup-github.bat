@echo off
echo =================================================
echo JapanGo - GitHub Repository Setup Script
echo =================================================
echo.

REM 현재 디렉토리 확인
echo 현재 위치: %CD%
echo.

REM GitHub CLI 설치 확인
echo [1] GitHub CLI 설치 확인 중...
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI가 설치되어 있지 않습니다.
    echo.
    echo GitHub CLI 설치 방법:
    echo 1. https://cli.github.com/ 에서 다운로드 후 설치
    echo 2. 또는 winget install --id GitHub.cli
    echo.
    pause
    exit /b 1
) else (
    echo ✅ GitHub CLI가 설치되어 있습니다.
)
echo.

REM GitHub 로그인 확인
echo [2] GitHub 로그인 확인 중...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub에 로그인되어 있지 않습니다.
    echo 로그인을 진행합니다...
    gh auth login
    if %errorlevel% neq 0 (
        echo ❌ 로그인에 실패했습니다.
        pause
        exit /b 1
    )
) else (
    echo ✅ GitHub에 로그인되어 있습니다.
)
echo.

REM Git 초기화
echo [3] Git 저장소 초기화 중...
if not exist .git (
    git init
    echo ✅ Git 저장소가 초기화되었습니다.
) else (
    echo ✅ Git 저장소가 이미 존재합니다.
)
echo.

REM 파일 추가 및 커밋
echo [4] 파일 추가 및 첫 커밋...
git add .
git commit -m "Initial commit: JapanGo - 일본어 단어 학습 앱"
echo ✅ 첫 커밋이 완료되었습니다.
echo.

REM GitHub 레포지토리 생성
echo [5] GitHub 레포지토리 생성 중...
set REPO_NAME=japango-vocabulary-app
set REPO_DESC=🇯🇵 일본어 단어 암기 및 테스트 애플리케이션 - Japanese Vocabulary Learning App built with React + TypeScript

gh repo create %REPO_NAME% --description "%REPO_DESC%" --public --source=. --remote=origin --push

if %errorlevel% equ 0 (
    echo ✅ GitHub 레포지토리가 성공적으로 생성되었습니다!
    echo.
    echo 📋 레포지토리 정보:
    gh repo view --web
) else (
    echo ❌ 레포지토리 생성에 실패했습니다.
    echo 수동으로 생성하려면 다음 명령어를 사용하세요:
    echo gh repo create %REPO_NAME% --description "%REPO_DESC%" --public
    pause
    exit /b 1
)

echo.
echo =================================================
echo ✅ 모든 설정이 완료되었습니다!
echo.
echo 🌐 레포지토리 URL: https://github.com/$(gh api user --jq .login)/%REPO_NAME%
echo 📱 GitHub Pages 배포는 몇 분 후 활성화됩니다.
echo =================================================
echo.
pause