---
name: gitnexus
description: Use GitNexus with Codex for repository indexing, code exploration, debugging, impact analysis, refactoring, and graph/tool reference. Use when the user mentions GitNexus or asks to understand, analyze, debug, refactor, or assess impact in this codebase with the GitNexus index.
---

# GitNexus For Codex

This repository uses GitNexus as a Codex-only code intelligence workflow.

## Start Here

1. Read `gitnexus://repo/wedding-web/context` when GitNexus MCP resources are available.
2. If the index is stale or missing, run:

   ```bash
   node .gitnexus/run.cjs analyze
   ```

   If `.gitnexus/run.cjs` is missing, run:

   ```bash
   yarn gitnexus:analyze
   ```

3. Choose the relevant reference for the task:

   - CLI/index/status/wiki: `references/cli.md`
   - Architecture exploration: `references/exploring.md`
   - Debug tracing: `references/debugging.md`
   - Impact analysis: `references/impact-analysis.md`
   - Refactoring/rename workflows: `references/refactoring.md`
   - Tool/schema guide: `references/guide.md`

## Codex-Only Layout

- GitNexus skill entrypoint: `.codex/skills/gitnexus/SKILL.md`
- GitNexus skill references: `.codex/skills/gitnexus/references/`
- Agent context: `AGENTS.md`
- Local graph/cache: `.gitnexus/`

Do not create or use `.claude/` or `CLAUDE.md` for this project.
