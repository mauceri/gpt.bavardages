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
  const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  console.log("la clef publique %s", clerk_pub_key)
  return (
    <ClerkProvider publishableKey={clerk_pub_key  as string}>
       <Layout>
        <Terminal />
      </Layout>
    </ClerkProvider>
  )
}