# Virtus Agency Operations OS — v0.1.0 Release Snapshot

**Release Version:** `v0.1.0`  
**Platform:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Neon Serverless PostgreSQL  
**Timestamp:** September 23, 2026  
**Status:** Shipped / Live  

---

## 🚀 Scope of Delivery

### 1. 15 Dedicated Operational Views
1. **Command Center Overview (`CommandCenterOverview.tsx`):** Real-time pipeline KPIs, delivery pulse, quick action controls, staging preview.
2. **Opportunities Pipeline (`PipelineView.tsx`):** GoHighLevel-style 6-stage Kanban board with drag-and-drop simulated stage movement and auto client conversion on "Won".
3. **Clients CRM Directory (`ClientsView.tsx`):** LTV statistics, active projects count, client filtering, "+ Add Client" modal, direct jump to client portal room.
4. **Calendar & Bookings (`BookingsView.tsx`):** Cal.com integration link, 7-day responsive interactive calendar grid, meeting agendas, "+ Schedule Meeting" modal.
5. **Proposals Generator (`ProposalsView.tsx`):** Bonsai/PandaDoc style proposal builder, milestone payment schedules, client acceptance simulation.
6. **Digital Contracts & e-Sign (`ContractsView.tsx`):** MSAs, SOWs, NDAs, digital signature pad with cryptographic IP/audit timestamping, signed PDF exports.
7. **Projects & Sprint Tasks (`ProjectsTasksView.tsx`):** Multi-project delivery pulse cards, Kanban sprint task board with team assignee filters (Kai, Ren, Sora).
8. **Invoices & Financial Accounting (`AccountingView.tsx`):** Financial ledger, Stripe Connect payout banner, Paid/Pending/Overdue status filters, "+ Issue Invoice" modal.
9. **Media & Creative Assets Vault (`MediaLibraryView.tsx`):** Cloudflare R2 powered asset repository with in-browser previews for PDFs, brand PNG/SVGs, video reels, and audio assets.
10. **Business Communications (`BusinessEmailView.tsx`):** Split-pane agency inbox auto-syncing inbound Brief Builder leads, with direct reply composer.
11. **Agency Performance Reports (`ReportsView.tsx`):** 67% win rate analytics, gross profit margin breakdown by discipline (Brand, Web, AI), portfolio health score.
12. **Team & RBAC Roles (`UsersRolesView.tsx`):** Team roster, granular permissions policy matrix, "+ Invite Member" modal.
13. **Security & Audit Logs (`SecurityAuditView.tsx`):** 96/100 posture score, API key reveal/hide controls, real-time cryptographic audit trail, and Neon DB test/migration runner.
14. **Workspace Settings (`WorkspaceSettingsView.tsx`):** Studio identity, custom domain configuration, timezone, currency, Cal.com/Stripe webhooks.
15. **Scoped Client Room (`ClientRoomView.tsx`):** Dedicated client portal with deliverable approval/revision controls, milestone progress tracker, contract/invoice access, and direct booking button.

---

### 2. Multi-Role RBAC Model
- **Admin (`paks@thevirtuslabs.com`):** Unrestricted access across all 15 operational views, financials, settings, and database controls.
- **Team Members (`Kai`, `Ren`, `Sora`):** Scoped access to 4 delivery views (`projects`, `media`, `calendar`, `email`); financial margins and CRM pipeline are masked.
- **Clients (`Tidewater Coffee`, `Meridian Clinic`):** Restricted solely to their isolated company room (`ClientRoomView`) with deliverable sign-offs, invoices, and strategy scheduling.

---

### 3. Serverless Cloud Database Architecture (Neon PostgreSQL)
- **Driver:** `@neondatabase/serverless` (v0.10.4) with sub-10ms connection pooling.
- **Dual-Mode Bridge:** Automatically falls back to in-memory/local storage bridge when `DATABASE_URL` is empty, ensuring zero runtime crashes.
- **Schema & DDL Tables:**
  - `clients`
  - `opportunities`
  - `projects`
  - `tasks`
  - `invoices`
  - `bookings`
  - `proposals`
  - `contracts`
  - `activity_logs`
- **Endpoints:**
  - `GET /api/db/init`: Health check, provider detection, latency probe.
  - `POST /api/db/init`: Automated idempotent DDL schema migration and demo seed execution.
  - `GET /api/overview`: Aggregated agency metrics.
  - `POST /api/brief`: Inbound brief intake, automatic quote calculation, and dual-write ingestion.
