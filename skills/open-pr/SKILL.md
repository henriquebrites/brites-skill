---
name: open-pr
description: Open a pull request on GitHub for the current branch using the gh CLI. Derives a Conventional Commits-style title and a description grounded in the actual diff and commit history. Works on any project. Use when the user says "open a PR", "create a PR", "abrir PR", "abre o PR", "submit my changes". Do NOT use this to review PR content quality (use a code-review skill) or to write a plain commit message (use a commit-message skill).
license: MIT
metadata:
  author: Henrique Brites
  version: 1.0.0
---

# Open PR

Turns the current branch into a pull request against the base branch (default `main`) using `gh`, with a title and description grounded in the actual diff and commit history — never placeholder text.

## Instructions

### Step 1: Check prerequisites

Run `gh auth status`. If not authenticated, tell the user to run `gh auth login` and stop.

### Step 2: Gather context

Base branch is `main` unless the user names another one.

```bash
git fetch origin
git log --format="%h %s" origin/{base}...HEAD   # commits ahead of base
git diff origin/{base}...HEAD                   # the actual diff
gh pr view --json url,title 2>/dev/null          # existing PR?
```

Validation: if a PR already exists, show its URL and stop — don't duplicate. If there are no commits ahead of base, say so and stop.

### Step 3: Derive the title

Conventional Commits format, `type(scope): description`, lowercase, imperative mood, no trailing period, ≤72 chars. If the project has its own commit convention or skill (e.g. a `commit-message` skill), follow that instead. Base it on the dominant change across all commits, not just the last one — then confirm it with the user before moving on.

### Step 4: Write the description

If `.github/PULL_REQUEST_TEMPLATE.md` exists, read it fresh and fill in its sections using the real diff. Otherwise use **Description** (2–4 sentences on what changed and why, grounded in the real diff, not a restated file list) and **Related issue** (leave blank if none). Title in English; description in whatever language the user has been using.

### Step 5: Confirm and create

Present the title and description to the user for confirmation — use `AskUserQuestion` if there's any ambiguity about either — then:

```bash
gh pr create --title "{title}" --base "{base}" --body "$(cat <<'EOF'
{description}
EOF
)"
```

Print the returned PR URL.

## Examples

### Example 1: Feature branch, no template

User says: "open a PR"
Actions: base is `main`, 4 commits ahead adding a rate limiter; no `PULL_REQUEST_TEMPLATE.md` exists.
Result: title `feat(api): add rate limiter to public endpoints`, a 3-sentence description grounded in the diff, PR created and URL printed.

### Example 2: Repo has its own PR template

User says: "abrir PR"
Actions: `.github/PULL_REQUEST_TEMPLATE.md` exists with `## Summary` and `## Testing` sections; the diff shows a bug fix in the checkout flow.
Result: template read fresh, both sections filled from the real diff, PR created with an English title and a Portuguese description.

### Example 3: PR already exists

User says: "create a PR for this branch"
Actions: `gh pr view` returns an existing open PR.
Result: show its URL and stop — no duplicate PR created.

## Troubleshooting

### PR already open

Show its URL, don't duplicate.

### `gh` not installed

Tell the user to run `brew install gh` or visit https://github.com/cli/cli.

### No commits ahead of base

Nothing to do — say so and stop.

### Merge conflicts against base

Tell the user to resolve with `git merge origin/{base}` first.
