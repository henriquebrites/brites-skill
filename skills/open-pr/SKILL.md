---
name: open-pr
description: Open a pull request on GitHub for the current branch using the gh CLI. Derives a Conventional Commits-style title and a description grounded in the actual diff and commit history. Works on any project. Use when the user says "open a PR", "create a PR", "abrir PR", "abre o PR", "submit my changes". Do NOT use this to review PR content quality (use a code-review skill) or to write a plain commit message (use a commit-message skill).
---

# Open PR

Turns the current branch into a pull request against the base branch (default `main`) using `gh`,
with a title and description grounded in the actual diff — not placeholder text.

## Steps

1. **Check prerequisites**: run `gh auth status`; if not authenticated, tell the user to run
   `gh auth login` and stop.

2. **Gather context**. Base branch is `main` unless the user names another one.

   ```bash
   git fetch origin
   git log --format="%h %s" origin/{base}...HEAD   # commits ahead of base
   git diff origin/{base}...HEAD                   # the actual diff
   gh pr view --json url,title 2>/dev/null          # existing PR?
   ```

   If a PR already exists, show its URL and stop. If there are no commits ahead of base, say so
   and stop.

3. **Derive the title**: Conventional Commits format, `type(scope): description`, lowercase,
   imperative mood, no trailing period, ≤ 72 chars. If the project has its own commit convention
   or skill, follow that instead. Base it on the dominant change across all commits, not just the
   last one. Confirm with the user.

4. **Write the description from the diff.** If `.github/PULL_REQUEST_TEMPLATE.md` exists, read it
   fresh and fill in its sections. Otherwise use: **Description** (2–4 sentences on what changed
   and why, grounded in the real diff, not a restated file list) and **Related issue** (leave
   blank if none). Title in English; description in whatever language the user's been using.

5. **Confirm and create**:

   ```bash
   gh pr create --title "{title}" --base "{base}" --body "$(cat <<'EOF'
   {description}
   EOF
   )"
   ```

   Print the returned PR URL.

## Edge cases

- **PR already open** → show its URL, don't duplicate.
- **`gh` not installed** → `brew install gh` or https://github.com/cli/cli.
- **No commits ahead of base** → nothing to do, stop.
- **Merge conflicts against base** → tell the user to resolve with `git merge origin/{base}` first.
