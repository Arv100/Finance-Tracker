# Security note — sensitive file removed from history

On 2025-10-30 we removed `Backend/.env` from the repository history and updated `origin/main` with a forced push.

Why this was done
- `Backend/.env` contained environment variables and could include secrets. To avoid leaking secrets we removed it from the repository history and stopped tracking it.

What happened
- `Backend/.env` was removed from the tip and prior commits using a history rewrite.
- The rewritten refs were force-pushed to `origin/main`.
- The local `Backend/.env` file remains in your working directory (untracked). Do NOT commit it.

Important actions for contributors

If you have local clones, forks, or branches based on this repository you MUST update them to match the rewritten history. Failure to do so can result in merge conflicts or duplicate history.

Recommended options (pick one):

Option A — Re-clone (simplest and safest)
1. Backup any uncommitted or important local changes (copy the repo directory or copy files out).
2. Remove your local copy and clone again:

```bash
# remove local copy (or move it elsewhere as a backup)
cd ..
rm -rf Finance-Tracker
# re-clone the repository
git clone git@github.com:Arv100/Finance-Tracker.git
cd Finance-Tracker
```

Option B — Reset your existing clone to the new remote main (destructive to local commits not pushed)
1. Backup any uncommitted work.
2. Fetch and hard-reset:

```bash
git fetch origin --all
git checkout main
git reset --hard origin/main
```

If you have local branches you want to preserve, create patches or branch references first:

```bash
# create a backup branch name from your current branch
git branch backup/my-feature
# or create a patch
git format-patch origin/main --stdout > my-changes.patch
```

If you need to rebase a branch onto the rewritten main:

```bash
git fetch origin
git checkout my-branch
git rebase --onto origin/main $(git merge-base my-branch origin/main) my-branch
```

Security actions (recommended)
- Rotate any secrets that were in `Backend/.env` (API keys, DB passwords, tokens). Treat them as compromised.
- Use your secret manager or service to revoke/regenerate keys.

Notes and caveats
- The file may still exist in forks or mirrors until those repositories also rewrite or reclone.
- This rewrite was done using `git filter-branch` as `git-filter-repo` was not available in the environment; `git-filter-repo` is recommended for future rewrites.

If you need help with any of these steps (creating backups, re-applying local changes, or installing `git-filter-repo`), ping here and I can prepare exact commands or perform them for you.
