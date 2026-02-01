import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle OAuth denial
  if (error) {
    return NextResponse.redirect(
      new URL(`/splitwise?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/splitwise?error=missing_code", request.url)
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://secure.splitwise.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.SPLITWISE_CONSUMER_KEY || "",
          client_secret: process.env.SPLITWISE_CONSUMER_SECRET || "",
          redirect_uri: process.env.SPLITWISE_REDIRECT_URI || "",
          code: code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL("/splitwise?error=token_exchange_failed", request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/splitwise?error=no_access_token", request.url)
      );
    }

    // Redirect to splitwise page with token and state
    const redirectUrl = new URL("/splitwise", request.url);
    redirectUrl.searchParams.set("token", accessToken);
    if (state) {
      redirectUrl.searchParams.set("state", state);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL("/splitwise?error=oauth_failed", request.url)
    );
  }
}
