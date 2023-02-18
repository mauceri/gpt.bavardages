import '../styles/styles.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from "@clerk/clerk-react"
import { ConfigProvider, theme } from 'antd';

export default function App(
  { Component,
    pageProps: { session, ...pageProps },
  }: AppProps) {
  const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


  return (
    
      <ClerkProvider publishableKey={clerk_pub_key as string}>
        <Component {...pageProps} />
      </ClerkProvider>
  )
}
