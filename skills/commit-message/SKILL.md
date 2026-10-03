---
name: commit-message
description: Generate a single, concise Git commit message in English following Conventional Commits, grounded in the actual staged (or unstaged) changes in the repository. Use when the user says "write a commit message", "generate a commit message", "commit this", or asks to create, review, or improve a commit message. Do NOT use to open a pull request (use open-pr) or to judge whether a diff is good code (use a code-review skill).
license: MIT
metadata:
  author: Henrique Brites
  version: 1.0.0
---

# Commit Message

Generates one Conventional Commits-style Git commit message in English, grounded in the real diff — never invented.

## Instructions

### Step 1: Gather the diff

Run `git diff --cached` to inspect staged changes. If nothing is staged, run `git diff` instead and tell the user you're using unstaged changes.
Expected output: a diff you can actually read for what changed (files, functions, behavior) — not just which files were touched.

### Step 2: Determine type and scope

Pick the smallest accurate Conventional Commits `type` and, only when it adds useful context, a short `scope` (e.g. `auth`, `api`, `database`, `user`). Base the type on what the change *does*, not which files it touches — a test-only change is `test` even if it lives under `src/`.

| Type | Use for |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation-only changes |
| `style` | Formatting/whitespace, no behavior change |
| `refactor` | Restructuring without behavior change or a fix |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or external dependency changes |
| `ci` | CI configuration or scripts |
| `chore` | Maintenance that fits no other type |
| `revert` | Reverting a previous commit |

### Step 3: Generate the message

Format: `type(scope): description`, or `type: description` without a scope. For a breaking change: `type(scope)!: description`.

- English, lowercase type and description, unless a proper noun or technical identifier requires otherwise.
- Imperative mood ("add", not "added" or "adds"); no trailing period.
- ≤150 characters total, including type, scope, and punctuation.
- No body, footer, Markdown formatting, quotation marks, or explanation — the message stands alone.
- No issue numbers unless explicitly present in context and relevant.
- Never mark `!` as breaking unless the diff clearly introduces one.
- Never invent a change, feature, fix, or intention the diff doesn't support. If the diff is too thin to tell, ask one concise clarifying question instead of guessing.

### Step 4: Validate before responding

Before showing the message, confirm: it matches `type(scope): description` (or the no-scope or breaking variant), the type fits the actual change, it's in English and under 150 characters, and the output is exactly one message — nothing else.

### Step 5: Offer to commit

Ask the user via `AskUserQuestion` whether to commit now:

- **Yes** → run `git commit -m "<message>"`, then `git status` to confirm it succeeded, and report success.
- **No** → leave the generated message as the final answer.

## Examples

### Example 1: Staged bug fix

User says: "write a commit message"
Actions: `git diff --cached` shows a null-check added in `src/auth/session.ts` that fixes a crash on expired tokens.
Result: `fix(auth): guard against expired session token`

### Example 2: Nothing staged yet

User says: "commit this"
Actions: `git diff --cached` is empty, so fall back to `git diff`, which shows a new `formatCurrency` helper added and used in two components.
Result: `feat(billing): add formatCurrency helper for invoice display` — then offer to stage and commit via Step 5.

### Example 3: Diff too thin to classify

User says: "generate a commit message"
Actions: the diff only shows a renamed variable with no other context, and it's ambiguous whether it's `refactor` or `style`.
Result: ask one clarifying question (e.g. "Is this a pure rename, or part of a larger refactor?") instead of guessing.

## Troubleshooting

### No staged or unstaged changes

Cause: the working tree is clean.
Solution: tell the user there's nothing to commit — don't fabricate a message.

### Diff spans unrelated changes

Cause: multiple unrelated changes are staged together.
Solution: describe the dominant change, and suggest the user split the commit if the changes are genuinely unrelated.
