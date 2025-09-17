import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import LoginHandler from "./LoginHandler";

export default function Header() {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);

  const openLoginModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <p>home button</p>
      <h1>ProTracker</h1>
      {!user && <button onClick={openLoginModal}>Login/register</button>}
      {user && <button>profile button</button>}
      <button>dark mode button</button>

      {modalOpen && (<Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <LoginHandler closeModal={closeModal}/>
      </Modal>)}
    </>
  );
}
