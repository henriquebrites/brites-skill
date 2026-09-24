# brites-skill

Personal collection of [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) for
Claude Code and Cursor, published as an installable npm CLI and as a Claude Code plugin.

## Skills

| Skill                                          | Description                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`commit-message`](skills/commit-message/SKILL.md) | Generates a Conventional Commits-style commit message grounded in the actual staged diff.   |
| [`open-pr`](skills/open-pr/SKILL.md)               | Opens a GitHub pull request via `gh`, with a title and description derived from the real diff. |

Each skill lives in its own folder under [`skills/`](skills/), the single source of truth used both
by this repo itself (via symlinks in `.claude/skills` and `.cursor/skills`) and by the published
package.

## Install in another project

### Option A — npm CLI

```bash
npx brites-skill install
```

Installs every skill into both `.claude/skills/` and `.cursor/skills/` of the current directory.

Useful flags:

```bash
npx brites-skill list                              # see what's available
npx brites-skill install -s open-pr                 # install a single skill
npx brites-skill install -a claude                  # only for Claude Code
npx brites-skill install -a cursor                   # only for Cursor
npx brites-skill install -g                          # install globally (~/.claude, ~/.cursor)
```

### Option B — Claude Code plugin marketplace

No npm/Node required:

```
/plugin marketplace add henriquebrites/brites-skill
/plugin install brites-skill
```

## Development & release workflow

This repo has **two independent steps**: committing changes (which just updates GitHub) and
releasing (which publishes a new version to npm). Pushing commits to `main` never publishes
anything by itself — only pushing a `vX.Y.Z` tag does.

### 1. Add or change a skill

```bash
# new skill
mkdir skills/my-new-skill
# ...write skills/my-new-skill/SKILL.md

# or edit an existing one
node bin/cli.js list                # sanity-check the manifest still parses
node bin/cli.js install -a claude   # test-install locally into .claude/skills
```

### 2. Commit and push as usual

```bash
git add skills/my-new-skill
git commit -m "feat: add my-new-skill skill"
git push
```

At this point the change is on GitHub, but **the npm package has not changed** — anyone running
`npx brites-skill install` still gets the previous published version.

### 3. Release (this is the step that actually publishes)

```bash
npm version patch   # or minor / major — bumps package.json AND creates git tag vX.Y.Z
git push --follow-tags
```

- Use `patch` for fixes/tweaks to an existing skill, `minor` when adding a new skill, `major` for
  breaking changes (e.g. renaming/removing a skill or changing the CLI's flags).
- `npm version` is the step people forget — without it there is no new tag, and
  `git push --follow-tags` silently has nothing new to push. If you push commits and nothing
  publishes, this is almost always why: check `git tag -l` and `package.json`'s `version` to
  confirm a new tag actually exists locally before pushing.
- Pushing the `vX.Y.Z` tag triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml),
  which checks out the tagged commit, verifies the tag matches `package.json`'s version, and runs
  `npm publish --provenance` using npm's [Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
  (OIDC) — no `NPM_TOKEN` secret involved, no manual OTP.
- Track the run with `gh run list --workflow=publish.yml`. The registry can take a minute or two to
  show the new version after the workflow succeeds (`npm view brites-skill versions`).

## License

MIT
