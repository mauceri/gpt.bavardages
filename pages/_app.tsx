import '../styles/styles.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from "@clerk/clerk-react"
import { ConfigProvider } from 'antd';

export default function App(
  { Component,
    pageProps: { session, ...pageProps },
  }: AppProps) {
  const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3C3C3C",
          colorInfo: "#3c3c3c",
          colorTextBase: "#c4c4c4",
          colorBgBase: "#3c3c3c"
        },
      }}>
      <ClerkProvider publishableKey={clerk_pub_key as string}>
        <Component {...pageProps} />
      </ClerkProvider>
    </ConfigProvider>
  )
}
