import { NextResponse } from 'next/server';

export function proxy(request) {
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // Protect all routes starting with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/account/login', request.url));
    }

    try {
      // Decode the JWT payload to check its expiration.
      // JWTs have 3 parts separated by dots, the second part is the payload in Base64Url format.
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const decoded = JSON.parse(decodedJson);
      
      const currentTime = Date.now() / 1000;

      // If token is expired, redirect to login and clear the invalid cookie
      if (decoded.exp < currentTime) {
        const response = NextResponse.redirect(new URL('/account/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    } catch (error) {
      // If token decoding fails (malformed), clear it and redirect to login
      const response = NextResponse.redirect(new URL('/account/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // If token is valid or we are not on an /admin route, allow access
  return NextResponse.next();
}

// Config to apply middleware only to /admin and its subpaths
export const config = {
  matcher: ['/admin/:path*'],
};
