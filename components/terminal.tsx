import { ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  useUser,
} from "@clerk/clerk-react";
import { EditBavardageData } from './edit-bavardage';
import { message } from "antd";

interface TerminalProps {
  style?: React.CSSProperties;
  bavardage: EditBavardageData;
}
const Terminal = forwardRef<HTMLDivElement, TerminalProps>(({ bavardage, style }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [echange, setEchange] = useState("");
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

  useEffect(() => {
    message.info(bavardage.name);
    if (user) {
      fetch("/api/queryMDB?op=get_bavardage&user=" + user?.id+
      "&name="+bavardage.name+
      "&date="+bavardage.date)
        .then((res) => res.json())
        .then((res) => {
          console.log("Retour queryMDB ",res);
          message.info(res.name+" "+res.date+" récupéré");
        }).catch((err: any) => {
          console.log(err.message)
        });

    }
  }, [bavardage])

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const [echanges, setEchanges] = useState([
    {
      echange: "Bonjour, Je suis votre assistant virtuel ! Que puis-je faire pour vous ?",
      from: "ai",
    },
  ]);
  const processMessage = async (message: string) => {
    const qargs =
      JSON.stringify({
        "APIKeyMissing": apiKeyMissing,
        "user": user,
        "message": message,
      });
    axios
      .post("/api/prompt?args=" + qargs, {
        "APIKeyMissing": apiKeyMissing,
        "user": user,
        "message": message,
      })
      .then((res) => {
        if (apiKeyMissing && res.data.message === "Update OK") {
          setApiKeyMissing(false);
          setEchanges((echanges) => [
            ...echanges,
            { from: "ai", echange: "La clef a bien été enregistrée" },
          ]);
        } else {
          setEchanges((echanges) => [
            ...echanges,
            { from: "ai", echange: res.data.message },
          ]);
        }
      })
      .catch((err) => {
        console.log("Erreur ", err.response.data.message);
        console.log("Erreur ", err.response.data.status);
        if (err.response.data.message === "OpenAI API key missing" || err.response.data.status === 401) {
          setApiKeyMissing(true);
        }
        if (err.response.data.message === "Update failed") {
          console.log("La mise à jour a échoué");
        }
        if (err.response.data.message === "User not found") {
          console.log("Utilisateur inconnu");
        }
        if (err.response.data.statusText === "Unauthorized") {
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
    setEchanges((echanges) => [
      ...echanges,
      { from: "user", echange: echange },
    ]);
    processMessage(echange);
    setEchange("");
  };
  /**
   * When user types something, we update the input value
   */
  const handleInputChange =
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      setEchange(e.target.value)
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
        setEchange("");
        //setInputValue('');
        (document.getElementById("input") as HTMLTextAreaElement).value = "";
      }
    };

  return (
    <div className="terminal" onDoubleClick={focusInput} style={style} >
      {echanges.map((echange, index) => {
        return echange.from === "ai" ? (
          <div className="terminal__line" id="ai" key={`terminal-line-${index}-${echange}`}>
            <span style={{ color: 'blue' }}><strong>IA: </strong></span> {echange.echange}
          </div>
        ) : (
          <div key={index} id="user" className="terminal__line">
            <span style={{ color: 'blue' }}><strong>{user ? user.firstName + ":" : "Humain:"} </strong></span> {echange.echange}
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
          Vous n'avez pas encore enregistré de clé d'API OpenAI valide. Veuillez donner une clé valide ci-dessous.
        </span>
      )}
      <div className="terminal__prompt">
        <span className="align-textarea" style={{ color: 'blue' }}><strong>{user ? user.firstName + ":" : "Humain:"} </strong></span>
        <div className="terminal__prompt__input">
          <textarea
            title="zone-de-saisie"
            id='input'
            placeholder=""
            defaultValue={input}
            rows={3}
            onKeyDown={handleInputKeyDown}
            onChange={handleInputChange}
            style={style}
            // @ts-ignore
            ref={inputRef} />
        </div>
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';
export default Terminal;
