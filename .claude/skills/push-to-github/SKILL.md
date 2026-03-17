---
name:  push-to-github
description: Pushes code to GitHub and updates docs/git-commit.html with the new commit details.
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

## Step 2 — Update docs/git-commit.html
After committing, get the new commit's short ID and full ID via:
```
git log -1 --format="%h %H %ai %s"
```

Then update `docs/git-commit.html` in **two places**:

### 2a — Add a new entry to the `commits` array
Find the `const commits = [` array near the top of the `<script>` block and append a new object **at the end**:
```js
{ n:<next_number>, short:'<shortId>', full:'<fullId>', date:'YYYY-MM-DD HH:MM', msg:'<commit message>' },
```
Increment `n` by 1 from the last entry.

### 2b — Add a new entry to the `pushLog` array (newest first)
Find the `const pushLog = [` array and **prepend** a new object at the very top of the array:
```js
{
  date: 'YYYY-MM-DD HH:MM +0530',
  commits: ['<shortId>'],
  summary: '<one-line summary of what was pushed>',
  bullets: [
    '<code>filename.html</code> — description of change',
  ]
},
```

## Step 3 — Commit the docs update
Stage and commit the `docs/git-commit.html` update:
```
docs: update git-commit.html — log push <shortId>
```
Include the co-author trailer as usual.

## Step 4 — Push to GitHub
Run:
```
git push origin main
```

Confirm the push succeeded and tell the user the commit ID(s) that were pushed.
