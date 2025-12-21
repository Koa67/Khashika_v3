#!/usr/bin/env bash
set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" == "main" ]]; then
  echo "BRICKMODE SHIP: refuse to run on main. Use a feature branch."
  exit 1
fi

git fetch origin
git rebase origin/main

./scripts/brickmode-sanity.sh

git push -u origin "$branch"
echo "BRICKMODE SHIP: DONE (rebased + sanity pass + pushed)"
