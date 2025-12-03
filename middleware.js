import { NextResponse } from "next/server";

export function middleware(req) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${btoa("user:pass")}`) {
    return new NextResponse("Auth Required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }
}
