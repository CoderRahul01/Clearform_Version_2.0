# Backend Handoff — Clearform v2 (Frontend)

This document is for the **backend team**: what exists today, what the UI expects, and what to implement first.

---

## Current state (frontend)

| Layer | Today | After backend |
|-------|--------|----------------|
| Auth | Redux + local session | `POST /auth/sign-in`, JWT in `Authorization` header |
| Forms list | `localStorage` + Redux (`formsSlice`) | `GET /forms` |
| Builder draft | `writeBuilderDraft` / `readBuilderDraft` | `PUT /forms/:id/builder-snapshot` |
| Publish | `writePublishedForm` + Redux `status: 'live'` | `POST /forms/:id/publish` |
| Public respondent | `readPublishedForm` | `GET /forms/:id/published` (or CDN JSON) |
| Responses | `formResponsesStorage` | `GET/POST /forms/:id/responses` |
| Workspaces | `workspacesStorage` | `GET/POST/PATCH/DELETE /workspaces` |
| Templates | Static catalog + `fetchTemplates` stub | `GET /templates` |
| Analytics | **Demo / sample data in components** | Real aggregates + time series |
| AI logic | Local stub when no API; **`logicService` wired** when `VITE_API_BASE_URL` set | `POST /forms/:id/logic/generate` |
| Response quality | Frontend heuristics (builder preview only) | `POST /forms/:id/response-quality/evaluate` (proposed) |
| Notifications | `notificationsStorage` | `GET /notifications` |

Frontend API scaffolding (ready to wire):

- `src/api/client.js` — `fetch` wrapper, `ApiError`, Bearer token from `sessionStorage['clearform:auth-token']`
- `src/api/endpoints.js` — path map (includes response-quality routes)
- `src/api/services/formsService.js` — falls back to localStorage when `VITE_API_BASE_URL` is empty
- `src/api/services/analyticsService.js` — includes `fetchCompareAnalytics`
- `src/api/services/logicService.js` — **called from Form Builder when API configured**
- `src/config/env.js` — `VITE_API_BASE_URL`, `VITE_USE_MOCK_API`
- `.env.example`

