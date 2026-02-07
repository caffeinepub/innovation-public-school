# Specification

## Summary
**Goal:** Switch Admin Panel authentication from Internet Identity to backend-verified username/password sessions, and protect all admin actions using that session mechanism.

**Planned changes:**
- Remove/disable any Internet Identity-based login triggers for the Admin Panel and gate `/admin` behind a username + password login prompt when logged out.
- Add backend login/logout support that verifies admin credentials and returns a session indicator (e.g., token), and ensure the frontend contains no hardcoded admin password or local credential checks.
- Enforce admin authorization on all admin-only backend reads/mutations (content, gallery, enquiries, contact details) using the new session mechanism, while keeping public endpoints accessible.
- Update the Admin Dashboard data layer (React Query hooks / API calls) to include the admin session mechanism for admin-only operations, without editing immutable frontend paths.

**User-visible outcome:** Visiting `/admin` while logged out shows a username/password login prompt (no Internet Identity flow). After logging in, the admin can use all dashboard features as before; logging out ends the session and returns to the logged-out admin state.
