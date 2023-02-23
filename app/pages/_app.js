import Head from 'next/head';
import Header from '../components/header';
import "../styles/index.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Team11 App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Team 11 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <Header />
        <Component {...pageProps} />
      </div>
    </>)
}

export default MyApp
