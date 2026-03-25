# Sync-Up — 해커톤 성장 플랫폼

> 해커톤, 단순한 참여를 넘어 당신의 성장이 기록되는 곳

Next.js 14 (App Router) + Tailwind CSS + localStorage 기반 해커톤 통합 관리 플랫폼입니다.

---

## 심사용 테스트 계정

| 항목 | 값 |
|---|---|
| 이메일 | `test@syncup.com` |
| 비밀번호 | `password1234` |

> 앱 최초 실행 시 테스트 계정이 자동 생성됩니다. 별도 설정 없이 바로 로그인 가능합니다.

---

## 주요 기능

| 페이지 | 경로 | 기능 |
|---|---|---|
| 메인 | `/` | 인기 해커톤, 퀵 메뉴 |
| 해커톤 목록 | `/hackathons` | 상태·태그 필터, 검색 |
| 해커톤 상세 | `/hackathons/[slug]` | 7개 섹션, 진행 인디케이터, 결과 제출 |
| 팀 모집 | `/camp` | 팀 생성/탐색, 합류 신청/승인 |
| 글로벌 랭킹 | `/rankings` | 전 해커톤 통합 순위 |
| 프로필 | `/profile/me` | 나의 팀, 참여 이력, 경험 증명서 |
| 알림 | `/notifications` | 팀 합류 신청/결과 알림 |
| 로그인 | `/auth/login` | localStorage 기반 인증 |
| 회원가입 | `/auth/signup` | 이메일·포지션 기반 가입 |

---

## 개발 서버 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인 가능합니다.

---

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Data**: localStorage (외부 DB/API 없음)
- **배포**: Vercel
