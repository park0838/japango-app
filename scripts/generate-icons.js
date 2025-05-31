// 간단한 아이콘 생성 스크립트
const fs = require('fs');
const path = require('path');

// SVG 아이콘 템플릿
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#f14458" rx="64"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="240" font-weight="bold" text-anchor="middle" fill="white">日</text>
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="white">JapanGo</text>
</svg>`;

// 아이콘 디렉토리 생성
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG 파일 저장
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), iconSvg);

// 임시 PNG 생성 (실제로는 sharp 등의 라이브러리 필요)
console.log('✅ SVG 아이콘이 생성되었습니다.');
console.log('⚠️  PNG 아이콘은 별도의 이미지 변환 도구가 필요합니다.');
