"use client";

import React from "react";

interface AuthPromptProps {
  error?: string;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({ error }) => {
  const handleConnect = () => {
    // Generate random state nonce for CSRF protection
    const state = crypto.randomUUID();
    sessionStorage.setItem("splitwise_oauth_state", state);

    const consumerKey = process.env.NEXT_PUBLIC_SPLITWISE_CONSUMER_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_SPLITWISE_REDIRECT_URI;

    if (!consumerKey || !redirectUri) {
      console.error("Missing Splitwise environment variables");
      return;
    }

    const authUrl = new URL("https://secure.splitwise.com/oauth/authorize");
    authUrl.searchParams.set("client_id", consumerKey);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);

    window.location.href = authUrl.toString();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connect to Splitwise</h2>
        <p className="text-gray-400">
          Connect your Splitwise account to export calculated debts.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded p-3 text-red-300 text-sm">
          {error === "access_denied" && "You denied access to Splitwise."}
          {error === "token_exchange_failed" && "Failed to authenticate with Splitwise. Please try again."}
          {error === "oauth_failed" && "Authentication failed. Please try again."}
          {error === "missing_code" && "Authentication incomplete. Please try again."}
          {error === "no_access_token" && "No access token received. Please try again."}
          {!["access_denied", "token_exchange_failed", "oauth_failed", "missing_code", "no_access_token"].includes(error) &&
            `Error: ${error}`}
        </div>
      )}

      <button
        onClick={handleConnect}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-6 rounded transition-colors"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Connect to Splitwise
      </button>
    </div>
  );
};

export default AuthPrompt;
