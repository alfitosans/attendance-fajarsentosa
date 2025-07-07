import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "fallback-secret-key"
const key = new TextEncoder().encode(secretKey)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/api/auth/login"]

  // Static files and API routes that should be excluded
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/_") || pathname.includes(".")) {
    return NextResponse.next()
  }

  if (publicRoutes.includes(pathname)) {
    // Check if user is already logged in
    const sessionCookie = request.cookies.get("session")
    if (sessionCookie) {
      const session = await verifyToken(sessionCookie.value)
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  const sessionCookie = request.cookies.get("session")
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const session = await verifyToken(sessionCookie.value)
  if (!session) {
    // Clear invalid cookie
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set("session", "", { expires: new Date(0) })
    return response
  }

  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", session.userId?.toString() || "")
  requestHeaders.set("x-user-role", session.role?.toString() || "")

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
