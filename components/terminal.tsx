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
interface Replique {
  replique: string;
  from: string;
}


const Terminal = forwardRef<HTMLDivElement, TerminalProps>(({ bavardage, style }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [replique, setReplique] = useState("");
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const inputRef = useRef<HTMLInputElement>();
  const [input, setInputValue] = useState<string>('');
  const { isLoaded, isSignedIn, user } = useUser();


  function getHistory() {
    let lhistory = "";
    repliques.map((item: Replique, _index: number) => {
      lhistory = lhistory + "\n\n" + item.from + ": " + item.replique;
      console.log("Élément historique ", item);
      return;
    });
    //console.log("Historique local :", lhistory);
    return lhistory;
  }
  /**
   * Focus on the input whenever we render the terminal or click in the terminal
   */
  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    console.log("Bavardage a changé il vaut maintenant: ", bavardage);
    if (user) {
      fetch("/api/queryMDB?op=get_bavardage&user=" + user?.id +
        "&name=" + bavardage.name +
        "&date=" + bavardage.date)
        .then((res) => res.json())
        .then((res) => {
          message.info(res.name + " " + res.date + " récupéré");
          setRepliques(res.repliques);
        }).catch((err: any) => {
          console.log(err.message)
        });
    }
  }, [bavardage])

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const [repliques, setRepliques] = useState([
    {
      replique: "Bonjour, Je suis votre assistant virtuel ! Que puis-je faire pour vous ?",
      from: "IA",
    },
  ]);
  const processReplique = async (replique: string) => {

    axios
      .post("/api/prompt?", {
        "APIKeyMissing": apiKeyMissing,
        "user": user,
        "prompt": bavardage.param + "\n" +
          getHistory() + "\n" +
          user?.firstName + ": " + replique,
      })
      .then((res) => {
        if (apiKeyMissing && res.data.message === "Update OK") {
          setApiKeyMissing(false);
          setRepliques((repliques) => [
            ...repliques,
            { from: "IA", replique: "La clef a bien été enregistrée" },
          ]);
        } else {
          fetch("/api/queryMDB?op=push_replique&user=" + user?.id +
            "&name=" + bavardage.name +
            "&date=" + bavardage.date +
            "&from=" + "IA" +
            "&replique=" + res.data.message)
            .then((res) => res.json())
            .then((res) => {
              //console.log(res);
            }).catch((err: any) => {
              console.log(err)
            });
          setRepliques((repliques) => [
            ...repliques,
            { from: "IA", replique: res.data.message },
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



  const submitReplique = (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setRepliques((repliques) => [
      ...repliques,
      { from: user?.firstName as string, replique: replique },
    ]);

    processReplique(replique);
    fetch("/api/queryMDB?op=push_replique&user=" + user?.id +
      "&name=" + bavardage.name +
      "&date=" + bavardage.date +
      "&from=" + user?.firstName +
      "&replique=" + replique)
      .then((res) => res.json())
      .then((res) => {
        //message.info("réplique "+replique+" de "+user?.firstName + "sauvée");
        //console.log(res)
      }).catch((err: any) => {
        console.log(err.message)
      });

    setReplique("");
  };
  /**
   * When user types something, we update the input value
   */
  const handleInputChange =
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      setReplique(e.target.value)
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
        submitReplique(e);
        setReplique("");
        //setInputValue('');
        (document.getElementById("input") as HTMLTextAreaElement).value = "";
      }
    };

  return (
    <div className="terminal" onDoubleClick={focusInput} style={style} >
      {repliques.map((replique, index) => {
        return replique.from === "IA" ? (
          <div className="terminal__line" id="ai" key={`terminal-line-${index}-${replique}`}>
            <span style={{ color: 'blue' }}><strong>IA: </strong></span> {replique.replique}
          </div>
        ) : (
          <div key={index} id="user" className="terminal__line">
            <span style={{ color: 'blue' }}><strong>{user ? user.firstName + ":" : "Humain:"} </strong></span> {replique.replique}
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
