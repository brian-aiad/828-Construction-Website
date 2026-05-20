# Portfolio Image Audit

Date: 2026-05-19

## Production Rule

Portfolio imagery must look like credible contractor photography: clean perspective, realistic construction details, no cartoon styling, no glossy CGI, no watermarks, no fake text, and no obvious duplicate frames.

Where real project coverage is limited, supplemental generated angle sets may be used to complete the presentation. Treat those as visual portfolio support, not verified field documentation, and replace any frame that looks artificial or mismatched.

## Current Gallery Standard

- Every portfolio project has five unique lightbox images.
- Current galleries live in `public/images/projects/generated-angles/`.
- Each project gallery uses unique file paths and must be checked for exact duplicate files.
- Do not reuse the same generated frame across multiple projects.
- Weak generated outputs should be regenerated as new angles, not patched with tight crops.

## Known Constraint

Some projects only have limited real source coverage available. The current production direction is to use polished supplemental angle sets so the portfolio feels complete, custom, and visually intentional.
