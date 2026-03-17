---
name:  push-to-github
description: Pushes code to GitHub and updates docs/github-commit.md with the new commit details.
---

When the user says "push to github", follow these steps in order:

## Step 1 — Stage & Commit
1. Run `git status` to see what has changed.
2. Stage all modified/new files relevant to the work done (avoid secrets or large binaries).
3. Write a conventional commit message (`feat:`, `fix:`, `docs:`, etc.) that accurately describes the changes.
4. Commit with the message and the co-author trailer:
   ```
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```

## Step 2 — Update docs/github-commit.md
After committing, get the new commit's short ID and full ID via:
```
git log -1 --format="%h %H %ai %s"
```

Then update `docs/github-commit.md`:

1. **Update the "Last updated" date** at the top to today's date.
2. **Add a new row** to the commit history table (increment the `#` counter):
   ```
   | N | `<shortId>` | `<fullId>` | YYYY-MM-DD HH:MM | <commit message> |
   ```
3. **Add a new Push Log section** at the top of the Push Log (below the `## Push Log` heading), following this format:
   ```markdown
   ### Push — YYYY-MM-DD HH:MM +0530
   **Commits pushed:** `<shortId>`
   **Summary:** <one-line summary of what was pushed>
   - list of key files changed
   ```

## Step 3 — Commit the docs update
Stage and commit the `docs/github-commit.md` update:
```
docs: update github-commit.md — log push <shortId>
```
Include the co-author trailer as usual.

## Step 4 — Push to GitHub
Run:
```
git push origin main
```

Confirm the push succeeded and tell the user the commit ID(s) that were pushed.
