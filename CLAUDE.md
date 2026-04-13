@AGENTS.md

# 길울림 (Street Resonance) — PWA MVP

## 프로젝트 정체성

직장인 보컬 소모임 '길울림'의 PWA 앱. 퇴근 후 부담 없이 합주하고 버스킹을 만들어가는 모임을 위한 플랫폼.

**톤앤매너:** 따뜻하고 부담 없으며 직장인들을 위로하는 친절한 말투. 모든 안내 문구에 일관되게 적용.

## 핵심 비즈니스 룰

| 규칙 | 값 |
|---|---|
| 타겟 장르 | 대중가요, 인디, 어쿠스틱 (기본 추천 태그) |
| 정기 모임 참가비 (`is_large_event: false`) | **9,000 크레딧** (하드코딩 기본값) |
| 대형 이벤트 참가비 (`is_large_event: true`) | 0 또는 관리자 수동 입력 |
| 포인트 레슨 | 보컬 초보 대상, `[포인트 레슨 가능]` / `[레슨 요청]` 뱃지 UI 필수 |

## 테크 스택

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **PWA:** Next.js 16 네이티브 방식 (`app/manifest.ts` + `public/sw.js`)
  - `next-pwa` 플러그인 **사용 금지** — workbox 6.x 사용으로 deprecated
- **Icons:** lucide-react

## PWA 설정 방식 (Next.js 16 네이티브)

Next.js 16은 `next-pwa` 없이 자체 PWA를 지원한다:
1. `app/manifest.ts` — Web App Manifest
2. `public/sw.js` — 서비스 워커 (수동 등록)
3. `src/app/layout.tsx`에서 SW 등록 클라이언트 컴포넌트 추가

## DB 스키마 요약

```
users             — id, name, role, preferred_genre, vocal_range, current_credits
songs             — id, title, artist, youtube_url, mr_file_url, lyrics, user_id, is_busking_selected
schedules         — id, title, date, participation_fee, is_large_event
attendances       — id, schedule_id, user_id, status
credit_transactions — id, user_id, type, amount, balance_after, description
refund_requests   — id, user_id, schedule_id, reason, status
```

스키마 파일: `supabase/schema.sql`

## 환경변수

`.env.local` 파일 필요 (`.env.local.example` 참고):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 개발 주의사항

1. `next.config.ts`는 `export default` ESM 형식 사용 (`.cjs`/`.cts` 미지원)
2. Tailwind v4는 `tailwind.config.js` 불필요 — CSS에서 직접 설정
3. 서버 컴포넌트에서 `'use client'` 없이 Supabase 호출 시 `@supabase/ssr` 사용
4. RLS(Row Level Security)는 모든 테이블에 활성화 필수

---

## 🔧 개발 워크플로우 규칙 (MANDATORY)

> Claude는 매 작업 시작 전 이 섹션을 반드시 읽고 규칙을 준수한다.

### 규칙 1: 에러 즉시 기록

오류 발생 시 아래 "에러 로그" 섹션에 즉시 기록:
- **문제 상황**: 어떤 에러였는지
- **해결 방법**: 어떻게 고쳤는지
- **재발 방지 교훈**: 다음번에 피해야 할 패턴

### 규칙 2: 워크트리 에이전트 병렬 작업

독립적인 작업은 `isolation: "worktree"` 워크트리 에이전트로 병렬 실행한다.
적용 기준:
- DB 마이그레이션 ↔ 컴포넌트 구현 → **병렬 가능**
- 페이지 A 구현 ↔ 페이지 B 구현 → **병렬 가능**
- 구현 완료 → 빌드 검증 → **순차 필요**

### 규칙 3: 구현 / 검증 에이전트 분리

모든 기능 구현은 두 단계로 나눈다:

| 단계 | 에이전트 역할 | 수행 작업 |
|---|---|---|
| 1 | **구현 에이전트** | 코드 작성, 파일 생성/수정 |
| 2 | **검증 에이전트** | `tsc --noEmit`, `npm run build`, 로직 검증 |

검증 에이전트가 실패를 발견하면 → 에러 로그에 기록 후 구현 에이전트에 피드백.

---

## 에러 로그

<!-- 에러 발생 시 아래에 추가 (최신순) -->

### [2026-04-13] create-next-app 한국어 경로 오류
- **문제**: `C:\Street 길울림` 디렉터리에서 `npx create-next-app@latest .` 실행 시 npm 명명 규칙(대문자·비URL문자 불가) 오류로 실패
- **해결**: 유효한 이름의 하위 디렉터리 `gireulrim`을 지정해 생성 (`npx create-next-app@latest gireulrim`)
- **교훈**: 한국어/특수문자 포함 경로에서 `create-next-app`은 하위 폴더 지정 필수

### [2026-04-13] next-pwa deprecated
- **문제**: `next-pwa@5.6.0`이 workbox 6.x(deprecated)에 의존, Next.js 16과 충돌 가능
- **해결**: `next-pwa` 플러그인 미사용. `app/manifest.ts` + `public/sw.js` 네이티브 방식으로 대체
- **교훈**: Next.js 16에서 PWA는 별도 플러그인 없이 구현 가능. `next-pwa` 사용 금지
