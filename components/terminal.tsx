import { signIn, signOut, useSession } from "next-auth/react"

const Terminal = () => {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <div className="terminal">
      <div className="terminal__line">
        {
          session?.user &&
          <p>Je suis un robot d'OpenAI, je suis là pour bavarder avec vous...</p>
        }
      </div>
      <div className="terminal__prompt">
        <div className="terminal__prompt__label">
          {(!session?.user ? <><p> Connexion nécessaire.</p><p>Menu de connexion invisible ? Hamburger en haut à gauche...</p></> : <p>C'est à vous</p>)}</div>
        <div className="terminal__prompt__input">
          <input title="entrez" type="text" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
