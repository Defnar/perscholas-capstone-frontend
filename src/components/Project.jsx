import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import toastMessage from "../utils/toastMessage";

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
      await api.post(`message/projects/${projectId}`, {
        message: message,
      });
      toastMessage("successfully requested to join the project");
    } catch (err) {
      console.log(err);
      toastMessage(`${err.response.data.error}`);
    }
  };

  const categoryStyles = "font-semibold";
  return (
    <div className="border border-gray-200 shadow-md p-2">
      <h2 className="font-bold">{title}</h2>
      {!userProject && (
        <p>
          <span className={categoryStyles}>Owner: </span> {owner}
        </p>
      )}
      <p>
        <span className={categoryStyles}>About:</span> {description}
      </p>
      <p>
        <span className={categoryStyles}>Status: </span>
        {status}
      </p>

      {!userProject && user && (
        <button
          onClick={onJoinRequest}
          className="bg-emerald-200 px-4 py-2 rounded-md mb-2 hover:bg-emerald-300 hover:cursor-pointer"
        >
          Request to join project
        </button>
      )}
    </div>
  );
}
