#!/usr/bin/env bash
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" == "main" || "$branch" == "master" ]]; then
  echo "BRICKMODE SHIP: REFUSE (run on a feature branch, not '$branch')"
  exit 1
fi

# refuse si working tree sale
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "BRICKMODE SHIP: REFUSE (working tree not clean)"
  echo "Tip: commit/stash first, then re-run."
  exit 1
fi

BASE_REF="${BRICKMODE_BASE:-origin/main}"
git fetch origin
if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  BASE_REF="origin/master"
fi

# rebase
git rebase "$BASE_REF"

# refuse de push si rien à livrer
ahead="$(git rev-list --count "$BASE_REF"..HEAD || echo 0)"
if [[ "$ahead" == "0" ]]; then
  echo "BRICKMODE SHIP: REFUSE (no commits ahead of $BASE_REF)"
  exit 1
fi

./scripts/brickmode-sanity.sh
git push -u origin "$branch"

echo "BRICKMODE SHIP: DONE (rebased + sanity pass + pushed)"
