# Deploying the frontend to Vercel

This repo is a monorepo: the Next.js app lives in `frontend/`, but it reads
`templates/Mutual-NDA.md` from the repo root at build/render time
(`frontend/app/page.tsx`). Vercel's monorepo support isolates the build to
the configured Root Directory by default, so that cross-directory read has
to be explicitly allowed — see step 4 below. Skipping it is the most common
way this deployment breaks.

## Prerequisites

- A [Vercel](https://vercel.com) account.
- This repository pushed to GitHub (or GitLab/Bitbucket) with the Vercel
  account connected to it.
- The branch you deploy must include both `frontend/` and `templates/`.
  At the time of writing, `templates/` only exists on the
  `kan-4-legal-template-dataset` branch (PR #3) — deploy that branch, or
  `main` once PR #3 has merged.

## Option A: Deploy via the Vercel dashboard

1. **Import the project**
   - Go to [vercel.com/new](https://vercel.com/new) and select this GitHub
     repository.
2. **Set the Root Directory**
   - In the import screen (or later under **Settings → General → Root
     Directory**), set it to `frontend`.
   - Framework Preset should auto-detect as **Next.js**.
3. **Leave build settings at their defaults**
   - Build Command: `next build` (or `npm run build`)
   - Output Directory: default (`.next`)
   - Install Command: default (`npm install`)
4. **Allow access to files outside the Root Directory**
   - Still under **Settings → General → Root Directory**, enable
     **"Include source files outside of the Root Directory in the Build
     Step"**. This lets the build reach `../templates/Mutual-NDA.md` from
     inside `frontend/`.
   - Without this, the build/render fails with something like
     `ENOENT: no such file or directory, open '.../templates/Mutual-NDA.md'`.
5. **No environment variables are required** for the current prototype.
6. **Deploy**
   - Click **Deploy**. Vercel will install dependencies, run `next build`,
     and give you a preview URL (e.g. `https://<project>-<hash>.vercel.app`).
7. **Verify**
   - Open the deployment URL and confirm the "Mutual NDA Creator" form
     loads and the **Generate NDA** button produces a preview.

## Option B: Deploy via the Vercel CLI

```bash
npm install -g vercel

cd frontend
vercel login
vercel link
```

When `vercel link`/`vercel` first prompts for project settings, confirm:

- **Root Directory**: `frontend` (already implied by running from that dir,
  but confirm it in the generated `.vercel/project.json` or dashboard)
- Enable **"Include source files outside of the Root Directory"** in the
  project's dashboard settings (this isn't exposed as a CLI prompt).

Then deploy:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Subsequent deploys

- Every push to a branch creates a Preview Deployment; pushes to the
  Production Branch (`main` by default, configurable under **Settings →
  Git**) create a Production Deployment.
- Every PR from this repo gets its own preview URL, which Vercel posts as a
  PR check/comment.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Build fails with `ENOENT ... templates/Mutual-NDA.md` | "Include source files outside of the Root Directory" is disabled, or the deployed branch doesn't have `templates/` merged in | Enable the setting in step 4; confirm the branch includes `templates/Mutual-NDA.md` |
| 404 on the deployed root page | Root Directory isn't set to `frontend` | Set Root Directory to `frontend` under Settings → General |
| Stale UI after a push | Vercel is still building, or the browser cached an old deployment | Check the Deployments tab for build status; hard-refresh |
