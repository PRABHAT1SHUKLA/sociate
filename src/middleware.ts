import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection
    const isAuth = await getToken({req})
    const isLoginPage = pathname.startsWith(`/sign-in`)

    const sensitiveRoutes = ['/dashboard']
    const isAccesingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route))

    if(isLoginPage) {
      if(isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      return NextResponse.next()
    }

    if(!isAuth && isAccesingSensitiveRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    if(pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/', '/sign-in', '/dashboard/:path*']
}