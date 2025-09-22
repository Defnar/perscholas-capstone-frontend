import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import toastMessage from "../utils/toastMessage";

export default function JoinRequests({
  messages,
  projectId,
  setCollaborators,
}) {
  const { api } = useContext(AuthContext);

  const [messageList, setMessageList] = useState(messages);

  //sets messages to state
  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  //accepts message, changes state, sends data to abckend
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
      toastMessage("User successfully added to project");
    } catch (err) {
      console.log(err);
      toastMessage("Failed to add user to project");
    }
  };

  //rejects message, sets state, sends changes to backend
  const rejectMessage = async (messageId) => {
    try {
      await api.put(`projces/${projectId}/reject`, {
        messageId: messageId,
      });
      toastMessage("successfully rejected user");
      setMessageList((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    } catch (err) {
      console.log(err);
      toastMessage("failed to reject user from project");
    }
  };

  return (
    <div>
      {!messageList || (messageList.length === 0 && <p>No messages found</p>)}
      {messageList && messageList.length > 0 && (
        <>
          <h2>Requests:</h2>
          <ul className="space-y-2">
            {messageList.map((message) => (
              <li
                className="border border-gray-100 shadow-sm flex flex-col p-2"
                key={message._id}
              >
                {message.message}{" "}
                <div>
                  <div className="flex flex-row justify-between">
                    <button
                      className="px-4 py-2 bg-emerald-200 rounded-md shadow-md hover:bg-emerald-300 hover:cursor-pointer"
                      onClick={() => acceptMessage(message._id)}
                    >
                      accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-200 rounded-md shadow-md hover:bg-red-300 hover:cursor-pointer"
                      onClick={() => rejectMessage(message._id)}
                    >
                      reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
