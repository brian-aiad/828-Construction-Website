"use client";

import type { ComponentPropsWithoutRef } from "react";

const EMAIL_CODE_POINTS = [
  56, 50, 56, 99, 111, 110, 115, 116, 114, 117, 99, 116, 105, 111, 110, 99,
  97, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109,
];

function getEmailAddress() {
  return String.fromCharCode(...EMAIL_CODE_POINTS);
}

export default function ProtectedEmailLink({
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "type">) {
  return (
    <button
      {...props}
      type="button"
      data-protected-email=""
      aria-label="Email 828 Construction"
      onClick={() => {
        window.location.assign(`mailto:${getEmailAddress()}`);
      }}
    >
      {children}
    </button>
  );
}
