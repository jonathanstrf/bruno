#!/usr/bin/env bash
# Brings `main` up to date with upstream, then rebases `custom` onto it and pushes both to the fork.
# Stops on a rebase conflict: fix the files, `git add` them, run `git rebase --continue`, then push with
# `git push --force-with-lease origin custom`.
set -euo pipefail

git diff --quiet && git diff --cached --quiet || { echo "Working tree is not clean; commit or stash first." >&2; exit 1; }

git fetch upstream main
git checkout main
git merge --ff-only upstream/main
git push origin main

git checkout custom
git rebase main
git push --force-with-lease origin custom

echo "Synced. Rebuild with: npm run setup && npm run build:web && node scripts/package-win.cjs"
