import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

export default function Project({
  projectId,
  title,
  owner,
  description,
  status,
  userProject = false,
}) {
  const { user, api } = useContext(AuthContext);

  const onJoinRequest = async () => {
    try {
      const message = `${user.username} would like to join the project`;
      const response = await api.post(`messages/project/${projectId}`, {
        message: message,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>owned by {owner}</p>
      <p>description: {description}</p>
      <p>status: {status}</p>

      {!userProject && user && (
        <button onClick={onJoinRequest}>Request to join project</button>
      )}
    </div>
  );
}
