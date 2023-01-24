//import Head from 'next/head'
import Layout from 'components/layout'
import { useSession, signIn, getSession } from "next-auth/react"

import React, { useEffect, useMemo } from 'react';
import Terminal from 'components/terminal';
import { useTerminal } from 'components/hooks';





export default function Home() {
  const {
    history,
    setTerminalRef,
    resetTerminal,
  } = useTerminal();


  






const { data: session, status } = useSession()

return (
  <Layout>
    <Terminal
      history={history}
      ref={setTerminalRef}
    />
  </Layout>
)
}
