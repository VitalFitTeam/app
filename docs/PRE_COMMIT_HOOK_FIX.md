# Pre-Commit Hook Fix

## Problem

Unit tests were not running automatically when committing code. The pre-commit hook was accidentally deleted in commit `3e12fe9` (i18n PR #108).

## Root Cause

The `.husky/pre-commit` file was deleted, which meant Git hooks were not triggering lint-staged to run tests before commits.

## Solution

Recreated the `.husky/pre-commit` hook with the proper configuration:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

export PATH="$PATH:./node_modules/.bin"

echo ">>> Husky running lint-staged on the project..."
npx lint-staged
```

## What Runs on Pre-Commit

When you commit code, the following checks run automatically on staged files:

### For TypeScript/TSX files (`**/*.{ts,tsx}`):
1. **ESLint** - `eslint --fix --max-warnings=0 --no-warn-ignored`
   - Lints code and auto-fixes issues
   - Fails if there are any warnings

2. **Prettier** - `prettier --write`
   - Formats code according to project style

3. **Jest** - `jest --bail --findRelatedTests --passWithNoTests`
   - Runs unit tests for the files being committed
   - Only tests related to changed files
   - Bails on first failure

### For JavaScript/JSX files (`**/*.{js,jsx}`):
Same as TypeScript files

### For JSON/CSS/MD files (`**/*.{json,css,scss,md}`):
- **Prettier** - Formatting only

## How to Verify It's Working

1. Make a change to a `.ts` or `.tsx` file
2. Stage the file: `git add <file>`
3. Commit: `git commit -m "your message"`
4. You should see output like:
   ```
   >>> Husky running lint-staged on the project...
   ✔ Preparing lint-staged...
   ✔ Running tasks for staged files...
   ✔ Applying modifications from tasks...
   ✔ Cleaning up temporary files...
   ```

## Important Notes

- If tests fail, the commit will be **blocked**
- If linting produces errors, the commit will be **blocked**
- Auto-fixable issues (lint/format) will be fixed automatically
- You may need to `git add` the auto-fixed files and commit again

## Configuration Files

- **Husky config**: `.husky/pre-commit`
- **Lint-staged config**: `package.json` → `lint-staged` section
- **Git hooks path**: `.husky` (set via `git config core.hooksPath`)

## Troubleshooting

If the hook isn't running:

1. Verify Husky is installed:
   ```bash
   npm run prepare
   ```

2. Check Git hooks path:
   ```bash
   git config core.hooksPath
   # Should output: .husky
   ```

3. Verify the hook file exists and is executable:
   ```bash
   ls -la .husky/pre-commit
   ```

4. Test manually:
   ```bash
   npx lint-staged
   ```
