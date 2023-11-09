# Basic Math

Basic Math is a Next JS app that serves users some simple math problems.

Currently, the functionalities include:

- Addition
- Factorization

The app is already deployed on Vercel, please feel free to try on <https://basic-math-livid.vercel.app/>.

## Installation

```shell
git clone https://github.com/sonnyding1/basic-math.git
cd basic-math
npm install
npm run dev
```

It is necessary to create a `.env` at home path, in it there should be several items:

- Clerk keys
- MongoDB URI

This project also uses Prisma as its ORM, so use

```shell
npx prisma generate
```

and

```shell
npx prisma db push
```

in order to sync to the database. I have used MongoDB, but feel free to use something else, just make sure to change the provider in `prisma.schema`.

Then, go to <http://localhost:3000> to view the app, and hopefully make some tweaks to it.
