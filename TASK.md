Créer le fichier docs/BRICKMODE.md

Full file (copy/paste). PATH: docs/BRICKMODE.md

mkdir -p docs
cat > docs/BRICKMODE.md <<'MD'
# BRICKMODE (Khashika) — Operating Manual

## Goal
Keep `main` stable, fast to ship, impossible to “accidentally break”:
- CI gates before merge
- Small PRs
- One-command sanity + ship
- Guard rails for Cursor config + docs-only branches

---

## Golden rules
1. **Never work directly on `main`** (only merge into it).
2. **One PR = one topic** (small diff, easy review, easy revert).
3. **Before pushing/merging**: run **sanity**.
4. **Only edit canonical governance files at repo root**:
   - `.cursorrules`, `.cursorignore`, `_CONTEXT.md`

---

## The 3 core commands (copy/paste)
### 1) Local gate (fast, deterministic)
```bashss
./scripts/brickmode-sanity.sh

2) Ship a branch “cleanly” (rebase + sanity + push)

Run on a feature branch only (refuses on main):

./scripts/brickmode-ship.sh

3) Cursor governance guard (root config must not drift)
./scripts/guard-cursor-config.sh
P