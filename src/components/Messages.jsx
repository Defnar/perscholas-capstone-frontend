export default function Message({ messageType, messages }) {

    const acceptMessage


  return (
    <>
      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div>
          <h2>Requests: </h2>
          <ul>
            {messages.map((message) => (
              <li key={message._id}>
                {message.message} <button onClick={acceptMessage}>accept</button>
                <button onClick={rejectMessage}>reject</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
