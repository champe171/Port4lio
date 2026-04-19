# TODOS

## ngoctram.info portfolio rebuild

### High priority

- [ ] **E2E test: owner save → ISR revalidate → portfolio reflects changes**
  Why: The most critical user flow is completely untested. ISR revalidation can silently fail.
  Start: Set up Playwright, write e2e/owner-flow.spec.ts
  Depends on: Phase 4 (index.tsx) + Phase 6 (/setting) complete
  
- [ ] **Cloudinary transform spec for hero photos**
  Why: heroPhotoLeft and heroPhotoRight may be uploaded at different aspect ratios.
  Without a consistent crop transform, the hero layout breaks.
  Start: Decide exact dimensions from the layout, then define:
  `w_800,h_1000,c_fill,g_face,q_auto,f_auto` (or equivalent)
  Depends on: Phase 3 (visual design, exact photo dimensions known)

### Low priority

- [ ] **Unit tests for lib/auth.ts**
  Why: Security boundary is untested. verifyAuthToken needs tests for expired token,
  tampered signature, and valid token.
  Start: test/lib/auth.test.ts (pure unit tests, no mocks needed)
  Depends on: Nothing
