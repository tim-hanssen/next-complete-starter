import '@/styles/globals.css';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { ApolloProvider } from '@apollo/client';
import client from '../../apollo-client';
import { PopupProvider } from '@/context/popup-context';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <PopupProvider>
        <Head>
          <title>Prepr Patterns</title>
        </Head>
        <div className='min-h-screen pt-24 antialiased md:pt-0'>
          <Nav />
          <div className='modal-container'></div>
          <Component {...pageProps} />
          <Footer />
        </div>
      </PopupProvider>
    </ApolloProvider>
  );
}
