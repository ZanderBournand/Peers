# Peers

Peers is a web-application designed to improve peer-to-peer learning among university students. At its core, Peers is a social network platform, where students and organizations can host events not only in-person, but also directly online!

With its clever use of gamification, and personalized recommendations, Peers is designed as the next generation knowledge transfer platform.

The project is currently deployed at: https://peers-uf.vercel.app/

#### Preview ("home" page)

<img src="https://i.imgur.com/aXySmY8.png" width=473 height=366>

## Setup

#### System Requirements

- [Node.js 18.17](https://nodejs.org/en) or later
- macOS, Windows (including WSL), and Linux are supported.

#### Instructions

1. Clone the project locally (https://github.com/ZanderBournand/Peers)
2. Run `npm install` in root folder
3. Add a `.env` folder at the root level, and include the following [variables](#env-project-setup)
4. Start the web-server via `npm run dev`

#### Testing

Tests are split into four different sections:

- Prettier - checks for code formatting
  - `npm run test:prettier`
- Eslint - checks for programmatic error, and stylistic errors
  - `npm run test:eslint`
- Unit - runs tests on backend API functions
  - `npm run test:prettier`
- E2e - tests system as a whole (frontend + backend)
  - `npm run test:prettier`

**Note:** Ensure that you have properly setup the testing `.env` variables (see appendix)

## Contribution Guidelines

Please create a new branch for any changes. For consistency reasons, please name your branches in the following format:

`XX_change_made` (**example:** ZB_added_event_creation)

Where XX is your first name and last name initials. The rest of the branch name should be a general indicator of the change made!

## How to deploy?

Follow the T3 development guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

**Note:** Vercel deployment is often chosen for its streamlined setup!

## Need Help?

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

If you are not familiar with the different technologies used in this project, you can refer to the respective docs:

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com/docs)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Ackowledgments

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

This project also uses a starter template created by Isaac Dyor, which can be found in his [blog post](https://dev.to/isaacdyor/t3-stack-with-app-router-and-supabase-jh9).

## Appendix

#### `.env` project setup

| Variable                              | Details                                  |
| ------------------------------------- | ---------------------------------------- |
| `NODE_ENV`                            | Sets the Node.js application environment |
| `DIRECT_URL`                          | Direct connection stringto SQL DB        |
| `DATABASE_URL`                        | Connection string to the SQL DB          |
| `NEXT_PUBLIC_SUPABASE_URL`            | URL of your Supabase project             |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL`    | Baser URL for Supabase storage service   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Public anonymous API key for Supabase    |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`     | API key for Google Maps                  |
| `MAILGUN_DOMAIN`                      | Domain name for Mailgun service          |
| `MAILGUN_API_KEY`                     | API key for Mailgun service              |
| `TESTING_SUPABASE_URL`                | Supabase project URL for testing         |
| `TESTING_SUPABABASE_SERVICE_ROLE_KEY` | Service role key for Supabase testing    |
| `DAILY_API_KEY`                       | API key for the Daily.co service         |
