import { ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { userAgent } from "next/server";


const Terminal = forwardRef(
  () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [apiKeyMissing, setApiKeyMissing] = useState(false);
   
    const inputRef = useRef<HTMLInputElement>();
    const [input, setInputValue] = useState<string>('');
    const { isLoaded, isSignedIn, user } = useUser();

    /**
     * Focus on the input whenever we render the terminal or click in the terminal
     */
    useEffect(() => {
      inputRef.current?.focus();
    });

    const focusInput = () => {
      inputRef.current?.focus();
    };

    const [messages, setMessages] = useState([
      {
        message: "Bonjour, Je suis votre assistant virtuel ! Que puis-je faire pour vous ?",
        from: "ai",
      },
    ]);
    const processMessage = async (message: string) => {
      
      axios
        .post("/api/prompt", {
          "APIKeyMissing": apiKeyMissing,
          "user":user,
          "message": message,
        })
        .then((res) => {
          if(apiKeyMissing && res.data.message === "Update OK") {
            setApiKeyMissing(false);
            setMessages((messages) => [
              ...messages,
              { from: "ai", message: "La clef a été enregistrée" },
            ]);
          } else {
          setMessages((messages) => [
            ...messages,
            { from: "ai", message: res.data.message },
          ]);
        }
        })
        .catch((err) => {
          console.log(err.response.data);
          if (err.response.data.message === "OpenAI API key missing") {
            setApiKeyMissing(true);
          }
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
    const handleInputChange =
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        setMessage(e.target.value)
      };

    /**
     * When user presses enter, we execute the command
     */
    const handleInputKeyDown =
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
          let commandToExecute = null;
          e.preventDefault();
          setIsLoading(true);
          submitMessage(e);
          setMessage("");
          //setInputValue('');
          (document.getElementById("input") as HTMLTextAreaElement).value = "";
        }
      };
      
    
    return (
      <div className="terminal" onDoubleClick={focusInput}>
        {messages.map((message, index) => {
          return message.from === "ai" ? (
            <div className="terminal__line" id="ai" key={`terminal-line-${index}-${message}`}>
              <span style={{ color: 'yellow' }}><strong>IA: </strong></span> {message.message}
            </div>
          ) : (
            <div key={index} id="user" className="terminal__line">
              <span style={{ color: 'yellow' }}><strong>{user ? user.firstName + ":" : "Humain:"} </strong></span> {message.message}
            </div>
          );
        })}
        {isLoading && (
          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 text-lg">
            Attendez ...
          </span>
        )}
        {apiKeyMissing && (
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600 text-lg">
              OpenAI API key is missing. Enter your OpenAI API key below.
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
