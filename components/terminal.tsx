import { ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { TerminalProps } from "./types";
import { signIn, signOut, useSession } from "next-auth/react"



const Terminal = forwardRef(
  (props: TerminalProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { data: session, status } = useSession();
    const {
      history = [],
      promptLabel = '>',

      commands = {},
    } = props;

    const inputRef = useRef<HTMLInputElement>();
    const [input, setInputValue] = useState<string>('');

    /**
     * Focus on the input whenever we render the terminal or click in the terminal
     */
   useEffect(() => {
      inputRef.current?.focus();
    });

    const focusInput = useCallback(() => {
      inputRef.current?.focus();
    }, []);


    /**
     * When user types something, we update the input value
     */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      },
      []
    );

    /**
     * When user presses enter, we execute the command
     */
    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          let commandToExecute = null;
          if (!session) {
            const login = commands?.['not logged in'];
            login?.(input);
          } else {
            commandToExecute = commands?.[input.toLowerCase()];
            if (commandToExecute) {
              commandToExecute?.(null);
            } else {
              const repeat = commands?.['default'];
              repeat?.(input);
            }
          }
          setInputValue('');
        }
      },
      [commands, input]
    );

    return (
      <div className="terminal" ref={ref} onDoubleClick={focusInput}>
        {history.map((line, index) => (
          <div className="terminal__line" key={`terminal-line-${index}-${line}`}>
            {line}
          </div>
        ))}
        <div className="terminal__prompt">
          <div className="terminal__prompt__label">{promptLabel}</div>
          <div className="terminal__prompt__input">
            <input
              type="text"
              value={input}
              onKeyDown={handleInputKeyDown}
              onChange={handleInputChange}
              // @ts-ignore
              ref={inputRef}
            />
          </div>
        </div>
      </div>
    );
  });

Terminal.displayName = 'Terminal';
export default Terminal;
