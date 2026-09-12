# Tooling Integrations

This project includes two repo-backed additions:

- GitNexus: code intelligence CLI/MCP for indexing the local codebase.
- UI UX Pro Max: local UI/UX design intelligence skill data and search scripts.

## GitNexus

GitNexus is installed as a dev dependency and can be run without a global install.

```bash
yarn gitnexus:analyze
yarn gitnexus:setup
```

For embeddings:

```bash
yarn gitnexus:analyze:embeddings
```

Project-level MCP configuration is available in `.codex/config.toml` and `.mcp.json`.
Run `yarn gitnexus:setup` when you want GitNexus to install Codex-specific hooks and agent context files.

The Codex-only setup uses:

- `AGENTS.md`
- `.codex/skills/gitnexus/`

The local graph database under `.gitnexus/` is intentionally ignored by git.

Source: https://github.com/abhigyanpatwari/GitNexus
License note: the npm package declares `PolyForm-Noncommercial-1.0.0`.

## UI UX Pro Max

The skill is vendored under:

```text
.agents/skills/ui-ux-pro-max
```

Useful commands:

```bash
yarn uiux:design-system
yarn uiux:nuxt
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "focus states buttons" --domain ux
```

Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
License: MIT, included at `.agents/skills/ui-ux-pro-max/LICENSE`.

## Static Nuxt Build

Generate the static site with:

```bash
yarn generate
```

Nuxt writes the deployable static output to `.output/public`.
