
import { signIn, signOut, useSession } from "next-auth/react"

export default function SignIn() {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    return (
        <div>
            <p>
                {!session && (
                    <a href={`/api/auth/signin`} onClick={(e) => {
                        e.preventDefault()
                        signIn()
                        if(session?.user.email != "cmauceri@gmail.com"){signOut}
                    }}>
                        connexion
                    </a>
                )}
                {session?.user && (
                    <span>
                        <strong>{session.user.email ?? session.user.name}</strong>&nbsp;
                        <a href={`/api/auth/signout`}
                            onClick={(e) => {
                                e.preventDefault()
                                signOut()
                            }}>
                            déconnexion
                        </a>
                    </span>
                )}
            </p>
        </div>
    );
}

