import {
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
    RedirectToSignIn,
} from "@clerk/clerk-react";

export default function Menu() {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        < div className="menu" >
            <SignedIn>
                {user ?
                    <><UserButton /><p>{user.firstName} </p></> : null
                }
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>

    )
}