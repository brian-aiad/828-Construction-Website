# 828 Construction Production Checklist

Use this checklist for the final Vercel release and after any future production change.

## Before Deploy

- Use Node 22 (`nvm use`) and install exactly from the lockfile with `npm ci`.
- Run `npm run lint`.
- Run `npm run build` (this includes the TypeScript check).
- Run `npm audit --omit=dev --audit-level=high`.
- Run `npm run preflight:desktop` and `npm run preflight:mobile` against the production build.
- Confirm the final diff contains no unintended copy, address, phone, section-order, or image changes.

## Vercel Configuration

- Confirm `RESEND_API_KEY`, `CONTACT_EMAIL`, and `CONTACT_FROM_EMAIL` exist in the Production environment.
- Add and verify both `828constructions.com` and `www.828constructions.com` in the same Vercel project.
- Permanently redirect `www.828constructions.com` to `https://828constructions.com`.
- Confirm the issued certificate is valid for both hostnames before enabling HSTS `includeSubDomains` or preload.
- Add a Vercel WAF rate-limit rule for `POST /api/contact`. Start in Log mode, verify legitimate traffic, then enforce.
- Keep Vercel Analytics enabled and check Web Vitals after deployment.

## DNS And Email

- Keep the Resend DKIM record at `resend._domainkey.828constructions.com`.
- Keep the Resend SPF and MX records on `send.828constructions.com`.
- Add a DMARC policy for the sending domain after confirming the exact mail setup. Start with monitoring (`p=none`) and review reports before enforcement.
- Do not publish the business Gmail address in page HTML, metadata, or structured data.

## Business Information

- Confirm the official street address before changing the site or Google Business Profile. The site currently uses `21223 Hawthorne Blvd STE B 1087`; a CSLB issuance document appears to show `21213 Hawthorne Blvd, Suite B #1087` for license 1141119.
- Keep the confirmed name, address, phone, license number, and service areas identical across the site, Google Business Profile, CSLB, and trusted directories.

## Smoke Test After Deploy

- Open all eight sitemap URLs in a private browser window.
- Test navigation, mobile menu, sticky surfaces, rapid scrolling, portfolio viewer, and reduced-motion mode.
- Submit one real contact-form test with an email address and confirm both the owner notification and customer confirmation arrive.
- Confirm an invalid form focuses the first invalid field and does not submit.
- Confirm `/projects` and `/process` permanently redirect to `/portfolio`.
- Confirm an unknown URL returns a branded 404 with `noindex`.
- Confirm `robots.txt` and `sitemap.xml` return 200 and contain only the canonical HTTPS hostname.
- Confirm `https://www.828constructions.com` redirects without a certificate warning.

## Search And Monitoring

- Do not repeatedly request indexing for URLs already submitted in Google Search Console.
- Review Search Console Pages, HTTPS, Core Web Vitals, Enhancements, and Manual Actions after Google refreshes its reports.
- Review Vercel logs for `/api/contact` errors and unusual request spikes after launch.
- Review Resend delivery, bounce, and complaint activity after the live form test.
- Before adding advertising pixels or broader analytics, decide whether the site needs a public privacy notice and consent controls.

## Rollback

- Keep the previous successful Vercel deployment available until the smoke test passes.
- If a release causes a visual or form regression, promote the previous deployment first, then diagnose the failed release off production.
