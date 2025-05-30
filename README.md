# 🇯🇵 JapanGo - Modern Japanese Vocabulary Learning Platform

<div align="center">

![JapanGo Logo](https://img.shields.io/badge/JapanGo-🇯🇵-red?style=for-the-badge&logo=japan)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3)

**체계적인 일본어 단어 학습을 위한 현대적이고 직관적인 웹 애플리케이션**

[🚀 Demo](#) | [📚 Documentation](#features) | [🛠️ Installation](#installation) | [🎯 Features](#features)

</div>

## ✨ Features

### 🎓 학습 기능
- **주차별 체계적 학습**: 90개 단어씩 주차별로 구성된 체계적인 커리큘럼
- **다양한 학습 모드**: 암기 모드, 테스트 모드, 복습 모드
- **음성 재생 지원**: 일본어 단어의 정확한 발음 학습
- **진행률 추적**: 실시간 학습 진행률 및 성과 모니터링

### 🎯 테스트 시스템
- **다양한 문제 유형**: 한자→뜻, 뜻→한자, 읽기→뜻 문제
- **적응형 난이도**: 사용자 수준에 맞는 문제 제공
- **틀린 문제 관리**: 틀린 문제 자동 저장 및 복습 기능
- **상세한 통계**: 학습 성과 분석 및 개선점 제시

### 🎨 현대적인 UI/UX
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **부드러운 애니메이션**: 60fps 최적화된 인터랙션
- **접근성 준수**: WCAG 2.1 AA 레벨 접근성 기준 준수

## 🛠️ Technology Stack

### Frontend
- **React 18** - 최신 React 기능 활용 (Concurrent Features, Suspense)
- **TypeScript** - 타입 안전성과 개발 경험 향상
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Modern CSS** - Container Queries, CSS Nesting, Custom Properties

### Design System
- **CSS Grid & Flexbox** - 현대적인 레이아웃 시스템
- **CSS Custom Properties** - 동적 테마 시스템
- **Animation System** - GPU 가속 애니메이션
- **Performance Optimized** - Core Web Vitals 최적화

### Accessibility & Performance
- **ARIA Labels** - 스크린 리더 지원
- **Keyboard Navigation** - 키보드 전용 사용자 지원
- **Lazy Loading** - 성능 최적화
- **PWA Ready** - 프로그레시브 웹 앱 기능

## 🚀 Installation

### Prerequisites
- Node.js 18.0+ 
- npm 9.0+ or yarn 1.22+

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/japango-app.git
cd japango-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your settings
VITE_APP_TITLE=JapanGo
VITE_APP_VERSION=2.0.0
```

## 📱 Usage

### 기본 학습 플로우

1. **주차 선택**: 학습하고 싶은 주차를 선택합니다
2. **암기 모드**: 카드를 뒤집어가며 단어를 암기합니다
3. **테스트 모드**: 다양한 문제 유형으로 실력을 확인합니다
4. **복습**: 틀린 문제를 중심으로 반복 학습합니다

### 키보드 단축키

| 키 | 기능 |
|---|---|
| `←/→` | 이전/다음 단어 |
| `Space` | 카드 뒤집기 |
| `H` | 힌트 표시 |
| `A` | 자동 재생 |
| `1-4` | 테스트 답안 선택 |

## 🎨 Design System

### Color Palette
- **Primary**: Sakura Pink (#f14458) - 일본의 벚꽃을 모티브
- **Secondary**: Indigo Blue (#6366f1) - 현대적이고 차분한 느낌
- **Success**: Emerald Green (#10b981) - 성공과 성장을 의미
- **Warning**: Amber Orange (#f59e0b) - 주의와 개선점을 표시
- **Error**: Red (#ef4444) - 오류와 틀린 답안을 표시

### Typography
- **Heading**: Inter (Latin) + Noto Sans JP/KR (CJK)
- **Body**: Optimized font stack for better readability
- **Japanese**: Noto Sans JP with proper font features

### Animation Principles
- **Purpose-driven**: 모든 애니메이션은 사용자 경험 향상 목적
- **Performance-first**: 60fps 유지를 위한 GPU 가속 활용
- **Accessibility**: `prefers-reduced-motion` 지원
- **Consistency**: 통일된 이징과 지속 시간

## 📊 Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques
- Code splitting with React.lazy()
- Image optimization and lazy loading
- CSS containment for better rendering
- Service Worker for offline support

## 🔧 Configuration

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    // PWA configuration
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['./src/components']
        }
      }
    }
  }
})
```

### CSS Architecture

```
src/styles/
├── design-system.css    # Design tokens and variables
├── components.css       # Global component styles
├── modern-features.css  # Modern CSS features
└── animations.css       # Animation system
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:a11y
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing CSS architecture
- Write accessible HTML with proper ARIA labels
- Optimize for performance (Core Web Vitals)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Noto Fonts** - 구글의 다국어 폰트 지원
- **React Team** - 훌륭한 프레임워크 제공
- **Vite Team** - 빠른 개발 도구
- **MDN Web Docs** - 웹 표준 참조 자료

## 📞 Support

- 📧 Email: support@japango.app
- 💬 Discord: [JapanGo Community](https://discord.gg/japango)
- 📱 Twitter: [@JapanGoApp](https://twitter.com/japangoapp)

---

<div align="center">

**Made with ❤️ for Japanese learners**

[⭐ Star this repo](https://github.com/yourusername/japango-app) | [🐛 Report Bug](https://github.com/yourusername/japango-app/issues) | [💡 Request Feature](https://github.com/yourusername/japango-app/issues)

</div>
