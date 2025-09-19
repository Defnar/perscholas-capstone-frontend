import { useState, useEffect, useContext, useMemo } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import AuthContext from "../contexts/AuthContext";
import JoinRequests from "./JoinRequests";

export default function Collaborators({
  collabList,
  sidebar = true,
  permissions,
  projectId,
  joinRequests,
}) {
  const [collaborators, setCollaborators] = useState([...collabList]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [inviteUser, setInviteUser] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteList, setInviteList] = useState([]);
  const [joinRequestModal, setJoinRequestModal] = useState(false);

  const { api } = useContext(AuthContext);
  const visibleCount = 10;

  useEffect(() => {
    setCollaborators([...collabList]);
  }, [collabList]);

  const spliceIndex = useMemo(() => sidebar
    ? Math.min(collaborators.length, visibleCount)
    : collaborators.length, [collaborators, sidebar])

  const toggleModal = () => setModalOpen((prev) => !prev);

  const options = ["invite user", "join requests"];

  const optionSelect = (option) => {
    switch (option) {
      case "invite user":
        setInviteUser(true);
        break;
      case "join requests":
        setJoinRequestModal(true);
        break;
    }
    setDropdown(false);
  };

  const handleInviteChange = (e) => setInviteInput(e.target.value);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get("users", {
        params: { username: inviteInput },
      });
      setInviteList(response.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const inviteUserById = async (userId) => {
    try {
      await api.post(`projects/${projectId}/invite`, { userId });
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
            {inviteList.length === 0 && <p>No users found</p>}
            <ul>
              {inviteList.map((iUser) => (
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
                setInviteList([]);
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}

      {joinRequestModal && (
        <Modal modalOpen={joinRequestModal} setModalOpen={setJoinRequestModal}>
          <JoinRequests
            messages={joinRequests}
            projectId={projectId}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
          />
        </Modal>
      )}

      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <Collaborators collabList={collaborators} sidebar={false} />
        </Modal>
      )}

      {permissions?.includes("inviteUsers") && (
        <div>
          <button onClick={() => setDropdown(true)}>Options</button>
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
        {collaborators.slice(0, spliceIndex).map((collab) => (
          <li key={collab.user._id}>{collab.user.username}</li>
        ))}
      </ul>

      {sidebar && (
        <p>
          Showing {Math.min(visibleCount, collaborators.length)} of{" "}
          {collaborators.length}
        </p>
      )}
      {sidebar && <button onClick={toggleModal}>Show all</button>}
    </>
  );
}
