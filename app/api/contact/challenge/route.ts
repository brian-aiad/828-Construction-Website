import { NextResponse } from "next/server";
import {
  CONTACT_CHALLENGE_MIN_AGE_MS,
  issueContactChallenge,
} from "@/lib/contactSecurity";

const HEADERS = {
  Allow: "GET, HEAD, OPTIONS",
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

function methodNotAllowed() {
  return new NextResponse(null, { status: 405, headers: HEADERS });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HEADERS });
}

export function GET() {
  const token = issueContactChallenge();
  if (!token) {
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable." },
      { status: 503, headers: HEADERS }
    );
  }

  return NextResponse.json(
    {
      token,
      minWaitMs: CONTACT_CHALLENGE_MIN_AGE_MS,
    },
    { headers: HEADERS }
  );
}

export function HEAD() {
  return new NextResponse(null, { status: issueContactChallenge() ? 200 : 503, headers: HEADERS });
}
