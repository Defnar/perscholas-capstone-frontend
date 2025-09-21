import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import LoaderSpinner from "./LoaderSpinner";
import { Bounce, toast } from "react-toastify";

export default function Message() {
  const { api } = useContext(AuthContext);

  const [data, loading, error] = useFetch("users/messages");

  const acceptMessage = async (messageId) => {
    try {
      await api.post(`message/${messageId}`);

      
      toast(`successfully joined project, check your private projects`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

    } catch (err) {
      console.log(err);
      toast(`failed to load messages`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
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
