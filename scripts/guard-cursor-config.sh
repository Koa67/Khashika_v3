#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

find_files() {
  local name="$1"
  find . \
    -path './.git' -prune -o \
    -path './node_modules' -prune -o \
    -path './.next' -prune -o \
    -path './dist' -prune -o \
    -path './build' -prune -o \
    -path './.turbo' -prune -o \
    -path './.vercel' -prune -o \
    -name "$name" -print
}

is_allowed_symlink() {
  local name="$1"
  local relpath="$2"
  local expected=""

  case "${name}:${relpath}" in
    ".cursorrules:components/.cursorrules") expected="../.cursorrules" ;;
    ".cursorignore:components/.cursorignore") expected="../.cursorignore" ;;
    "_CONTEXT.md:scripts/_CONTEXT.md") expected="../_CONTEXT.md" ;;
    *) return 1 ;;
  esac

  [ -L "./$relpath" ] || return 1
  [ "$(readlink "./$relpath")" = "$expected" ] || return 1
  return 0
}

check_root_and_symlinks_ok() {
  local name="$1"
  local root="$name"
  local raw
  raw="$(find_files "$name" | sed 's|^\./||')"

  local hits=()
  while IFS= read -r line; do
    [ -n "${line:-}" ] && hits+=("$line")
  done <<EOF
$raw
EOF

  local found_root=0
  for p in "${hits[@]}"; do
    if [ "$p" = "$root" ]; then
      found_root=1
    fi
  done

  if [ "$found_root" -ne 1 ]; then
    echo "FAIL missing root ./$name"
    printf '%s\n' "${hits[@]}"
    exit 1
  fi

  local bad=0
  for p in "${hits[@]}"; do
    [ "$p" = "$root" ] && continue
    if ! is_allowed_symlink "$name" "$p"; then
      bad=1
      echo "FAIL unexpected extra copy: $p"
    fi
  done

  if [ "$bad" -ne 0 ]; then
    echo "Fix: keep only ./$name at root. Optional allowed symlinks:"
    echo " - components/.cursorrules -> ../.cursorrules"
    echo " - components/.cursorignore -> ../.cursorignore"
    echo " - scripts/_CONTEXT.md -> ../_CONTEXT.md"
    exit 1
  fi

  echo "OK $name"
}

check_root_and_symlinks_ok ".cursorrules"
check_root_and_symlinks_ok ".cursorignore"
check_root_and_symlinks_ok "_CONTEXT.md"

echo "PASS guard-cursor-config"
