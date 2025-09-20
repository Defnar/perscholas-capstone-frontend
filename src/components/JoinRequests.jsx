import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function JoinRequests({
  messages,
  projectId,
  setCollaborators,
}) {
  const { api } = useContext(AuthContext);

  const [messageList, setMessageList] = useState(messages);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  const acceptMessage = async (messageId) => {
    try {
      const response = await api.put(`projects/${projectId}/accept`, {
        messageId: messageId,
      });

      const { project } = response.data;

      setCollaborators(project.user);
      setMessageList((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const rejectMessage = async (messageId) => {
    try {
      const response = await api.put(`projces/${projectId}/reject`, {
        messageId: messageId,
      });

      console.log(response);
      setMessageList((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {!messageList || (messageList.length === 0 && <p>No messages found</p>)}
      {messageList && messageList.length > 0 && (
        <>
          <h2>Requests:</h2>
          <ul>
            {messageList.map((message) => (
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
