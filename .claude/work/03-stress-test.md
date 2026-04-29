# Workstream 3 — Stress Test Suite

**Goal:** Playwright suite that stress-tests user interactions to ensure nothing breaks under aggressive use.

## Test file location
`.claude-work/research/stress-test/stress.spec.ts`

## Test scenarios

### 1. Rapid navigation (all 9 routes)
- Navigate through all routes in quick succession (200ms between each)
- Check for console errors after each navigation
- Verify no `removeChild` errors (SplitType cleanup, Fix 1)
- Verify no GSAP ScrollTrigger orphan warnings

### 2. Projects filter tab spam
- Click each filter tab 5× rapidly
- Verify Framer Motion AnimatePresence doesn't break
- Check no overlapping transitions
- Verify card count matches expected per category

### 3. Form stress testing
- Empty submit (all required fields blank) → expect validation error
- Special characters in all fields: `<script>alert("xss")</script>`, `'; DROP TABLE--`
- Very long input (5000 chars in message field) → expect graceful handling
- Rapid double-submit → expect only one request
- Phone field: letters instead of numbers → form should still submit (server validates)

### 4. Scroll velocity stress
- Programmatic rapid scroll to bottom, then top, then bottom
- Verify no GSAP ScrollTrigger errors
- Verify pinned sections release cleanly
- Verify counters don't reverse (Fix 10: once:true)

### 5. Viewport resize mid-scroll
- Load page, scroll to 50%
- Resize from 1440px → 320px → 768px → 1440px
- Verify no horizontal overflow appears
- Verify layout doesn't break

### 6. Keyboard navigation
- Tab through all interactive elements on each page
- Verify focus is visible (outline)
- Verify skip-link works
- Verify mobile menu accessible via keyboard
- Verify form fields focusable and labelled

### 7. Back/forward browser navigation
- Navigate to /services, then /about, hit back
- Verify animations initialize correctly (Fix 18: Fix 16)
- Verify no invisible elements

### 8. Hard refresh at non-zero scroll position
- Scroll to 50%, trigger hard reload
- Verify Fix 13/16 guards work — page should load at top with all elements visible

## Console error thresholds
- 0 errors per route per scenario
- `removeChild` = blocker
- `ScrollTrigger: must be in a browser` = blocker
- Any uncaught React errors = blocker

## Success criteria
- All 8 scenarios pass
- 0 console errors across all scenarios
- No visual regressions detected
