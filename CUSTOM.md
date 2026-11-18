# Local patches

This is a personal fork of [usebruno/bruno](https://github.com/usebruno/bruno) (MIT). It is not affiliated with Bruno. `main` mirrors upstream; `custom` is `main` plus the changes below.

| Change | Files |
| --- | --- |
| Allow renaming the default workspace | `packages/bruno-app/src/components/ManageWorkspace/index.js`, `packages/bruno-electron/src/{app/apiSpecs.js,app/workspace-watcher.js,ipc/workspace.js}` |
| Packaging scripts and the build workflows | `scripts/{prepare-electron-web,package-win,package-mac}.cjs`, `scripts/sync-upstream.sh`, `.github/workflows/build-{mac,windows}.yml` |

`git log main..custom` lists everything we carry.

## Remotes and branches

| Remote | Points to | Used for |
| --- | --- | --- |
| `upstream` | `usebruno/bruno` | source of new releases, fetch only |
| `origin` | `jonathanstrf/bruno` (the fork) | backup, and where the macOS build runs |

- `main` only ever fast-forwards to `upstream/main`. Never commit on it.
- `custom` is rebased onto `main` after each sync, so it needs `--force-with-lease` when pushed.
- GitHub's "Sync fork" button only moves the fork's `main`; run `git pull` on `main` afterwards if you used it.

## Sync with upstream

```bash
./scripts/sync-upstream.sh
```

It is equivalent to:

```bash
git fetch upstream main
git checkout main && git merge --ff-only upstream/main && git push origin main
git checkout custom && git rebase main && git push --force-with-lease origin custom
```

If the rebase stops on a conflict, resolve it in the files listed above, `git add` them, run `git rebase --continue`, then push. The clone is shallow; if git reports a missing base, run `git fetch --deepen=200 upstream main`.

## Build and run

```bash
npm run setup                                   # install and build the internal packages
ELECTRON_USER_DATA_PATH=<data dir> npm run dev  # web part (then `npm run dev:electron` in a second terminal)
```

Always set `ELECTRON_USER_DATA_PATH` for dev runs so they never share `%APPDATA%\bruno` with the installed Bruno.

**Windows** (output in `packages/bruno-electron/out/win-unpacked`; copy it over the install folder with Bruno closed):

```bash
npm run build:web && node scripts/package-win.cjs
```

Upstream's own `npm run build:electron` also packs x64 fine, but then fails on arm64 (`native-reg` needs Visual Studio's build tools) while still exiting 0. That is why `package-win.cjs` builds x64 only. Signing is skipped automatically when no certificate is configured.

Windows can also be built on GitHub: Actions tab -> "Build Windows app" -> Run workflow; the zipped `win-unpacked` folder is attached to the run.

**macOS** is built on GitHub: Actions tab -> "Build macOS app" -> Run workflow -> pick `arm64` or `x64`. The `.dmg` and `.zip` are attached to the run as an artifact. On a Mac the same thing is `npm run setup && npm run build:web && node scripts/package-mac.cjs arm64`.

The macOS build is unsigned and not notarized. On first open, right-click the app and choose Open, or run `xattr -cr /Applications/Bruno.app`.

The fork inherits upstream's other workflows (tests, lint, benchmarks). Leave Actions disabled for them, or disable them individually in the Actions tab, so only `build-mac.yml` and `build-windows.yml` run.

Windows note: set `core.longpaths=true` and skip the `tests/` and `playwright/` folders in the checkout; their fixture paths exceed the path limit.
