import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // to get where user wants to go
    const pathName = req.nextUrl.pathname;

    //manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathName.startsWith("/login");

    //protecting login page from logged-in users
    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      //if they are not authenticated, then they can visit the login page
      return NextResponse.next();
    }

    // when we try to access sensitive route
    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathName.startsWith(route),
    );

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathName === "/")
      return NextResponse.redirect(new URL("/dashboard", req.url));
  },
  {
    //next-auth specific

    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
