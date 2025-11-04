# GitHub CI Workflow

This directory contains the CI workflow configuration for the project.

## CI Process

The CI workflow is defined in `.github/workflows/ci.yml` and consists of the following jobs that run in parallel:

1. **Setup**: Checks out the repository, sets up Node.js and pnpm, installs dependencies, and caches node_modules for other jobs.
2. **Lint**: Runs linting checks using `pnpm lint`.
3. **Type Check**: Runs TypeScript type checking using `pnpm typecheck`.
4. **Build**: Builds the project using `pnpm build`.
5. **Test**: Runs tests using `pnpm test`.

All jobs depend on the setup job to ensure dependencies are installed properly before running.

## Branch Protection

Branch protection rules are defined in `.github/branch-protection.yml`. These rules ensure that:

- All CI checks must pass before merging PRs
- At least one review is required
- Stale reviews are dismissed
- Admin enforcement is enabled

### Setting Up Branch Protection

To manually apply the branch protection rules after repository creation, you can use the GitHub CLI:

```bash
gh repo edit --repo [owner]/[repo] --branch-protection-rule 'main:@.github/branch-protection.yml'
```

Replace `[owner]` and `[repo]` with the appropriate values.

## Workflow Details

- Concurrency settings ensure that only one workflow runs at a time per branch
- Job dependencies ensure proper execution order
- Caching is used to speed up builds and reduce resource usage
