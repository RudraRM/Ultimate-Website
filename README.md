# Briefly

A polished, responsive frontend for an agency project-planning product. Briefly turns a client brief into extracted requirements, a six-stage delivery checklist, timeline targets, and questions to resolve before work begins.

## Run locally

Requires Node.js 22.12+ (Node.js 24 recommended) and npm.

```sh
npm ci
npm run dev
```

## Production frontend

```sh
npm test
npm run build
npm run preview
```

The build produces **`dist/index.html`**, a standalone HTML file with embedded JavaScript, compiled Tailwind CSS, React, and Framer Motion. There are no external CDN scripts, remote fonts, API keys, or image requests. Serve `dist/` over HTTPS with any static host. For consistent browser storage, use a web server rather than a `file://` URL.

The editable implementation is in `src/main.jsx`, `src/styles.css`, and `src/engine.js`. `index.html` is the development entry. `package-lock.json` locks the dependency versions.

## Included

- Landing page: header, prompt-bar hero, animated product-stat counters, six feature cards, technology badges, six-step walkthrough, Free / Pro / Plus pricing, and a resource/legal footer.
- Original sage-green, off-white aesthetic inspired by the information hierarchy and terminal motif at https://uupm.cc/. No copied text, branding, or proprietary assets.
- Actual Framer Motion entrance animations, tab transitions, live counters, notifications, and reduced-motion support.
- Simulated sign-in with a display name. No passwords or personal contact details are requested.
- Main Board: charts from actual local project activity, live completion metrics, milestone checklists, and a central action panel.
- Feature Studio: four templates, input validation, scoped text extraction, six scheduled milestones, and missing-context questions.
- Analytics / History: searchable and filterable history, project details, Markdown / JSON exports, and line/bar chart selection.
- Account Billing: preview plan selection, transparent proposed pricing, confirmation dialogs, and local data deletion.
- Responsive navigation, accessible dialog focus behavior, semantic tables, labeled controls, SVG icons, visible focus rings, and live status messages.

## Scope and limitations

This is a complete **frontend preview**, matching the request for mocked dashboard login and subscription UI. It is not an operating paid SaaS service.

- Sign-in is simulated. Session storage remembers the display name for this tab; it provides no secure authentication or authorization.
- Project records live in localStorage in the current browser profile. They are not synced, encrypted, or protected from others using that profile. Export important plans. Clearing site data removes them.
- Plan generation is deterministic and local. It uses project-type templates and basic sentence matching, not a hosted AI model. Review every generated plan.
- The Free preview allows three saved projects. All preview data has a practical 200-project cap; this is disclosed when reached. The displayed paid plan capacities and services describe the proposed product, not current backend entitlements.
- Billing selection is simulated. No payments, active subscriptions, refunds, real API access, team permissions, community support service, or external integrations are implemented.
- The landing workspace snapshot is explicitly marked as an example. Dashboard metrics come from the projects the user actually creates. Marketing counters describe shipped frontend capabilities, not customer counts.
- Footer terms/privacy/refund content documents the preview only; launch policies need an operator's real service details.

## Product and monetization concept

**Customer:** small creative agencies, independent studios, and freelancers.

**Pain point:** unstructured client requests lead to unclear scope, forgotten deliverables, and slow handoffs.

**Value proposition:** one structured starting point for a project, with clear next actions and portable outputs.

| Proposed plan | Monthly price | Intended commercial offering |
| --- | ---: | --- |
| Free | $0 | Basic planning, restricted capacity, community support |
| Pro | $49 | Advanced workflows, API access, priority support |
| Plus | $149 | Unlimited project capacity, team controls, dedicated support |

For scale illustration only, **100 Pro subscribers + 35 Plus subscribers = $10,115 in monthly gross revenue**. This is arithmetic, not a sales forecast or a profit claim. It excludes payment fees, hosting, AI costs, support, taxes, acquisition costs, churn, and discounts. Profitability and willingness to pay have not been validated.

Before charging, interview target agencies, validate that this workflow saves meaningful time, and run a pilot with actual client projects. Differentiation should come from workflow quality, reliable client review, and repeatable agency templates rather than generic AI claims.

## Required before a paid launch

1. Add verified identity, server sessions, workspace authorization, and secure account recovery.
2. Replace browser-only data with a database, tenant isolation, backups, and retention/deletion controls.
3. If AI generation is added, call it through a server with protected keys, input limits, retries, rate limits, and usage accounting.
4. Implement billing checkout, signed webhooks, idempotent subscription updates, customer billing management, and server-side entitlements.
5. Implement and test the paid API, team controls, and promised support operations before advertising them as available.
6. Publish real operating policies and add monitoring and error reporting with appropriate privacy choices.

## Validation

`npm test` covers meaningful project-engine behavior: input rejection, missing-context detection, faithful exports, corrupt storage handling, and accurate chart aggregation. `npm run build` verifies the production bundle. Browser visual and interaction QA could not run in the build environment because the local browser binary was unavailable and the connected cloud browser blocked access to localhost. Before release, check the create → complete → export → reload flow at desktop and mobile sizes, plus keyboard navigation and reduced-motion settings.
