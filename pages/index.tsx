//import Head from 'next/head'
import Layout from 'components/layout'
import { useSession, signIn, getSession } from "next-auth/react"

import React, { useEffect, useMemo } from 'react';
import Terminal from 'components/terminal';
import { useTerminal } from 'components/hooks';





export default function Home() {
  const {
    history,
    pushToHistory,
    setTerminalRef,
    resetTerminal,
  } = useTerminal();


  useEffect(() => {
    resetTerminal();

    pushToHistory(<>
      <div><strong>Bienvenue sur bavardages.org</strong></div>
      <div>Ici, il sera bientôt possible de <span style={{ color: 'yellow', fontSize: 20 }}><strong>bavarder</strong></span> avec un robot d'OpenAI</div>
      <br />
      <div>Pour l'instant je suis en mode perroquet...</div>
    </>
    );
  }, []);


  






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
