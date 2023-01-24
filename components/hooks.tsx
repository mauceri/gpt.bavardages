import {useCallback, useEffect, useState} from 'react';
import {TerminalHistory, TerminalHistoryItem, TerminalPushToHistoryWithDelayProps} from "../components/types";


export const useTerminal = () => {
  const [terminalRef, setDomNode] = useState<HTMLDivElement>();
  const setTerminalRef = useCallback((node: HTMLDivElement) => setDomNode(node), []);

  const [history, setHistory] = useState<TerminalHistory>([]);

  /**
   * Scroll to the bottom of the terminal when window is resized
   */
  useEffect(() => {
    const windowResizeEvent = () => {
      terminalRef?.scrollTo({
        top: terminalRef?.scrollHeight ?? 99999,
        behavior: 'smooth',
      });
    };
    window.addEventListener('resize', windowResizeEvent);

    return () => {
      window.removeEventListener('resize', windowResizeEvent);
    };
  }, [terminalRef]);

  /**
   * Scroll to the bottom of the terminal on every new history item
   */
  useEffect(() => {
    terminalRef?.scrollTo({
      top: terminalRef?.scrollHeight ?? 99999,
      behavior: 'smooth',
    });
  }, [history, terminalRef]);

  const pushToHistory = useCallback((item: TerminalHistoryItem) => {
    setHistory((old) => [...old, item]);
  }, []);

  

  /**
   * Reset the terminal window
   */
  const resetTerminal = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    terminalRef,
    setTerminalRef,
    resetTerminal,
  };
};