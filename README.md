<!-- conform-ignore -->

# About

This website is the online counterpart of the physical student publication "QED"
at the Heinrich-Hertz-Gymnasium in Berlin. It will contain informative sites
about the publication like contact info but also functional components.

QED-Online will enable authors to post online posts. Online posts are organised
into collections. These collections can be locked behind a code. This also
allows the concept of editions which are just locked collections with some extra
data (number and release date). Editions refer to editions of the physical
publication. Authors can publish online posts to the digital editions that
contain digital media such as videos or audio. The physical publication can then
include a QR-Code or a link that unlocks the digital edition, granting access to
the digital extra-content associated with the physical edition.

In addition to collections and editions, there are also stand-alone articles
(they are implemented as articles in an unlocked default collection) which can
appear on the start page of the website. This allows authors to publish quick
articles, accessible for free, whenever they feel like it.

> [!NOTE]
>
> Posts, collections and editions are specified in the database schema at
> `lib/db/schema.ts`.

# Setup

```bash
git clone https://Schlafhase/QED-Online
cd QED-Online
npm install
```

Set up your .env file like this:

```env
# random string used for signing e.g. output of 'openssl rand -hex 32'
AUTH_SECRET=
# password for admin access
ADMIN_PASSWORD=
# path to sqlite file (data/blog.db if unset)
DATABASE_PATH=

# S3-compatible storage (only needed for uploading images)
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
STORAGE_BUCKET=
# human-friendly url
STORAGE_URL=
```

Then run the development version with `npm run dev` or build the stand-alone
output with `npm run build`. The built server can be run with
`node .next/standalone/server.js`.
