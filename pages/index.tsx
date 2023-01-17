import Head from 'next/head'
//import  '../styles/styles.css'
import Dialogue from 'components/dialogue'
import Layout from 'components/layout'

export default function Home() {
  return (
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
           <Layout>
            <Dialogue />
          </Layout>
      </Head>
  )
}
