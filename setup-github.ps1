# JapanGo - GitHub Repository Setup Script
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "JapanGo - GitHub Repository Setup Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# 현재 디렉토리 확인
Write-Host "현재 위치: $PWD" -ForegroundColor Yellow
Write-Host ""

# GitHub CLI 설치 확인
Write-Host "[1] GitHub CLI 설치 확인 중..." -ForegroundColor Blue
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI가 설치되어 있습니다." -ForegroundColor Green
    Write-Host $ghVersion -ForegroundColor Gray
} catch {
    Write-Host "❌ GitHub CLI가 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host ""
    Write-Host "GitHub CLI 설치 방법:" -ForegroundColor Yellow
    Write-Host "1. https://cli.github.com/ 에서 다운로드 후 설치"
    Write-Host "2. 또는 winget install --id GitHub.cli"
    Write-Host "3. 또는 PowerShell에서: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); choco install gh"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# GitHub 로그인 확인
Write-Host "[2] GitHub 로그인 확인 중..." -ForegroundColor Blue
try {
    gh auth status | Out-Null
    Write-Host "✅ GitHub에 로그인되어 있습니다." -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub에 로그인되어 있지 않습니다." -ForegroundColor Red
    Write-Host "로그인을 진행합니다..." -ForegroundColor Yellow
    gh auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 로그인에 실패했습니다." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host ""

# Git 초기화
Write-Host "[3] Git 저장소 초기화 중..." -ForegroundColor Blue
if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Git 저장소가 초기화되었습니다." -ForegroundColor Green
} else {
    Write-Host "✅ Git 저장소가 이미 존재합니다." -ForegroundColor Green
}
Write-Host ""

# 파일 추가 및 커밋
Write-Host "[4] 파일 추가 및 첫 커밋..." -ForegroundColor Blue
git add .
git commit -m "Initial commit: JapanGo - 일본어 단어 학습 앱"
Write-Host "✅ 첫 커밋이 완료되었습니다." -ForegroundColor Green
Write-Host ""

# GitHub 레포지토리 생성
Write-Host "[5] GitHub 레포지토리 생성 중..." -ForegroundColor Blue
$repoName = "japango-vocabulary-app"
$repoDesc = "🇯🇵 일본어 단어 암기 및 테스트 애플리케이션 - Japanese Vocabulary Learning App built with React + TypeScript"

gh repo create $repoName --description $repoDesc --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitHub 레포지토리가 성공적으로 생성되었습니다!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 레포지토리 정보:" -ForegroundColor Cyan
    
    # 사용자 이름 가져오기
    $username = gh api user --jq .login
    $repoUrl = "https://github.com/$username/$repoName"
    
    Write-Host "🌐 레포지토리 URL: $repoUrl" -ForegroundColor Yellow
    Write-Host "📱 GitHub Pages URL: https://$username.github.io/$repoName/" -ForegroundColor Yellow
    
    # 브라우저에서 열기
    Write-Host ""
    $openBrowser = Read-Host "브라우저에서 레포지토리를 열까요? (y/n)"
    if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
        Start-Process $repoUrl
    }
} else {
    Write-Host "❌ 레포지토리 생성에 실패했습니다." -ForegroundColor Red
    Write-Host "수동으로 생성하려면 다음 명령어를 사용하세요:" -ForegroundColor Yellow
    Write-Host "gh repo create $repoName --description `"$repoDesc`" --public" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✅ 모든 설정이 완료되었습니다!" -ForegroundColor Green
Write-Host "📱 GitHub Pages 배포는 몇 분 후 활성화됩니다." -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"