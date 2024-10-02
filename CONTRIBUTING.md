# Contributing

Thank you for considering contributing to Swolo! This document outlines the
process for contributing to this project.

## About this repository

This repository is a monorepo.

- [pnpm](https://pnpm.io) and [`workspaces`](https://pnpm.io/workspaces) are used for development.
- [Turborepo](https://turbo.build/repo) is the build system, with `@repo` for internal packages.
- (_planned_) [changesets](https://github.com/changesets/changesets) will be used for managing releases.

## Structure

This repository is structured as follows:

| Path                          | Description                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `apps/web`                    | The Next.js application for the Swolo website                                        |
| `apps/docs `                  | User-facing documentation for Swolo                                                  |
| `packages/ui `                | A stub React component library shared by the applications                            |
| `packages/eslint-config `     | `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`) |
| `packages/typescript-config ` | `tsconfig.json`s used throughout the monorepo                                        |

## Development

### Clone on your local machine

```bash
git clone https://github.com/mfaux/swolo.git
```

### Create a new Branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Run a workspace

The `pnpm dev:` scripts are used to start the development process for a workspace.

#### Examples

1. To run the Swolo website:

```bash
pnpm dev:web
```

2. To run the documentation:

```bash
pnpm dev:docs
```

### Managing dependencies

When adding dependencies, follow Turbo's [Best practices for dependency installation](https://turbo.build/repo/docs/crafting-your-repository/managing-dependencies#best-practices-for-dependency-installation):

> Install dependencies where they're used. When you install a dependency in your repository, you should install it directly in the package that uses it. The package's package.json will have every dependency that the package needs. This is true for both external and internal dependencies.

### Versioning dependencies

As a rule, keep dependencies on the same version across all packages. Use
`pnpm up` to update dependency versions in one command. For example:

```bash
pnpm up --recursive typescript@latest
```

## Commit convention

[Conventional commits](https://www.conventionalcommits.org/) are used in this
repository with the following format:

```
category(scope or module): message
```

- `feat`: all changes that introduce completely new code or new features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories, such as refactoring

  e.g. `feat(sync): add push notifications when a task is completed`
