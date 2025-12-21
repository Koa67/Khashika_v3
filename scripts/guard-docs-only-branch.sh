#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-origin/main}"
if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  BASE_REF="main"
fi

allowed_re='^(\.cursor/prompts/|.*\.(md|txt|sh)$)'

offenders=()

while IFS= read -r -d '' f; do
  [[ -z "$f" ]] && continue
  if [[ ! $f =~ $allowed_re ]]; then
    offenders+=("$f")
  fi
done < <(git diff --name-only -z "$BASE_REF"...HEAD)

if ((${#offenders[@]} > 0)); then
  echo "BRICKMODE DOCS-ONLY GUARD: FAIL"
  echo "Branch modifies files not allowed for a docs/prompts-only branch."
  echo "Base: $BASE_REF"
  echo
  printf ' - %s\n' "${offenders[@]}"
  echo
  echo "Fix example:"
  echo "  git restore --source=$BASE_REF --staged --worktree -- <path>"
  exit 1
fi

echo "BRICKMODE DOCS-ONLY GUARD: PASS (only docs/prompts/*.md/*.txt/*.sh changed)"
