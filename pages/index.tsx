//import Head from 'next/head'
import Layout from 'components/layout'
import { useSession, signIn, getSession } from "next-auth/react"

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
        <div><strong>Bienvenue sur bavardages.org</strong></div>
        <div>Ici, il sera bientôt possible de <span style={{color: 'yellow', fontSize: 20}}><strong>bavarder</strong></span> avec un robot d'OpenAI</div>
        <br/>
        <div>Pour l'instant je suis en mode perroquet...</div>
      </>
    );
  }, []);

  const commands = useMemo(() => ({
    'décollage': async (v:unknown) => {
      await pushToHistory(<>
          <div>
            <strong>Décollage</strong> du server <span style={{color: 'green'}}>terminé</span>
          </div>
        </>);
    },
    'alerte': async (v:unknown) => {
      alert('Coucou!');
      await pushToHistory(<>
          <div>
            <strong>Alerte coucou </strong>
            <span style={{color: 'orange'}}>
              <strong>affichée dans le navigateur</strong>
            </span>
          </div>
        </>);
    }, 
    'not logged in': async (v:unknown) => {
      await pushToHistory(<>
          <div>
            <strong>stutter:</strong>
            <span style={{color: 'orange', marginLeft: 10}}>
              <strong>Vous n'êtes pas connecté.</strong> Connectez-vous en utilisant le menu de la marge de gauche. Si la marge est cachée, faites-la apparaître en cliquant sur le hamburger en haut à gauche... 
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
        promptLabel={<>&gt;</>}
        commands={commands}
      />
    </Layout>
  )
}
