# Directory Rules

## Core Principle

Each feature is self-contained.
UI and logic must be separated.
Structure must be predictable.

---

## Top Level

app/<feature>/
shared/
components/ui/
Docs/

---

## Feature Structure

<feature>/

components/ <feature>UI/ <feature>Service/

hooks/

context/

context.md

types/

page.tsx

layout.tsx (optional)

subroutes/ (optional)

---

## UI

components/<feature>UI/

Only UI.
No API calls.
No business logic.

---

## Logic

components/<feature>Service/
hooks/
context/

Contains:
API calls
state
logic
transformations

No UI code.

---

## context.md

Required in every feature.
Describes scope and boundaries.

---

## Shared

shared/
components/
hooks/
lib/
types/
utils/

Reusable only.
No feature specific logic.

---

## Types

Each feature defines its own types.

shared/types for global types.

---

## Routing

page.tsx = entry

[id]/page.tsx = dynamic route

create/page.tsx
edit/[id]/page.tsx

Routes stay inside feature.

---

## Naming

feature folders = domain name

<feature>UI <feature>Service

Clear descriptive file names.

---

## Rules

No cross feature imports.
Use shared modules for reuse.

UI never calls API directly.

Service never contains UI.

Each feature must include context.md.

Keep structure consistent.

Do not mix responsibilities.
