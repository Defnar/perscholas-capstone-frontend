import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"

export default function Header() {

    const {user} = useContext(AuthContext);
    
    return (
        <>
        <p>home button</p>
        <h1>ProTracker</h1>
        {!user && <button>Login/register</button>}
        {user && <button>profile button</button>}
        <button>dark mode button</button>
        </>
    )
}