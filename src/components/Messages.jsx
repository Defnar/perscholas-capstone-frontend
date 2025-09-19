import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

export default function Message({ messageType, messages }) {
  const { api } = useContext(AuthContext);

  const acceptMessage = async (messageId) => {
    if (messageType === "user") {
    try {
      const response = await api.post(`message/${messageId}`);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }};

  const rejectMessage = async (messageId) => {
    try {
      const response = await api.post(`message/${messageId}/reject`);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!messages || messages && messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div>
          <h2>Requests: </h2>
          <ul>
            {messages.map((message) => (
              <li key={message._id}>
                {message.message}{" "}
                <button onClick={() => acceptMessage(message._id)}>
                  accept
                </button>
                <button onClick={() => rejectMessage(message.id)}>reject</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
