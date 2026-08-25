"use client";

import { useCallback, useEffect, useRef } from "react";

type Challenge = {
  token: string;
  readyAt: number;
};

type ContactResponse = {
  error?: string;
  errors?: Record<string, string>;
  reference?: string;
  code?: string;
  retryAfterMs?: number;
};

const REFRESHABLE_CHALLENGE_CODES = new Set([
  "challenge_missing",
  "challenge_invalid",
  "challenge_expired",
]);

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

export function useContactSubmission() {
  const challengeRef = useRef<Challenge | null>(null);
  const pendingChallengeRef = useRef<Promise<Challenge> | null>(null);

  const loadChallenge = useCallback(async (force = false) => {
    if (!force && challengeRef.current) return challengeRef.current;
    if (!force && pendingChallengeRef.current) return pendingChallengeRef.current;

    const request = (async () => {
      const response = await fetch("/api/contact/challenge", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const body = (await response.json().catch(() => ({}))) as {
        token?: string;
        minWaitMs?: number;
      };
      if (!response.ok || !body.token) {
        throw new Error("The secure form could not start. Please try again or call us directly.");
      }

      const challenge = {
        token: body.token,
        // Small clock/network cushion prevents a just-issued token from
        // arriving a few milliseconds before the server's minimum age.
        readyAt: Date.now() + Math.max(0, body.minWaitMs || 0) + 100,
      };
      challengeRef.current = challenge;
      return challenge;
    })();

    pendingChallengeRef.current = request;
    try {
      return await request;
    } finally {
      if (pendingChallengeRef.current === request) pendingChallengeRef.current = null;
    }
  }, []);

  useEffect(() => {
    void loadChallenge().catch(() => {
      // Submission retries this request and presents the actionable error.
    });
  }, [loadChallenge]);

  return useCallback(
    async (data: Record<string, string>) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        const challenge = await loadChallenge(attempt > 0);
        const waitMs = challenge.readyAt - Date.now();
        if (waitMs > 0) await wait(waitMs);

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, challengeToken: challenge.token }),
        });
        const body = (await response.json().catch(() => ({}))) as ContactResponse;

        if (
          attempt === 0 &&
          (REFRESHABLE_CHALLENGE_CODES.has(body.code || "") ||
            response.status === 425)
        ) {
          challengeRef.current = null;
          if (response.status === 425 && body.retryAfterMs) {
            await wait(Math.min(Math.max(body.retryAfterMs, 0) + 100, 2_000));
          }
          continue;
        }

        return { response, body };
      }

      throw new Error("The secure form expired. Please try again or call us directly.");
    },
    [loadChallenge]
  );
}
