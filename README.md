# swolo 👖

Inspired by the GTD methodology and Ben Solo's iconic shirtless scene, **Swolo** is a cross-platform project management and note-taking app designed for a party of one.

Capture tasks, manage projects, and take notes with confidence — just like Ben, you’re in control of the Force (and your workload).

## Guiding principles

- **Effortless capture** — Quickly capture tasks and ideas, clearing your mind of distractions for later processing.
- **Work anywhere** — Access your content seamlessly from the web or desktop, whether you're online or offline.
- **Frictionless task setup** — Start tasks from anywhere, even while taking notes, to keep your workflow smooth.
- **Label all the things** — Tag your tasks and notes for easy searching and organization.
- **Full data control** — Export your data at anytime.

## Architecture

Powered by Next.js, Electron, and TipTap. Monorepo managed by Turborepo.

> _Currently vaporware at its finest._

## Monorepo structure

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

## Install

```
pnpm install
```

## Build

To build all apps and packages, run the following command:

```
pnpm build
```

## Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

To develop just the web app, run the following command:

```
pnpm dev:web
```
