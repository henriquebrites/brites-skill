---
name: roadmap-docs
description: 'Keeps a human-readable roadmap in docs/roadmap/: one timestamped file per initiative, with an epic on top (goal, out of scope, key decisions) and small checkbox tasks below, to feed tlc-discover, tlc-plan, tlc-implement, tlc-spec-lean or tlc-spec-driven one task at a time. Use when the user says "create a roadmap", "break this into tasks", "add a task to the roadmap", "what is left on the roadmap", "mark this roadmap task as done", "next roadmap task", "cria o roadmap", "quebra essa demanda em tarefas", "anota essa tarefa no roadmap", "o que falta pra migração?", "marca essa tarefa como feita", or before starting any discover, plan, implement cycle on a large demand. Also use for loose phrases like "anota essa tarefa" or "marca isso como feito" when a docs/roadmap/ folder exists. Do NOT use to design a feature (use tlc-discover), write task specs (use tlc-plan), implement code (use tlc-implement), write a technical design doc (use create-technical-design-doc), or manage Jira or Linear tickets.'
license: CC-BY-4.0
metadata:
  version: '1.0.0'
  author: Henrique Brites
---

# Roadmap Docs

The roadmap records **what and why**, written for a human to read. The **how** lives in the artifacts of the downstream flow (discover, plan, implement, spec). This skill only maintains the roadmap: it never starts a downstream skill unless the user asks.

Write the roadmap content in the language the user is writing in. Keep the section headings below as they are, so tools and people find them by name.

## Layout

- One file per initiative in `docs/roadmap/`; create the folder if missing.
- File name: `YYYY-MM-DD-HH-mm-slug.md`. The prefix is the **creation** time (local); generate it with `date +%Y-%m-%d-%H-%M`, never invent it. The slug is short, lowercase, no accents, hyphen-separated.
- **Never rename or move** a file after creation: order and links depend on the name.

## File format

```md
# <Initiative name>

**Status:** Planned | In progress | Done

## Epic

<2-5 lines: the goal and why it matters. No technical detail.>

**Out of scope:** <what this initiative deliberately does not do>
**Key decisions:** <only decisions already made that shape the tasks; omit if none>

## Tasks

- [ ] **T1 - Small, verifiable outcome.** One line saying what the user or system can do when this is done.
- [ ] **T2 - ...** (after T1)
- [ ] **T3 - ...** (after T1, T2)

## Notes

<Links to discover/plan/implement artifacts, and scope changes with date. Omit if empty.>
```

Task rules:

- **Outcome, not layer.** "Users can pay an invoice" is a task; "create the invoices table" is not.
- **Stable IDs.** T1, T2, ... are never reused or renumbered; a removed task is struck through (`~~T4 ...~~`), not deleted.
- **Order and dependencies** are written in the task line as `(after T1)`. List tasks in the order they should be done.
- **Small.** Each task should fit one full cycle of plan then implement. If it does not, split it.

## Workflows

### Create from a large demand

1. Read what exists first: the user's description, any `.design/*.md` from tlc-discover, and `docs/roadmap/` (to avoid duplicating an initiative).
2. If the demand is still unclear (open product questions, unknown scope), say so and recommend `tlc-discover` (or an interview skill) first. Offer to draft a roadmap anyway, marking uncertain tasks with `(needs discover)`.
3. Inspect the code only as far as needed to cut tasks that match reality. Do not invent tasks for things you did not verify.
4. Draft the epic and tasks, then **show the draft in chat and wait for approval** before writing the file. The user wants to see everything before implementation starts.
5. Write the file and report its path.

### Add a task

Every new task enters the roadmap **before** being worked on. Add it to the matching initiative with the next free ID, or create a new initiative file if none fits. If it is ambiguous which initiative owns it, ask.

### Complete a task

Change `[ ]` to `[x]`. On the first completed task, set Status to `In progress`; on the last, `Done`. Never delete or move the file. Only mark a task done when the user confirms it, or the implement step reported it verified.

### Scope changed

If discover, plan or implement reveals that a task is bigger or different, update the file right away (split, rewrite, add) and note the change with its date under Notes.

### Query

- **Status:** read `docs/roadmap/` in name order and summarize each initiative in one line: name, status, `x/y` tasks done.
- **Next task:** the first `[ ]` whose dependencies are done, in the oldest `In progress` initiative; if none, the oldest `Planned`. Suggest it and confirm before starting.

## Handing a task to the next skill

When the user picks a task, suggest the flow that fits it, without starting it:

| Task profile                                                | Suggested flow                                        |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| Small or medium, clear outcome                              | `tlc-spec-lean`                                       |
| Large, wants spec, design and task breakdown                | `tlc-spec-driven`                                     |
| Costly-to-reverse decisions (schema, migration, public API) | `tlc-discover`, then `tlc-plan`, then `tlc-implement` |

Pass the task line and the initiative's Epic as the source, and record the resulting artifact path under Notes.

## Examples

### Example 1: Large demand

User says: "Preciso migrar o projeto para monorepo, quebra isso em tarefas."
Actions: run `date +%Y-%m-%d-%H-%M`, read the repo layout, draft the epic and 4-6 outcome tasks in chat, wait for approval, then write `docs/roadmap/2026-10-03-00-45-monorepo.md`.
Result: a file with Status `Planned`, an Epic with out of scope, and tasks T1-T5 with dependencies. Reply: "Created docs/roadmap/2026-10-03-00-45-monorepo.md with 5 tasks."

### Example 2: Complete a task

User says: "Terminei a T2 da migração, marca como feito."
Actions: find the open initiative about the migration, change `- [ ] **T2` to `- [x] **T2`, set Status to `In progress` if T2 is the first task checked.
Result: only that line and the Status change. Reply: "Marked T2 done in docs/roadmap/2026-10-03-00-45-monorepo.md (2/5)."

### Example 3: Next task

User says: "O que falta pra migração?"
Actions: read the initiative, count checked tasks, list open ones in order.
Result: "monorepo - In progress - 2/5. Open: T3, T4, T5. Next: T3 (after T1, T2 done). Suggested flow: tlc-spec-lean. Start it?"

## Troubleshooting

- **Existing roadmap file is malformed or hand-edited:** keep the user's content, fix only what you touch, and say what you changed.
- **`docs/roadmap/` holds files without the date prefix:** leave them alone and list them in the status query.
- **User asks for a root `roadmap.md`:** this skill uses `docs/roadmap/`; follow the user's explicit path if they insist, keeping the same format.
- **Task ID not found or matches two tasks:** ask which one; never guess which line to check.
- **Two initiatives could own a new task:** ask; do not duplicate the task in both.
- **`docs/roadmap/` is not tracked or the repo is not git:** work the same, and tell the user the roadmap is not versioned.

## Finish

Reply briefly: which file was created or changed, and what changed in it.
