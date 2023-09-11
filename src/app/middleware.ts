import { withAuth } from "next-auth/middleware";

export default withAuth(async function middleware(req) {
  // to get where user wants to go
  const pathName = req.nextUrl.pathname;
});
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
