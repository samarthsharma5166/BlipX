import {withAuth} from 'next-auth/middleware'

export default withAuth({
    pages: {
        signIn: '/'
    }
})

export const config = {
    matcher: ['/users/:path*']
}


// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req:NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // Check if the request path matches your protected route
//   if (!token && req.nextUrl.pathname.startsWith("/users")) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/"; // Redirect to the sign-in page or home page
//     return NextResponse.redirect(url);
//   }

//   // Allow the request if authenticated
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/users/:path*"], // Apply middleware to these routes
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // Extract the pathname of the request
//   const { pathname } = req.nextUrl;

//   // Allow the request if:
//   // 1. The token exists (user is authenticated)
//   // 2. The path is the login page (e.g., '/')
//   if (token || pathname === "/") {
//     return NextResponse.next();
//   }

//   // Redirect unauthenticated users to the login page
//   const url = req.nextUrl.clone();
//   url.pathname = "/"; // Specify the path to your login page
//   return NextResponse.redirect(url);
// }

// export const config = {
//   matcher: ["/users/:path*"], // Apply middleware only to routes under /users
// };
