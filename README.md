# prelegal-demo
This is for some prelegal documents. This is test commit

**Status:** 🚧 In progress — expected to be completed in 1 week.

---

## Doc Review

**Questions / clarifications**

- What does this project actually do? The repo contains a curated set of 12 legal document templates (`templates/`, cataloged in `catalog.json`) and a working Next.js "Mutual NDA Creator" prototype (`frontend/`) that fills in the Mutual NDA template and lets a user download or print it. None of that is mentioned — a reader landing here has no idea what "prelegal documents" means in practice.
- Is `backend/` (FastAPI, currently just a health-check stub) meant to grow into something the frontend calls, or is it a scaffold left over from an earlier plan? Worth a one-line note either way so contributors don't wonder if it's dead code.
- Is the "expected to be completed in 1 week" status still accurate? It was committed several months before the most recent work (`Fix NDA form layout...`), with no date attached, so there's no way to tell if it's current or stale.
- Is there a target audience/use case (internal tool, OSS starter kit, demo for a specific team)? That would shape how much of the below is worth adding.

**Suggested additions**

- A short "What's in this repo" section: `templates/` (document library + `catalog.json`), `frontend/` (Mutual NDA Creator app), `backend/` (FastAPI stub).
- Basic run instructions for the frontend (`cd frontend && npm install && npm run dev`), since that's the only part someone can currently try.
- A link to `docs/vercel_deployment.md` for deployment — it's a solid, detailed doc but is undiscoverable from the README.
- A license mention/badge — the repo is MIT-licensed (`LICENSE`) but that's not surfaced anywhere in the README.

**Opportunities to simplify**

- The hand-maintained "expected completion" status will always drift stale (it already may have). Either drop the ETA and keep just an status label (e.g. "🚧 Prototype"), or replace it with something that doesn't need manual upkeep, like linking to open issues/milestones.
- Once the "What's in this repo" section exists, the current one-line description becomes redundant and can be folded into it rather than kept as a separate sentence.
