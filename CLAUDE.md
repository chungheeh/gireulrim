@AGENTS.md

> **Claude 필독:** 이 파일을 매 작업 시작 전 반드시 전체 읽고 시작한다. 브랜드, 비즈니스 모델, 워크플로우 규칙 모두 구현에 반영되어야 한다.

---

# 길울림 (Street Resonance) — PWA MVP

## 브랜드 아이덴티티

- **정식 명칭:** 길울림밴드
- **영문:** STREET RESONANCE
- **슬로건:** 2030 보컬동아리
- **로고 컬러:** 올리브 그린 `#4a6741` + 블랙 + 화이트
- **앱 UI 컬러 시스템:**
  - 배경: **화이트** `#ffffff`
  - 키 컬러: **올리브 그린** `#4a6741`
  - 포인트 1: **보라** `#7c3aed`
  - 포인트 2: **노랑** `#fbbf24`
  - 글씨: **블랙** `#111111`
  - 서브텍스트: `#6b7280` (gray-500)
  - 카드/구분선: `#f3f4f6` (gray-100)

**톤앤매너:** 따뜻하고 부담 없으며 직장인들을 위로하는 친절한 말투. 모든 안내 문구에 일관 적용.

---

## 비즈니스 모델 & 서비스 로직

### 타겟
- **20-30대 직장인** 보컬 소모임
- 장르: 8090 발라드, 어쿠스틱, 인디, 대중가요 중심

### 수익 & 운영 모델
| 항목 | 내용 |
|---|---|
| 정기 모임 참가비 | **9,000원** (계좌이체 후 입금확인증 업로드 방식) |
| 대형 이벤트(버스킹 등) | 0원 또는 관리자 수동 공지 |
| 결제 방식 | **PG사 없음** — 계좌 안내 + 입금 캡처 업로드 → 관리자 승인 |
| 포인트 레슨 | 보컬 초보 대상, `can_give_lesson` 필드, `[레슨 가능]` 뱃지 |

### MVP에서 제외할 기능
- 실시간 채팅 (카카오톡 병행 사용)
- 복잡한 Q&A 게시판 (구글 폼 또는 관리자 DM으로 대체)
- PG사 결제 연동

---

## 핵심 기능 명세

### 1. 회원 (일반 유저)

**가입 플로우:** 구글 소셜 로그인 → 추가 프로필 입력 (필수)
- 나이 / 성별
- 지원 파트: `보컬 / 기타 / 퍼커션 / 키보드`
- 보유 악기 여부
- 선호 장르 (8090 발라드, 어쿠스틱, 인디 등 다중 선택)
- 음역대 (고음 / 중저음 등)
- 18번 곡 (자유 입력)

**홈 (메인 피드):**
- 상단 배너: 길울림 소개 또는 이번 달 버스킹 목표 슬라이드
- 다가오는 일정 카드: [참석] / [불참] 토글 버튼 + 참석 시 "연습할 곡 메모" 팝업
- 최근 소식 피드 (가벼운 인사글, 연습 후기, 유튜브 링크)

**선곡/연습 게시판 (Songs):**
- 뱃지: `[솔로]` `[듀엣 모집]` `[단체곡]`
- 게시글: 곡 제목/아티스트, 유튜브 링크(썸네일 미리보기), MR 파일, 가사, 키 정보
- 카드형 목록: 유튜브 썸네일 + [MR 재생] + [가사 보기]
- 가사 보기 시 미니 플레이어 동시 재생 (카카오뮤직 스타일)
- 탭: "이번 주 합주곡" / "내 보관함"

**멤버 (Members):**
- 카카오톡 친구 목록 스타일
- 상단: 내 프로필 크게
- 이름 옆: 파트 아이콘 (🎤 보컬, 🎸 기타 등)
- 상태 메시지 위치: 좋아하는 가수 또는 주력 장르 한 줄
- 프로필 탭: 나이, 선호 장르, 18번 곡, 자기소개 팝업
- `[포인트 레슨 가능]` / `[레슨 요청]` 뱃지

