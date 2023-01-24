import {useCallback,  useState} from 'react';

export const useTerminal = () => {
  const [terminalRef, setDomNode] = useState<HTMLDivElement>();
  const setTerminalRef = useCallback((node: HTMLDivElement) => setDomNode(node), []);


  return {
    setTerminalRef,
  };
};