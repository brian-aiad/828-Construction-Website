# Portfolio Image Audit

Date: 2026-05-21

## Production Rule

Portfolio imagery must look like credible contractor photography: clean perspective, realistic construction details, no cartoon styling, no glossy CGI, no watermarks, no fake text, and no obvious duplicate frames.

Where real project coverage is limited, prefer existing local project/worksite assets or restrained placeholders. Generated work-photo sets should not be used in live project slots unless the client explicitly approves them as placeholders.

## Current Gallery Standard

- Live portfolio project images are wired from existing local project/worksite assets in `public/images/projects/`.
- Generated-angle and v2 generated portfolio images are no longer referenced by `lib/constants.ts`.
- Each lightbox should avoid exact duplicate files within a project.
- If a live image reads as artificial, replace it with a better existing worksite asset or a clear placeholder state rather than polishing the same synthetic frame.

## Known Constraint

Some projects only have limited real source coverage available. The current production direction is to keep the portfolio credible and inspectable while real client photography remains pending.
