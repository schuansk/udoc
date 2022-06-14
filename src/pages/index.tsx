import Head from 'next/head';
import styles from './home.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>UDOC</title>
      </Head>
      <main className={styles.content}>
        <Image src="/images/logo.svg" alt="UDOC" height={100} width={100} />
        <h1>Welcome to UDOC!</h1>
        <h2>A simple platform to document your projects.</h2>
        <Link href="/macro">
          <a>Start documenting</a>
        </Link>
      </main>
    </>
  );
}
