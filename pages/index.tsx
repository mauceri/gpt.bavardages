//import Head from 'next/head'
import Layout from 'components/layout'
import Terminal from 'components/terminal';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";

export default function Home() {
  return (
       <Layout>
        <Terminal />
      </Layout>
  )
}