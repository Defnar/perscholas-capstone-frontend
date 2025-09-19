import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function JoinRequests({
  messages,
  projectId,
  setCollaborators,
}) {
  const { api } = useContext(AuthContext);

  const navigate = useNavigate();

  const acceptMessage = async (messageId) => {

    console.log(messageId);
    try {
      const response = await api.put(`projects/${projectId}/accept`, {
        messageId: messageId
      } );

      const {project}= response.data;

      console.log(project.user);
      setCollaborators(project.user);
    } catch (err) {
      console.log(err);
    }
  };

  const rejectMessage = async (messageId) => {
    console.log(messageId);
  };

  return (
    <div>
      {!messages || (messages.length === 0 && <p>No messages found</p>)}
      {messages && messages.length > 0 && (
        <>
          <h2>Requests:</h2>
          <ul>
            {messages.map((message) => (
              <li key={message._id}>
                {message.message}{" "}
                <button onClick={() => acceptMessage(message._id)}>
                  Accept
                </button>
                <button onClick={() => rejectMessage(message._id)}>
                  Reject
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
