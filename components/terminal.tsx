import { ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react"
import axios from "axios";




const Terminal = forwardRef(
  () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

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

    const [messages, setMessages] = useState([
      {
        message: "Bonjour, Je suis votre assistant virtuel ! Que puis-je faire pour vous ?",
        from: "ai",
      },
    ]);
    const processMessage = async (message: string) => {
      axios
        .post("/api/prompt", {
          message,
        })
        .then((res) => {
          setMessages((messages) => [
            ...messages,
            { from: "ai", message: res.data.message },
          ]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    const submitMessage = (event: any) => {
      event.preventDefault();
      setIsLoading(true);
      setMessages((messages) => [
        ...messages,
        { from: "user", message: message },
      ]);
      processMessage(message);
      setMessage("");
    };
    /**
     * When user types something, we update the input value
     */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        setMessage(e.target.value)
      },
      []
    );

    /**
     * When user presses enter, we execute the command
     */
    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
          let commandToExecute = null;
          if (!session) {
            //const login = commands?.['not logged in'];
            //login?.(null);
            signIn();
          } else {
            submitMessage(e)
          }
          //setInputValue('');
          //(document.getElementById("input") as HTMLTextAreaElement).value = "<span style={{ color: 'yellow'}}><strong>Humain </strong></span>" ;
        }
      },
      [input]
    );

    return (
      <div className="terminal" ref={inputRef} onDoubleClick={focusInput}>
        {messages.map((message, index) => {
          return message.from === "ai" ? (
            <div className="terminal__line" id="ai" key={`terminal-line-${index}-${message}`}>
              <span style={{ color: 'yellow'}}><strong>IA </strong></span> {message.message}
            </div>
          ) : (
            <div key={index} id="user" className="terminal__line">
              <span style={{ color: 'yellow'}}><strong>Humain </strong></span> {message.message}
            </div>
          );
        })}
        {isLoading && (
          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 text-lg">
            Attendez ...
          </span>
        )}
        <div className="terminal__prompt">
          <div className="terminal__prompt__input">
          <textarea
            title="zone-de-saisie"
            id='input'
            placeholder=""
            defaultValue={input}
            rows={3}
            onKeyDown={handleInputKeyDown}
            onChange={handleInputChange}
            // @ts-ignore
            ref={inputRef} />
         </div>
        </div>
      </div>
    );
  });

Terminal.displayName = 'Terminal';
export default Terminal;
