import {
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
    RedirectToSignIn,
} from "@clerk/clerk-react";
//Retrouver le compte original...
export default function MenuClerk() {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        < div className="menu-clerk" >
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