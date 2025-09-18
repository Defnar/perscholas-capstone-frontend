import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import LoginHandler from "./LoginHandler";
import ProjectEdit from "./ProjectEdit";
import { Link } from "react-router-dom";

export default function Header() {
  const { user } = useContext(AuthContext);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  console.log(user);

  const toggleLoginModal = useCallback(() => {
    setLoginModalOpen((prev) => !prev);
  }, [setLoginModalOpen]);

  const toggleProjectModal = useCallback(() => {
    setProjectModalOpen((prev) => !prev);
  }, [setProjectModalOpen]);

  return (
    <>
      <Link to="/">Home button</Link>
      <h1>ProTracker</h1>
      {!user && <button onClick={toggleLoginModal}>Login/register</button>}
      {user && <button onClick={toggleProjectModal}>New Project</button>}
      {user && <button>profile button</button>}
      <button>dark mode button</button>

      {projectModalOpen && (
        <Modal modalOpen={projectModalOpen} setModalOpen={setProjectModalOpen}>
          <ProjectEdit closeModal={toggleProjectModal} />
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
