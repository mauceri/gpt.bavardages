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
        <div><strong>Bienvenue</strong>  au coin des bavards !</div>
        <div style={{fontSize: 20}}>Il vous sera bientôt possible de <span style={{color: 'yellow'}}><strong>bavarder</strong></span> avec un robot d'OpenAI</div>
        <br/>
        <div>Vous pouvez taper ce que vous voudrez, je le répèterai</div>
      </>
    );
  }, []);

  const commands = useMemo(() => ({
    'start': async (v:unknown) => {
      await pushToHistory(<>
          <div>
            <strong>Starting</strong> the server... <span style={{color: 'green'}}>Done</span>
          </div>
        </>);
    },
    'alert': async (v:unknown) => {
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
    'not logged in': async (v:unknown) => {
      await pushToHistory(<>
          <div>
            <strong>stutter:</strong>
            <span style={{color: 'orange', marginLeft: 10}}>
              <strong>Vous n'êtes pas connecté, voyons!</strong> Connectez-vous en utilisant le menu de la marge de gauche. Si la marge est cachée, faites-la apparaître en cliquant sur le hamburger en haut à gauche... 
            </span>
          </div>
        </>);
    },
      'default': async (v:unknown) => {
      await pushToHistory(<>
          <div>
            <strong>Vous avez tapé:</strong>
            <span style={{color: 'orange', marginLeft: 10}}>
              <strong>{v as string}</strong>
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
        promptLabel={<>Allez, écrivez quelque chose :)</>}
        commands={commands}
      />
    </Layout>
  )
}
