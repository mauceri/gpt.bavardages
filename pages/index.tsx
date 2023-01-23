//import Head from 'next/head'
import Layout from 'components/layout'
import { useSession, getSession } from "next-auth/react"

import React, {useEffect, useMemo} from 'react';
import Terminal from 'components/terminal';
import {useTerminal} from 'components/hooks';

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
        <div><strong>Welcome!</strong> to the terminal.</div>
        <div style={{fontSize: 20}}>It contains <span style={{color: 'yellow'}}><strong>HTML</strong></span>. Awesome, right?</div>
        <br/>
        <div>You can write: start or alert , to execute some commands.</div>
      </>
    );
  }, []);

  const commands = useMemo(() => ({
    'start': async () => {
      await pushToHistory(<>
          <div>
            <strong>Starting</strong> the server... <span style={{color: 'green'}}>Done</span>
          </div>
        </>);
    },
    'alert': async () => {
      alert('Hello!');
      await pushToHistory(<>
          <div>
            <strong>Alert</strong>
            <span style={{color: 'orange', marginLeft: 10}}>
              <strong>Shown in the browser</strong>
            </span>
          </div>
        </>);
    },
    'default':async (v) => {
      alert('Hello!');
      await pushToHistory(<>
          <div>
            <strong>stutter:</strong>
            <span style={{color: 'orange', marginLeft: 10}}>
              <strong>${v}</strong>
            </span>
          </div>
        </>);
    },
  }), [pushToHistory]);


  const { data: session, status } = useSession()

  return (
    <Layout>
      <Terminal
        history={history}
        ref={setTerminalRef}
        promptLabel={<>Write something awesome:</>}
        commands={commands}
      />
    </Layout>
  )
}
