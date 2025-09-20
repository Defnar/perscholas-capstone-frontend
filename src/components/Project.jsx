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
      const response = await api.post(`message/projects/${projectId}`, {
        message: message,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const categoryStyles = "font-semibold"
  return (
    <div className="border border-gray-200 shadow-md">
      <h2 className="font-bold">{title}</h2>
      {!userProject && <p><span className={categoryStyles}>Owner: </span> {owner}</p>}
      <p><span className={categoryStyles}>About:</span> {description}</p>
      <p><span className={categoryStyles}>Status: </span>{status}</p>

      {!userProject && user && (
        <button onClick={onJoinRequest} className="bg-emerald-200 px-4 py-2 rounded-md mb-2">Request to join project</button>
      )}
    </div>
  );
}
