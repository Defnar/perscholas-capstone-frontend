import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import LoaderSpinner from "./LoaderSpinner";
import toastMessage from "../utils/toastMessage";

export default function Message() {
  const { api } = useContext(AuthContext);

  const [data, loading, error] = useFetch("users/messages");

  const acceptMessage = async (messageId) => {
    try {
      await api.post(`message/${messageId}`);

      toastMessage("successfully joined project, check your private projects");
    } catch (err) {
      console.log(err);
      toastMessage("failed to load messages");
    }
  };

  const rejectMessage = async (messageId) => {
    try {
      await api.post(`message/${messageId}/reject`);
      toastMessage("rejected joining the project");
    } catch (err) {
      console.log(err);
      toastMessage("error occurred, check logs for more info");
    }
  };

  return (
    <>
      {loading && <LoaderSpinner />}
      {error && <p>Failed with the following error: ${error.message}</p>}
      {!data || (data && data.length === 0) ? (
        <p>No messages found</p>
      ) : (
        <div>
          <h2>Requests: </h2>
          <ul className="space-y-2">
            {data.map((message) => (
              <li
                className="border border-gray-100 shadow-sm flex flex-col p-2"
                key={message._id}
              >
                {message.message}{" "}
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
