import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import AuthContext from "../contexts/AuthContext";

export default function Collaborators({
  collabList,
  sidebar = true,
  permissions,
  projectId,
}) {
  const [collaborators, setCollaborators] = useState(collabList);
  const [count, setCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [inviteUser, setInviteUser] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteList, setInviteList] = useState(null);

  const { api } = useContext(AuthContext);
  const visibleCount = 10;

  useEffect(() => {
    setCount(collaborators.length);
    console.log(collaborators.length);
  }, [collaborators]);

  useEffect(() => {
    setCollaborators(collabList);
  }, [collabList]);

  const spliceIndex = sidebar ? Math.min(count, visibleCount) : count;

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  const options = ["invite user", "join requests"];

  const optionSelect = (option) => {
    switch (option) {
      case "invite user":
        setInviteUser(true);
        break;
      case "join requests":
        break;
    }
  };

  const handleInviteChange = (event) => {
    setInviteInput(event.target.value);
  };

  const handleInviteSubmit = async () => {
    event.preventDefault();
    try {
      const response = await api.get("users", {
        params: {
          username: inviteInput,
        },
      });

      setInviteList(response.data || []);
    } catch (err) {
      console.log(err); //toastify message
    }
  };

  const inviteUserById = async (userId) => {
    try {
      const response = await api.post(`projects/${projectId}/invite`, {
        userId: userId,
      });

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {inviteUser && (
        <div>
          <form onSubmit={handleInviteSubmit}>
            <label htmlFor="invite">Search by username: </label>
            <input
              type="text"
              name="invite"
              value={inviteInput}
              onChange={handleInviteChange}
            />
            <button type="submit">Search</button>
            {inviteList?.length === 0 && <p>No users found</p>}
            <ul>
              {inviteList &&
                inviteList.map((iUser) => (
                  <li key={iUser._id}>
                    {iUser.username}{" "}
                    <button onClick={() => inviteUserById(iUser._id)}>
                      Invite
                    </button>
                  </li>
                ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                setInviteUser(false);
                setInviteList(null);
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}
      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <Collaborators collabList={collaborators} sidebar={false} />
        </Modal>
      )}
      {permissions && permissions.includes("inviteUsers") && (
        <div>
          <button onClick={() => setDropdown(true)}>options</button>
          {dropdown && (
            <Dropdown
              options={options}
              setOpen={setDropdown}
              onSelect={optionSelect}
              openDropdown={true}
            />
          )}
        </div>
      )}
      <h2>Collaborators</h2>
      <ul>
        {collaborators &&
          collaborators
            .slice(0, spliceIndex)
            .map((collab) => <li key={collab._id}>{collab.user.username}</li>)}
      </ul>
      {sidebar && (
        <p>
          Showing {Math.min(visibleCount, count)} of {count}
        </p>
      )}
      {sidebar && <button onClick={toggleModal}>Show all</button>}
    </>
  );
}
