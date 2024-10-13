# Contributing

Thank you for considering contributing to Swolo! This document outlines the
process for contributing to this project.

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

To run the Swolo website:

```bash
pnpm dev
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