Set in deployment:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_USE_MOCK_API=false
```

Run handoff audit before release: `npm run audit:handoff`

---

## Routing contract (verified)

| Flow | Destination | Notes |
|------|-------------|--------|
| **Sign-up success** | `/onboarding` | Dispatches `startOnboarding()`, resets demo forms |
| **Sign-in success** | `/dashboard` | Or `location.state.from` if user was redirected from a protected route |
| **Sign-in** | Never onboarding | `dismissOnboardingSession()` on login |
| **Onboarding skip** | `/dashboard` | `completeOnboarding()` |
| **Onboarding publish → Home** | `/dashboard` | `completeOnboarding()` when `fromOnboarding` |
| **Guest route while authed** | `/onboarding` if onboarding active, else `/dashboard` | `GuestOnly.jsx` |
| **Unauthenticated protected route** | `/signin` with `state.from` | `RequireAuth.jsx` |

Implementation: `src/features/onboarding/utils/authOnboarding.js`, `src/routes/AppRoutes.jsx`

---

## Browser tab metadata

- **Favicon:** `public/favicon.png` (Clearform C mark)
- **Default title:** `Clearform` in `index.html`
- **Dynamic titles:** `src/constants/pageTitles.js` + `src/hooks/usePageTitle.js` — e.g. `Dashboard · Clearform`, `Analytics · Clearform`, `{formTitle} · Clearform` on builder/public routes

Backend SSR (if added later) should follow the same `{Page} · Clearform` pattern.

---

## Priority 1 — Core product

### 1. Auth

| Method | Path | Notes |
|--------|------|--------|
| POST | `/auth/sign-up` | email, password, name |
| POST | `/auth/sign-in` | returns `{ token, user }` |
| POST | `/auth/sign-out` | invalidate session |
| GET | `/auth/me` | current user profile |

Frontend stores token: `sessionStorage.setItem('clearform:auth-token', token)` (already read in `apiClient`).

**Stubs (no backend yet):** Google/Microsoft OAuth buttons, forgot-password link on sign-in.

### 2. Forms CRUD

| Method | Path | Body / response |
|--------|------|------------------|
| GET | `/forms` | `[{ id, title, status, workspace, responses, timeAgo, builderSnapshot?, ... }]` |
| GET | `/forms/:id` | single form meta |
| POST | `/forms` | create blank or from `templateId` |
| PATCH | `/forms/:id` | title, workspace, status |
| DELETE | `/forms/:id` | soft delete or archive |

### 3. Builder snapshot (draft)

| Method | Path | Body |
|--------|------|------|
| GET | `/forms/:id/builder-snapshot` | — |
| PUT | `/forms/:id/builder-snapshot` | see **Snapshot schema** below |

Frontend auto-saves every ~1s while editing (debounced in `FormBuilderPage.jsx`). Today uses `writeBuilderDraft` directly; swap to `formsService.saveBuilderSnapshot` when API is live.

### 4. Publish

| Method | Path | Body |
|--------|------|------|
| POST | `/forms/:id/publish` | same snapshot shape as draft |
| GET | `/forms/:id/published` | public respondent payload (no auth) |

Published JSON is what `PublicFormPage` and `/f/:formId` consume.

---

## Snapshot schema (builder + publish)

Produced by `buildPublishSnapshot()` in `src/features/forms/utils/buildPublishSnapshot.js`:

```json
{
  "version": 1,
  "formId": 123,
  "templateId": "optional",
  "formTitle": "My Form",
  "screens": [],
  "nextId": 100,
  "intro": { "title", "description", "buttonText", "textSize", "alignment" },
  "end": { "title", "description", "buttonText" },
  "logicConnections": [{ "from": 1, "to": 2, "kind": "next" }],
  "logicIfRulesByEdge": { "1-2": { "rules": [], "elseScreenId": null } },
  "logicMeta": {
    "logicModeManual": true,
    "logicCardOffsets": {},
    "aiLogicGenStatus": "idle"
  },
  "theme": {},
  "settings": {},
  "savedAt": 1710000000000
}
```

Per-screen config includes response-quality flags (`longTextResponseQualityEnabled`, `shortTextResponseQualityOptions`, etc.) via `screenConfigSync.js`.

**Logic engine (respondent runtime):** `src/features/forms/utils/logicEngine.js` — backend does not need to reimplement; store snapshot as-is.

---

## Priority 2 — Responses & analytics

### Responses

| Method | Path |
|--------|------|
| GET | `/forms/:formId/responses?page=1&range=` |
| GET | `/forms/:formId/responses/:responseId` |
| POST | `/forms/:formId/responses` | public submit (no auth) |
| GET | `/forms/:formId/responses/export?format=csv` |

### Analytics (replace demo data)

| Method | Path | Used by |
|--------|------|---------|
| GET | `/analytics/forms/:formId/performance?range=` | Performance tab |
| GET | `/analytics/forms/:formId/responses?range=` | Responses tab |
| GET | `/analytics/forms/:formId/compare?range=` | Compare tab |
| POST | `/analytics/forms/:formId/ai-insights` | AI Insights tab |

Until these exist, the UI shows **sample series** and an Analytics **“Sample data”** badge.

---

## Priority 2.5 — AI integration

### A. Form Builder AI Logic

**Endpoint:** `POST /forms/:formId/logic/generate`

**Purpose:** Generate branching connections and if/then rules from form structure. Respondent navigation uses the stored snapshot only — backend does not execute logic at submit time.

**Frontend wiring:** When `VITE_API_BASE_URL` is set, `FormBuilderPage.jsx` calls `logicService.generateFormLogic(formId, context)` via `runAiLogicGeneration`. Otherwise uses local stub (`buildLocalAiLogicSuggestion`).

**Request body:**

```json
{
  "screens": [{ "id": 1, "label": "...", "type": "...", "config": {} }],
  "contentScreens": [{ "id": 2, "label": "Question 1", "fields": [] }],
  "formTitle": "optional"
}
```

**Response** (normalized by `applyAiLogicResult.js`; snake_case aliases accepted):

```json
{
  "connections": [{ "from": 1, "to": 2, "kind": "next" | "if" | "end" }],
  "ifRulesByEdge": {
    "1-2": {
      "rules": [{ "id": "...", "thenScreenId": 3, "conditions": [{ "sourceScreenId": 2, "fieldId": "...", "operator": "equals", "value": "..." }] }],
      "elseScreenId": 4
    }
  },
  "showIfByScreenId": {}
}
```

**Backend requirements:**

- Analyze screen graph + field types from `logicFieldCatalog.jsx`
- Return at least one valid connection or 422 with message
- Rate limit (UI default error copy references HTTP 429)

---

### B. Response Quality AI

**Current state:** Rule-based heuristics in `responseQualityScoring.js` (“Dummy … no AI”). Works in **builder preview only**; not on live `PublicFormPage` yet.

**Config in snapshot** per screen: `longTextResponseQualityEnabled`, `longTextResponseQualityOptions`, `shortTextResponseQuality*`.

**Options shape:**

```json
{
  "minWords": 10,
  "sensitivity": "Low" | "Medium" | "High",
  "vagueWords": "good, fine, okay",
  "topicKeywords": "experience, product",
  "keywordThreshold": 1,
  "criteria": ["length", "specificity", "relevance", "completeness"]
}
```

**Proposed endpoints** (defined in `endpoints.js`):

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/forms/:formId/response-quality/evaluate` | Real-time scoring while respondent types |
| GET | `/analytics/forms/:formId/response-quality` | Aggregate “high quality %” for compare tab |

