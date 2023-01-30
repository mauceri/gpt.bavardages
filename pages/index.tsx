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
  //const clerk_pub_key = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
  //console.log("la clef publique %s", clerk_pub_key)
  return (
    <ClerkProvider publishableKey={"pk_test_ZW5vdWdoLXJpbmd0YWlsLTY3LmNsZXJrLmFjY291bnRzLmRldiQ"}>
       <Layout>
        <Terminal />
      </Layout>
    </ClerkProvider>
  )
}