**MY (마이페이지):**
- 프로필 수정 (파트, 장르, 18번 곡 등)
- 회비 납부 현황: 입금 대기 / 승인 완료 상태
- 참석 내역: 이번 달 합주 참석 횟수 (도장 UI)
- 건의사항: 관리자 DM 폼 (심플)

### 2. 운영진 (관리자)

**참석 현황 대시보드:**
- 파트별 참석 비율 (보컬만 오는 상황 방지)
- 주 단위 출석부

**회비 납부 관리:**
- 멤버가 올린 입금 캡처 확인 → [승인] / [반려]
- 미납자 필터링

**선곡 확정 기능:**
- 멤버 선곡 리스트에서 [버스킹 확정] → 자동 셋리스트 페이지 생성
- 확정 곡 MR 일괄 다운로드 (플레이리스트 관리)

**권한 관리 (ReBAC):**
- 역할: `admin` / `member`
- 그룹 단위: "이번 달 버스킹 참여조", "평일반/주말반"
- 그룹별 게시판 읽기/쓰기 권한 제어

### 3. 미디어 아카이브
- 버스킹/연습 영상·사진 갤러리
- 소속감 및 잔존율 향상 목적

---

## 하단 탭 바 (GNB 4탭)

| 탭 | 경로 | 아이콘 | 핵심 기능 |
|---|---|---|---|
| 홈 | `/` | 🏠 | 공지 배너, 일정 카드(참석 토글), 소식 피드 |
| 선곡/연습 | `/songs` | 🎤 | MR·가사 게시판, 듀엣 모집, 셋리스트 |
| 멤버 | `/members` | 👥 | 카카오톡 친구목록 스타일, 파트 아이콘 |
| MY | `/mypage` | 👤 | 프로필, 회비 현황, 참석 도장 |

---

## 테크 스택

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Auth:** Supabase Google OAuth
- **PWA:** Next.js 16 네이티브 (`app/manifest.ts` + `public/sw.js`)
  - `next-pwa` 플러그인 **사용 금지** — workbox 6.x deprecated
- **Icons:** lucide-react

## PWA 설정 방식

1. `app/manifest.ts` — Web App Manifest
2. `public/sw.js` — 서비스 워커 (수동 등록)
3. `ServiceWorkerRegister` 클라이언트 컴포넌트로 layout에서 등록

## DB 스키마 요약

```
users             — id, name, role, part, preferred_genre, vocal_range, signature_song, can_give_lesson, current_credits
songs             — id, title, artist, youtube_url, mr_file_url, lyrics, song_key, tag(솔로/듀엣/단체), user_id, is_busking_selected
schedules         — id, title, date, participation_fee(default 9000), is_large_event
attendances       — id, schedule_id, user_id, status, practice_note
credit_transactions — id, user_id, type, amount, balance_after, description
refund_requests   — id, user_id, schedule_id, reason, status
payment_proofs    — id, user_id, schedule_id, image_url, status(pending/approved/rejected)
```

스키마 파일: `supabase/schema.sql`

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=https://mqkrchjvgzswlttjtmlz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## 개발 주의사항

1. `next.config.ts` — `export default` ESM 형식 (`cts`/`cjs` 미지원)
2. Tailwind v4 — `tailwind.config.js` 불필요, CSS `@theme` 블록에서 직접 설정
3. 서버 컴포넌트 Supabase — `@supabase/ssr`의 `createServerClient` 사용
4. RLS — 모든 테이블 활성화 필수
5. **UI 색상** — 화이트 배경, 올리브 그린 키 컬러, 보라 포인트, 노랑 포인트, 블랙 텍스트
6. **결제** — PG사 없음. 계좌이체 + 입금 캡처 업로드 방식

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
- DB 마이그레이션 ↔ 컴포넌트 구현 → **병렬 가능**
- 페이지 A 구현 ↔ 페이지 B 구현 → **병렬 가능**
- 구현 완료 → 빌드 검증 → **순차 필요**

### 규칙 3: 구현 / 검증 에이전트 분리

