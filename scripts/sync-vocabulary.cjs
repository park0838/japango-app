#!/usr/bin/env node

/**
 * vocabulary 데이터 동기화 스크립트
 * src/vocabulary의 파일들을 public/vocabulary로 복사합니다.
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/vocabulary');
const publicDir = path.join(__dirname, '../public/vocabulary');

// public/vocabulary 디렉토리가 없으면 생성
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// src/vocabulary의 모든 .json 파일을 public/vocabulary로 복사
try {
  const files = fs.readdirSync(srcDir);
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(publicDir, file);
      
      fs.copyFileSync(srcFile, destFile);
      console.log(`✅ Copied ${file}`);
    }
  });
  
  console.log('\n🎉 Vocabulary 데이터 동기화 완료!');
  
} catch (error) {
  console.error('❌ 동기화 중 오류 발생:', error);
  process.exit(1);
}
