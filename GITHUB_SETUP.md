# 🚀 GitHub 레포지토리 자동 생성 가이드

## 📋 준비사항

### 1. GitHub CLI 설치
다음 중 하나의 방법으로 설치하세요:

**방법 1: 공식 다운로드**
- https://cli.github.com/ 에서 다운로드 후 설치

**방법 2: winget 사용**
```bash
winget install --id GitHub.cli
```

**방법 3: Chocolatey 사용**
```bash
choco install gh
```

### 2. GitHub 계정 준비
- GitHub.com에 계정이 있어야 합니다

## 🎯 실행 방법

### Option 1: 배치 파일 실행 (추천)
```bash
# JapanGo12 폴더에서
setup-github.bat
```

### Option 2: PowerShell 스크립트 실행
```powershell
# PowerShell에서
.\setup-github.ps1
```

### Option 3: 수동 명령어 실행
```bash
# 1. JapanGo12 폴더로 이동
cd "C:\Users\park0\OneDrive\바탕 화면\JapanGo12"

# 2. GitHub CLI 로그인 (최초 1회만)
gh auth login

# 3. Git 초기화
git init
git add .
git commit -m "Initial commit: JapanGo - 일본어 단어 학습 앱"

# 4. GitHub 레포지토리 생성 및 업로드
gh repo create japango-vocabulary-app --description "🇯🇵 일본어 단어 암기 및 테스트 애플리케이션" --public --source=. --remote=origin --push
```

## ✅ 완료 후 확인사항

1. **레포지토리 생성 확인**
   - https://github.com/YOUR_USERNAME/japango-vocabulary-app

2. **GitHub Pages 배포** (자동, 몇 분 소요)
   - https://YOUR_USERNAME.github.io/japango-vocabulary-app/

3. **로컬 개발 서버 실행**
   ```bash
   npm install
   npm run dev
   ```

## 🔧 문제 해결

### GitHub CLI 로그인 문제
```bash
# 기존 인증 정보 삭제 후 재로그인
gh auth logout
gh auth login
```

### 레포지토리 이름 중복 오류
스크립트에서 다른 이름을 사용하거나:
```bash
gh repo create japanese-word-study --description "일본어 단어 학습 앱" --public --source=. --remote=origin --push
```

### 권한 오류 (PowerShell)
```powershell
# PowerShell 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📱 향후 업데이트 방법

```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "feat: 새로운 기능 추가"
git push
```

자동으로 GitHub Pages에 배포됩니다!