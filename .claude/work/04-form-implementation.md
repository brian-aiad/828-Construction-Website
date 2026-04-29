# Workstream 4 — Form Implementation

**Goal:** Contact form end-to-end — beautiful design, working API, spam protection, accessible.

## Design spec

### Visual
- Background: black (`bg-black` or `bg-[#0a0a0a]`) section wrapper
- Labels: white, `font-labels text-[9px] tracking-[0.22em] uppercase`
- Inputs: black bg, `border border-white/20`, white text, `focus:border-[#B87333]`
- Placeholder text: `text-white/30`
- Submit button: white bg, black text, copper hover `hover:bg-[#B87333] hover:text-white`

### States
- **Idle**: form fields displayed
- **Loading**: spinner animation on submit button, fields disabled
- **Success**: copper SVG checkmark draw animation + thank-you copy
- **Error (top-level)**: error banner above submit button
- **Error (field-level)**: inline red error below each field

### Honeypot
- Hidden `<input name="website" tabIndex={-1} autoComplete="off">` field
- If filled → return 200 (silently drop, don't alert spambots)

### Rate limiting
- Simple in-memory per-IP rate limit (5 requests per 10 minutes)
- Return 429 with message if exceeded

### Validation
- **Name**: required, min 2 chars
- **Phone**: required, must match `/^\+?[\d\s\-().]{7,}$/`
- **Email**: optional, must be valid email format if provided
- **Service**: required, must be one of known services
- **Message**: required, min 20 chars

## API route enhancements (`app/api/contact/route.ts`)
- Add honeypot check
- Add in-memory rate limiting (Map with IP → {count, resetAt})
- Stricter phone/email validation regex
- Return field-level errors as `{ errors: { field: message } }`

## Success state
```
[copper SVG circle checkmark — stroke-dashoffset draw animation, 0.6s]
[gap 24px]
"Message Received"  — font-display bold white text-2xl
[gap 16px]
"Joe will review your details and respond within 24 hours.
For urgent work, call (213) 828-2388 directly."  — text-gray-400 text-sm
```

## ContactForm.tsx structure
```tsx
"use client"
// states: idle | loading | success | error
// field errors: Record<string, string>
// honeypot: hidden input
// loading: spinner SVG on button
// success: copper checkmark
// accessibility: aria-invalid, aria-describedby for errors
```

## Success criteria
- Form submits successfully in dev (console.log fallback)
- Empty submit shows field-level errors
- XSS input sanitized server-side
- Double-submit prevented
- Honeypot fills silently succeed from user POV
- Rate limit returns 429 after 5 rapid submissions
- Loading state shows spinner
- Success state shows copper checkmark animation
- A11y: all fields labelled, errors associated via aria-describedby
