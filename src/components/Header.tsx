import { useCallback, useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import LoginHandler from "./LoginHandler";
import ProjectEdit from "./ProjectEdit";
import { Link } from "react-router-dom";

export default function Header() {

  const { api, user, setUser, setToken } = useContext(AuthContext);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  console.log(user);

  const toggleLoginModal = useCallback(() => {
    setLoginModalOpen((prev) => !prev);
  }, [setLoginModalOpen]);

  const toggleProjectModal = useCallback(() => {
    setProjectModalOpen((prev) => !prev);
  }, [setProjectModalOpen]);

  const logOut = async () => {
    try {
    const response = await api.post("users/logout");
    
    setUser(null);
    setToken(null);

    console.log(response);
    } catch(err) {
      console.log(err);
    }

  }

  return (
    <>
      <Link to="/">Home button</Link>
      <h1>ProTracker</h1>
      {!user && <button onClick={toggleLoginModal}>Login/register</button>}
      {user && <button onClick={toggleProjectModal}>New Project</button>}
      {user && <button>profile button</button>}
      {user && <button onClick={logOut}>Log out</button>}
      <button>dark mode button</button>

      {projectModalOpen && (
        <Modal modalOpen={projectModalOpen} setModalOpen={setProjectModalOpen}>
          <ProjectEdit closeModal={toggleProjectModal} title={undefined} description={undefined} _id={undefined} status={undefined} deadline={undefined} privateProject={undefined} />
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
