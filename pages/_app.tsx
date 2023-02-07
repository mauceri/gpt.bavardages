import '../styles/styles.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from "@clerk/clerk-react"


export default function App(
  { Component,
    pageProps: { session, ...pageProps },
  }: AppProps) {
    const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    console.log("la clef publique %s", clerk_pub_key)
  
  return (
    <ClerkProvider publishableKey={clerk_pub_key  as string}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}
