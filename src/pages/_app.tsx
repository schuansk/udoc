import { AppProps } from 'next/app';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/Sidebar';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/global.scss';
import { toastStyle } from '../components/Toast';
import { SidebarProvider } from '../hooks/sidebar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider>
      <main className="main">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={false}
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          toastStyle={toastStyle}
        />
      </main>
    </SidebarProvider>
  );
}

export default MyApp;
