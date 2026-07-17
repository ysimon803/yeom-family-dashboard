"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

type CreateLinkTokenResponse = {
  linkToken?: string;
  error?: string;
};

type ExchangePublicTokenResponse = {
  success?: boolean;
  itemId?: string;
  requestId?: string;
  message?: string;
  error?: string;
};

type ConnectionStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "success"
  | "error";

export default function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function createLinkToken() {
      try {
        const response = await fetch("/api/plaid/create-link-token", {
          method: "POST",
        });

        const data =
          (await response.json()) as CreateLinkTokenResponse;

        if (!response.ok || !data.linkToken) {
          throw new Error(
            data.error ?? "Failed to create Plaid Link token.",
          );
        }

        if (!cancelled) {
          setLinkToken(data.linkToken);
          setStatus("idle");
        }
      } catch (error: unknown) {
        console.error("Failed to initialize Plaid Link:", error);

        if (!cancelled) {
          setStatus("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Failed to initialize Plaid Link.",
          );
        }
      }
    }

    void createLinkToken();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    setStatus("connecting");
    setMessage(null);

    try {
      const response = await fetch(
        "/api/plaid/exchange-public-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicToken,
          }),
        },
      );

      const data =
        (await response.json()) as ExchangePublicTokenResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "Failed to save the Plaid connection.",
        );
      }

      setStatus("success");
      setMessage(
        data.message ?? "Bank connected successfully.",
      );

      console.info("Plaid institution connected:", {
        itemId: data.itemId,
        requestId: data.requestId,
      });
    } catch (error: unknown) {
      console.error("Failed to complete Plaid connection:", error);

      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to connect the financial institution.",
      );
    }
  }, []);

  const onExit = useCallback(() => {
    setStatus((currentStatus) =>
      currentStatus === "connecting" ? "idle" : currentStatus,
    );
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  const isDisabled =
    !ready ||
    status === "loading" ||
    status === "connecting" ||
    status === "success";

  function handleOpen() {
    setMessage(null);
    open();
  }

  function getButtonLabel() {
    switch (status) {
      case "loading":
        return "Preparing Plaid...";
      case "connecting":
        return "Connecting...";
      case "success":
        return "Bank Connected";
      case "error":
        return "Try Again";
      default:
        return "Connect Bank";
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleOpen}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {getButtonLabel()}
      </button>

      {message ? (
        <p
          role={status === "error" ? "alert" : "status"}
          className={[
            "text-sm",
            status === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400",
          ].join(" ")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}