| 단계 | 에이전트 | 수행 작업 |
|---|---|---|
| 1 | **구현** | 코드 작성, 파일 생성/수정 |
| 2 | **검증** | `tsc --noEmit`, `npm run build`, 로직 검증 |

검증 실패 → 에러 로그 기록 → 구현 에이전트에 피드백.

---

## 에러 로그

<!-- 최신순으로 추가 -->

### [2026-04-14] 서비스워커가 307 리다이렉트를 캐시 → ERR_FAILED 반복
- **문제**: SW의 cache-first fetch가 proxy의 307 응답을 캐시에 저장 → 이후 요청 시 캐시된 307을 돌려줌 → 브라우저 ERR_FAILED 반복 (한두 번은 되다가 그다음부터 안 됨)
- **해결**: `sw.js` fetch 핸들러에서 `navigate` 모드(HTML 페이지) 요청은 `respondWith` 자체를 호출하지 않아 브라우저가 직접 처리. `response.status === 200` 인 것만 캐시. `_next/static/` 파일과 이미지만 캐시 대상으로 제한
- **재발 방지 교훈**: SW fetch 핸들러에서 **`event.request.mode === "navigate"` 이면 절대 respondWith 호출 금지**. 리다이렉트(3xx)는 캐시하지 말 것. `response.ok && response.status === 200` 조건으로만 캐시

### [2026-04-14] Vercel 배포 후 브라우저 ERR_FAILED
- **문제**: `curl`로는 HTTP 307 정상 응답인데 Chrome에서 ERR_FAILED. 원인 두 가지:
  1. **Vercel SSO Protection** — 팀 계정의 Deployment Protection이 `all_except_custom_domains`로 설정되어 `-chunghee121s-projects.vercel.app` URL에 팀 로그인 필요
  2. **브라우저 DNS/SSL 캐시** — 한번 ERR_FAILED가 캐시되면 서버가 정상이어도 브라우저가 차단
- **해결**:
  1. SSO Protection → Vercel API `PATCH /v9/projects/{id}` 로 `ssoProtection: null` 설정
  2. 브라우저 문제 → `chrome://net-internals/#dns` 에서 DNS 캐시 초기화 + `chrome://net-internals/#sockets` 에서 소켓 플러시
- **재발 방지 교훈**:
  - 배포 직후 반드시 `curl -I URL` 로 서버 응답 먼저 확인 → 307/200 이면 서버는 정상, 브라우저 문제
  - Vercel 팀 계정 프로젝트 생성 시 **즉시** SSO Protection 해제: `curl -X PATCH /v9/projects/{id} -d '{"ssoProtection":null}'`
  - 공개 서비스 접속 주소는 항상 **`gireulrim.vercel.app`** (커스텀 도메인) 사용
  - `-chunghee121s-projects.vercel.app` 프리뷰 URL은 팀원 전용이므로 외부 공유 금지

### [2026-04-13] create-next-app 한국어 경로 오류
- **문제**: `C:\Street 길울림` 경로에서 `npx create-next-app@latest .` 실행 시 npm 명명 규칙 오류
- **해결**: 하위 디렉터리 `gireulrim` 지정하여 생성
- **교훈**: 한국어/특수문자 경로에서 create-next-app은 하위 폴더 필수

### [2026-04-13] middleware → proxy 이전 (Next.js 16)
- **문제**: `src/middleware.ts` 사용 시 빌드 경고 — `"middleware" file convention is deprecated. Please use "proxy" instead.`
- **해결**: `src/proxy.ts`로 파일명 변경 + 함수명 `middleware` → `proxy`로 변경
- **교훈**: Next.js 16에서 인증/라우팅 가드는 `proxy.ts` + `export function proxy()` 사용. `middleware.ts` 금지

### [2026-04-13] next-pwa deprecated
- **문제**: `next-pwa@5.6.0`이 workbox 6.x(deprecated)에 의존
- **해결**: `app/manifest.ts` + `public/sw.js` 네이티브 방식으로 대체
- **교훈**: Next.js 16에서 next-pwa 사용 금지
