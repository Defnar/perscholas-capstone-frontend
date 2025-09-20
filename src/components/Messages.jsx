import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";

export default function Message() {
  const { api } = useContext(AuthContext);

  const [data, loading, error] = useFetch("users/messages");

  const acceptMessage = async (messageId) => {
    try {
      const response = await api.post(`message/${messageId}`);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

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
      {!data || (data && data.length === 0) ? (
        <p>No messages found</p>
      ) : (
        <div>
          <h2>Requests: </h2>
          <ul>
            {data.map((message) => (
              <li key={message._id}>
                {message.message}{" "}
                <button onClick={() => acceptMessage(message._id)}>
                  accept
                </button>
                <button onClick={() => rejectMessage(message._id)}>
                  reject
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
