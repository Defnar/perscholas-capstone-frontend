import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"

export default function Project({ title, owner, description, status, userProject = false }) {

    const {user} = useContext(AuthContext);
 
    return (
    <div>
      <h2>{title}</h2>
      <p>owned by {owner}</p>
      <p>description: {description}</p>
      <p>status: {status}</p>

      {!userProject && user && <button>Request to join project</button>}
    </div>
  );
}
