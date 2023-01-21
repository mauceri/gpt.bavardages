import Link from "next/link"
import SignIn from "./signin"

export default function Menu() {
    return (
        < div className="menu" >
            <div>
            <h2>Menu</h2>
                <SignIn />
            </div>
 
        </div>
    )
}