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

## Development

```bash
npm install
node bin/cli.js list
node bin/cli.js install -a claude   # test install locally
```

## Release process

Publishing to npm is automated via [`.github/workflows/publish.yml`](.github/workflows/publish.yml)
using npm's [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) — no `NPM_TOKEN`
secret involved. To ship a new version:

```bash
npm version patch   # or minor / major — bumps package.json and creates a git tag vX.Y.Z
git push --follow-tags
```

Pushing the `vX.Y.Z` tag triggers the workflow, which verifies the tag matches
`package.json`'s version and runs `npm publish --provenance`.

## License

MIT
