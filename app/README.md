Versione modificata e adattata a API v2.0 del progetto. (https://github.com/Dineshs91/nextjs-twitter-starter)
Per la versione in inglese scorrere in basso

## Pacchetti

- [Next.js](https://nextjs.org/docs) (framework)
- [Tailwindcss](https://tailwindcss.com/docs) (CSS)
- [Twitter-lite](https://github.com/draftbit/twitter-lite) (pacchetto npm per twitter)

## Inizializzare
Crea `.env.local` nella project root e aggiungi il seguente testo

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_KEY_SECRET=
TWITTER_BEARER_TOKEN=
TWITTER_ACCESS_CODE=
TWITTER_ACCESS_CODE_SECRET=
TEST_TWITTER_HANDLE=Palazzo_Chigi
```

Per recuperare le chiavi di Twitter, visita https://developer.twitter.com/en/portal/dashboard e crea una app. Recupera la "consumer key", "secret key" e "bearer token" e aggiungile al file `.env.local`.

In `TEST_TWITTER_HANDLE` inserisci di quale account vuoi recuperare le informazioni, mentre per il tweet c'è una variabile nel codice

**App** richiede l'autenticazione:

- `consumer_key`
- `consumer_secret`
- `access_token_key`
- `access_token_secret`
- `bearer_token`

#### Installare le dipendenze

```bash
yarn install
```

#### Eseguire il server di deploy:

```bash
yarn dev
```

Apri [http://localhost:3000](http://localhost:3000) Con il tuo browser per visualizzare la pagina.

## Pagina di esempio

Naviga in http://localhost:3000/twitter per vedere un esmpio di come viene mostrato un utente di Twitter e un tweet di un utente.

## English version

Modified version and adapted to API v2.0 of the project. (https://github.com/Dineshs91/nextjs-twitter-starter)

## Packages
- [Next.js](https://nextjs.org/docs) (framework)
- [Tailwindcss](https://tailwindcss.com/docs) (CSS)
- [Twitter-lite](https://github.com/draftbit/twitter-lite) (package npm for twitter)

## Getting Started
Create `.env.local` file in the project root and add the following content in it

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_KEY_SECRET=
TWITTER_BEARER_TOKEN=
TWITTER_ACCESS_CODE=
TWITTER_ACCESS_CODE_SECRET=
TEST_TWITTER_HANDLE=Palazzo_Chigi
```

To get the Twitter keys, visit https://developer.twitter.com/en/portal/dashboard and create a standalone app. Fetch the consumer key, secret and bearer token and add it to the `.env.local` file.

Add your twitter handle for `TEST_TWITTER_HANDLE`. This is used in the twitter sample page.

**App** authentication requires:

- `consumer_key`
- `consumer_secret`
- `access_token_key`
- `access_token_secret`
- `bearer_token`

#### Install dependencies

```bash
yarn install
```

#### Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Example page

Navigate to http://localhost:3000/twitter to see an example which displays a Twitter card with a Twitter user's information.