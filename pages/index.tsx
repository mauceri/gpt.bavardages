//import Head from 'next/head'
import Layout from 'components/layout'
import Terminal from 'components/terminal'
import SignIn from 'components/signin'
import { useSession, getSession } from "next-auth/react"


export default function Home() {
  const { data: session, status } = useSession()

  return (
    <Layout>
      <Terminal />
    </Layout>
  )
}