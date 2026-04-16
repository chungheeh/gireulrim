import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // OAuth code가 루트(/)로 잘못 콜백된 경우 → /api/auth/callback 으로 리다이렉트
  // (Supabase redirect URL이 사이트 루트로 설정된 경우 대응)
  const code = searchParams.get("code");
  if (code && (pathname === "/" || pathname === "")) {
    const callbackUrl = new URL("/api/auth/callback", request.url);
    callbackUrl.searchParams.set("code", code);
    const next = searchParams.get("next");
    if (next) callbackUrl.searchParams.set("next", next);
    return NextResponse.redirect(callbackUrl);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 인증 불필요 경로
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api/auth")
  ) {
    if (user && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return supabaseResponse;
  }

  // 비로그인 → 로그인 페이지로
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 프로필 미완성 → 온보딩으로
  // (트리거가 name은 자동 설정하므로 available_days로 온보딩 완료 여부 판단)
  {
    const { data: profile } = await supabase
      .from("users")
      .select("available_days, role")
      .eq("id", user.id)
      .single();

    const onboardingDone = Array.isArray(profile?.available_days) && profile.available_days.length > 0;

    if (!onboardingDone && !pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // 관리자 페이지 접근 제한 (admin 역할만)
    if (pathname.startsWith("/admin") && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png|sw\\.js|manifest\\.webmanifest).*)",
  ],
};
