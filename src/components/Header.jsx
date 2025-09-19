import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import LoginHandler from "./LoginHandler";
import ProjectEdit from "./ProjectEdit";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import Message from "./Messages";

export default function Header() {
  const { api, user, setUser, setToken } = useContext(AuthContext);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);

  const toggleLoginModal = () => {
    setLoginModalOpen((prev) => !prev);
  };

  const toggleProjectModal = () => {
    setProjectModalOpen((prev) => !prev);
  };

  const logOut = async () => {
    try {
      const response = await api.post(
        "users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      setToken(null);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const options = ["messages", "logout"];

  const selectOption = (option) => {
    switch (option) {
      case "messages":
        setMessagesModalOpen(true);
        break;
      case "logout":
        logOut();
        break;
    }
  };

  return (
    <>
      <Link to="/">Home button</Link>
      <h1>ProTracker</h1>
      {!user && <button onClick={toggleLoginModal}>Login/register</button>}
      {user && <button onClick={toggleProjectModal}>New Project</button>}
      {user && (
        <button onClick={() => setUserDropdown(true)}>{user.username}</button>
      )}
      {userDropdown && (
        <Dropdown
          options={options}
          onSelect={selectOption}
          setOpen={setUserDropdown}
        />
      )}

      <button>dark mode button</button>
      {messagesModalOpen && (
        <Modal
          modalOpen={messagesModalOpen}
          setModalOpen={setMessagesModalOpen}
        >
          <Message messages={user.messages} />
        </Modal>
      )}

      {projectModalOpen && (
        <Modal modalOpen={projectModalOpen} setModalOpen={setProjectModalOpen}>
          <ProjectEdit
            closeModal={toggleProjectModal}
            title={undefined}
            description={undefined}
            _id={undefined}
            status={undefined}
            deadline={undefined}
            privateProject={undefined}
          />
        </Modal>
      )}
      {loginModalOpen && (
        <Modal modalOpen={loginModalOpen} setModalOpen={setLoginModalOpen}>
          <LoginHandler closeModal={toggleLoginModal} />
        </Modal>
      )}
    </>
  );
}