**Evaluate request:**

```json
{
  "screenId": 3,
  "fieldId": "long-text-1",
  "text": "user answer...",
  "options": { "minWords": 10, "criteria": ["length", "specificity"] }
}
```

**Evaluate response:**

```json
{
  "level": "green" | "amber" | "red",
  "message": "Human-readable nudge",
  "failedIds": ["length", "specificity"]
}
```

---

### C. Analytics AI modules

**Endpoint:** `POST /analytics/forms/:formId/ai-insights`

**UI:** `AnalyticsAiInsightsPanel.jsx` — mock until API returns data (simulated 1.8s load today).

**Modules backend should populate:**

| Module | Frontend file | Payload fields |
|--------|---------------|----------------|
| AI Summary + NPS | `AnalyticsAiInsightsPanel.jsx` | `summaryText`, `npsScore`, sentiment |
| Priority Focus | same | `priorityTitle`, `priorityBody`, `impactEstimate` |
| Top Patterns | `TOP_PATTERNS` constant | `[{ percent, label, tag, description, examples[] }]` |
| Quick Stats | `aiInsights/quickStatsData.js` | 7-day counts, sentiment split |
| Recommended Actions | `aiInsights/recommendedActionsData.js` | `[{ title, description, priority, actionType }]` |
| Seven-day chart | `aiInsights/SevenDayTrendChart.jsx` | time series from quick stats |

**Gates (frontend-enforced):** min 10 responses for AI insights; min 25 for reliable Top Patterns.

**Request body:** `{ "range": "7d" | "30d" | "90d" | "all" }`

---

## Priority 3 — Workspaces, templates

| Area | Path | Notes |
|------|------|--------|
| Workspaces | `/workspaces` | id, label, color, count |
| Templates | `/templates` | match `TEMPLATE_CATALOG` shape in frontend |

---

## Priority 4 — Billing / profile (placeholders)

- Razorpay checkout is UI placeholder (`RazorpayCheckoutPlaceholder.jsx`)
- Profile billing tab uses computed usage from Redux + localStorage
- **Demo toasts (expected until backend):** account deletion, password reset email, third-party integration config — see ProfilePage, ProfileSecurityPanel, ProfileIntegrationsPanel

---

## Migration checklist (frontend will do when API is ready)

1. Replace `readPersistedForms` bootstrap in `formsSlice` with `formsService.listForms()` on app load.
2. Replace `writeBuilderDraft` / `readBuilderDraft` calls with `formsService.saveBuilderSnapshot` / `getBuilderSnapshot`.
3. Replace `writePublishedForm` in `handlePublishForm` with `formsService.publishForm`.
4. ~~Point `runAiLogicGeneration` to `logicService.generateFormLogic` when `isApiConfigured()`.~~ **Done.**
5. Swap analytics panels to `analyticsService.*` and remove demo constants.
6. Wire `PublicFormPage` to `responseQuality` evaluate endpoint when configured.
7. Add error toasts on `ApiError` (status 401 → sign out).

---

## Questions for product/backend

1. Public form URL: subdomain per form vs path `/f/:id`?
2. Snapshot versioning / conflict if two tabs edit same form?
3. File uploads (images, uploads): S3 presigned URLs?
4. Rate limits on AI logic + AI insights + response-quality endpoints?

---

## Contact / code pointers

| Topic | File |
|-------|------|
| Routing / auth navigation | `authOnboarding.js`, `AppRoutes.jsx` |
| Page titles | `pageTitles.js`, `usePageTitle.js` |
| Publish pipeline | `FormBuilderPage.jsx` → `handlePublishForm` |
| Readiness rules | `formPublishReadiness.js` |
| Respondent logic | `logicEngine.js`, `PublicFormPage.jsx` |
| AI logic apply | `applyAiLogicResult.js`, `aiLogicGeneration.js` |
| Response quality (client) | `responseQualityScoring.js` |
| Analytics AI UI | `AnalyticsAiInsightsPanel.jsx` |
| API facades | `src/api/services/*` |
| Endpoint list | `src/api/endpoints.js` |
| Handoff audit script | `scripts/audit-handoff.mjs` |
