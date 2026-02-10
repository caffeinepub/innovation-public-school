# Specification

## Summary
**Goal:** Restore reliable access to the `/admin` panel by fixing admin login/session handling and the `/admin` route guard so users don’t get stuck verifying access.

**Planned changes:**
- Update `/admin` route guarding so fresh visitors see an “Authentication Required” prompt (not an infinite “Verifying admin access…” state) and authenticated admins are routed to the dashboard.
- Fix backend admin session/auth flow so `adminLogin` issues a valid session token, `validateAdminSession` correctly validates it for the same caller principal, and `adminLogout` invalidates it.
- Improve frontend admin session handling: store/clear the session token correctly across reloads, show concise English error states for invalid credentials/unauthorized/backend unavailable, and allow retry.
- Ensure no credentials are logged or exposed in UI/console error messages.

**User-visible outcome:** Visiting `/admin` reliably shows a login prompt when unauthenticated, successful admin login opens the admin dashboard (and remains accessible on reload for the same session), and failures show clear retryable errors instead of a spinner or blank state.
