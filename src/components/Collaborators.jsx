import { useState, useEffect, useContext, useMemo } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import AuthContext from "../contexts/AuthContext";
import JoinRequests from "./JoinRequests";
import { Bounce, toast } from "react-toastify";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import EditCollab from "./EditCollab";

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
  const [inviteUser, setInviteUser] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteList, setInviteList] = useState([]);
  const [joinRequestModal, setJoinRequestModal] = useState(false);
  const [editCollabModal, setEditCollabModal] = useState(false);
  const [collabToEdit, setCollabToEdit] = useState();

  const { api } = useContext(AuthContext);
  const visibleCount = 10;

  //sets up the collaborator list as a state
  useEffect(() => {
    setCollaborators([...collabList]);
  }, [collabList]);

  //if component is a sidebar, determines how many to view based on visible count and collaborator length
  const spliceIndex = useMemo(
    () =>
      sidebar
        ? Math.min(collaborators.length, visibleCount)
        : collaborators.length,
    [collaborators, sidebar]
  );

  //opens the collaborator component as a modal
  const toggleModal = () => setModalOpen((prev) => !prev);

  //options for dropdown menu
  const options = ["invite user", "join requests"];

  //takes a user selection from dropdowns and runs function with it
  const optionSelect = (option) => {
    switch (option) {
      case "invite user":
        setInviteUser(true);
        break;
      case "join requests":
        setJoinRequestModal(true);
        break;
    }
  };

  //handler for the invite search bar value
  const handleInviteChange = (e) => setInviteInput(e.target.value);

  //handler for submitting a search and setting the list of users to display
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get("users", {
        params: { username: inviteInput },
      });
      setInviteList(response.data || []);
    } catch (err) {
      console.log(err);
      toast(`${err}`, {
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

  //uses a user id to invite a user to collab on the project
  const inviteUserById = async (userId) => {
    try {
      await api.post(`projects/${projectId}/invite`, { userId });
    } catch (err) {
      toast(`${err.response.data.error}`, {
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

  //sets collab user to edit and enables edit modal
  const editCollaborator = (collab) => {
    setCollabToEdit(collab);
    setEditCollabModal(true);
  };

  //close  edit collaborator modal
  const closeEditCollaboratorModal = () => {
    setEditCollabModal(false);
  };

  return (
    <div className="relative">
      {/*search modal for finding and inviting users*/}
      {inviteUser && (
        <Modal modalOpen={inviteUser} setModalOpen={setInviteUser}>
          <div className="flex flex-col">
            {/*search bar*/}
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
              {/*list of users found*/}
              {inviteList.length === 0 && <p>No users found</p>}
              <ul className="space-y-1 mb-2">
                {inviteList.map((iUser) => (
                  <li key={iUser._id}>
                    {iUser.username}{" "}
                    <button
                      className="px-4 bg-emerald-200 rounded-md shadow-md hover:bg-emerald-300 hover:cursor-pointer"
                      onClick={() => inviteUserById(iUser._id)}
                    >
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

      {/*join requests*/}
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

      {/*opens collaborators as a modal to show all*/}
      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <Collaborators
            collabList={collaborators}
            sidebar={false}
            closeSidebar={toggleModal}
          />
        </Modal>
      )}

      {/*allows editing a single collaborator*/}
      {editCollabModal && (
        <Modal modalOpen={editCollabModal} setModalOpen={setEditCollabModal}>
          <EditCollab
            user={collabToEdit}
            projectId={projectId}
            setCollaborators={setCollaborators}
            closeModal={closeEditCollaboratorModal}
          />
        </Modal>
      )}

      {/*Button for inviting users or responding to requests */}
      {permissions?.includes("inviteUsers") && (
        <Dropdown
          options={options}
          onSelect={optionSelect}
          buttonStyles=" py-1 absolute top-0 right-0"
          className="absolute top-0 right-0"
          position="right"
        >
          <EllipsisVerticalIcon className="w-6 h-6" />{" "}
        </Dropdown>
      )}

      {/*Collaborator list*/}
      <div className="px-4 py-2">
        <h2 className="font-bold text-center text-lg mb-2">Collaborators</h2>
        <ul className="space-y-1 mb-2">
          {collaborators.slice(0, spliceIndex).map((collab) => (
            <li
              key={collab.user._id}
              className="px-2 py-1 rounded-md hover:bg-gray-100 text-center"
            >
              <button onClick={() => editCollaborator(collab)}>
                {collab.user.username}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {sidebar && (
        <div className="flex flex-col ">
          <p className="italic text-sm text-gray-600 mb-2 text-center">
            Showing {Math.min(visibleCount, collaborators.length)} of{" "}
            {collaborators.length}
          </p>
          <button
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md hover:bg-gray-300 hover:cursor-pointer"
            onClick={toggleModal}
          >
            Show all
          </button>
        </div>
      )}
      {!sidebar && (
        <button
          className="bg-gray-200 px-4 py-2 w-full rounded-md shadow-md hover:bg-gray-300 hover:cursor-pointer"
          onClick={closeSidebar}
        >
          Close
        </button>
      )}
    </div>
  );
}
