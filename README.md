# swolo 👖

Inspired by the
[Getting Things Done](https://en.wikipedia.org/wiki/Getting_Things_Done)
methodology and Ben Solo's iconic shirtless scene, Swolo is a
**project management** and **note-taking app** designed for a party of one.

Capture tasks, manage projects, and take notes with confidence — just like Ben,
you're swol enough to handle anything your workload throws at you.

> Currently vaporware. Stay tuned for updates.

## Guiding principles

- **Effortless capture** — Quickly capture tasks and ideas, clearing your mind
  of distractions for later processing.
- **Frictionless task setup** — Start tasks from anywhere, even while taking
  notes, to keep your workflow smooth.
- **Label all the things** — Tag your tasks and notes for easy searching and
  organization.
- **Full data control** — Export your data at anytime.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/mfaux/swolo
cd swolo
pnpm install
```

## Running Locally

Create an .env file with the following:

```bash
DATABASE_URL=postgres://root:secret@localhost:5432/postgres
```

Start the Postgres database with Docker Compose:

```bash
docker compose up -d
```

Feel free to change the database settings in the `.env` and `docker-compose.yaml` files to your liking.

Then, initialize the database and seed it with some tasks and projects:

```bash
pnpm db:push
pnpm db:seed
```

Finally, run the Next.js development server:

```bash
pnpm dev
```

## Schema changes

While Swolo is in alpha, we won’t use database migrations. Instead, apply schema changes directly to the
database using:

```bash
pnpm db:push
```

This trade-off prioritizes rapid development over schema versioning.

You can reinitialize the database at any time (causing all data to be lost):

```bash
pnpm db:reset
```

## Shadcn integration

Swolo uses the `canary` version of the [shadcn/ui](https://ui.shadcn.com/) library for its UI components.

To add a component, run:

```bash
pnpm dlx shadcn@canary add <COMPONENT_NAME>
```

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md).

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).

<br/>

<br/>

<br/>

. . .

<br/>

<br/>

<br/>

![Ben Swolo meme](./docs/img/do-you-even.png)
