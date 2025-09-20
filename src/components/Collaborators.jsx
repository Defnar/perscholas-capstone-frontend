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
  closeSidebar,
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

  const spliceIndex = useMemo(
    () =>
      sidebar
        ? Math.min(collaborators.length, visibleCount)
        : collaborators.length,
    [collaborators, sidebar]
  );

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
        <Modal modalOpen={inviteUser} setModalOpen={setInviteUser}>
          <div className="flex flex-col">
            <h2 className="font-bold text-center">Search For Users</h2>
            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-2">
              <div>
                <label htmlFor="invite">Username: </label>
                <input
                  className="flex-1 shadow-md border border-gray-200 max-h-7 bg-gray-100"
                  type="text"
                  name="invite"
                  value={inviteInput}
                  onChange={handleInviteChange}
                />
                <button
                  className="bg-emerald-200 hover:bg-emerald-300 px-4 rounded-md shadow-md"
                  type="submit"
                >
                  Search
                </button>
              </div>
              {inviteList.length === 0 && <p>No users found</p>}
                <ul className="space-y-1 mb-2">
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
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md shadow-md"
                onClick={() => {
                  setInviteUser(false);
                  setInviteList([]);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </Modal>
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
          <Collaborators
            collabList={collaborators}
            sidebar={false}
            closeSidebar={toggleModal}
          />
        </Modal>
      )}

      {permissions?.includes("inviteUsers") && (
        <div className="flex flex-col mb-4">
          <button
            className="bg-emerald-200 rounded-md px-4 py-2 shadow-md hover:bg-emerald-300"
            onClick={() => setDropdown(true)}
          >
            Add Collaborators
          </button>
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

      <div className="px-4 py-2">
        <h2 className="font-bold text-center text-lg mb-2">Collaborators</h2>
        <ul className="space-y-1 mb-2">
          {collaborators.slice(0, spliceIndex).map((collab) => (
            <li
              key={collab.user._id}
              className="px-2 py-1 rounded-md hover:bg-gray-100"
            >
              {collab.user.username}
            </li>
          ))}
        </ul>
      </div>

      {sidebar && (
        <>
          <p className="italic text-sm text-gray-600 mb-2">
            Showing {Math.min(visibleCount, collaborators.length)} of{" "}
            {collaborators.length}
          </p>
          <button
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md hover:bg-gray-300 hover:cursor-pointer"
            onClick={toggleModal}
          >
            Show all
          </button>
        </>
      )}
      {!sidebar && (
        <button
          className="bg-gray-200 px-4 py-2 w-full rounded-md shadow-md hover:bg-gray-300 hover:cursor-pointer"
          onClick={closeSidebar}
        >
          Close
        </button>
      )}
    </>
  );
}
