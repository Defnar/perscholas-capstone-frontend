import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import LoginHandler from "./LoginHandler";
import ProjectEdit from "./ProjectEdit";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import Message from "./Messages";
import { HomeIcon, PlusIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Bounce, toast } from "react-toastify";

export default function Header() {
  const { api, user, setUser, setToken } = useContext(AuthContext);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);

  const toggleLoginModal = () => {
    setLoginModalOpen((prev) => !prev);
  };

  const toggleProjectModal = () => {
    setProjectModalOpen((prev) => !prev);
  };

  const logOut = async () => {
    try {
      await api.post(
        "users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      setToken(null);

      toast(`successfully logged out`, {
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
      toast(`logout failed, see console for more information`, {
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
      console.log(err);
    }
  };

  //close modal on login
  useEffect(() => {
    setLoginModalOpen(false);
  }, [user]);

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
    <div className="flex flex-row items-center justify-between h-13 shadow-md bg-emerald-300 p-4 w-full">
      <div className="flex flex-row gap-5 items-center">
        <Link to="/">
          <HomeIcon className="size-8 hover:cursor-pointer hover:bg-emerald-400 rounded-md" />{" "}
        </Link>
        <h1 className="font-bold italic text-xl">ProTracker</h1>
      </div>
      <div className="flex flex-row items-center gap-5 ">
        {!user && (
          <button
            className="hover:cursor-pointer hover:bg-emerald-400 px-4 py-2 rounded-md"
            onClick={toggleLoginModal}
          >
            Login/register
          </button>
        )}
        {user && (
          <>
            <button
              className="hover:cursor-pointer hover:bg-emerald-400 px-4 py-2 rounded-md"
              onClick={toggleProjectModal}
            >
              <PlusIcon className="size-8 sm:hidden" />
              <span className="hidden sm:block">New Project</span>
            </button>
            <Dropdown
              buttonStyles="bg-emerald-400 px-2 py-1 rounded-md shadow-md flex flex-row gap-1 hover:cursor-pointer hover:bg-emerald-500"
              options={options}
              onSelect={selectOption}
            >
              <UserCircleIcon className="size-8" />
              <span className="hidden sm:block">{user.username}</span>{" "}
            </Dropdown>{" "}
          </>
        )}
      </div>
      {messagesModalOpen && (
        <Modal
          modalOpen={messagesModalOpen}
          setModalOpen={setMessagesModalOpen}
        >
          <Message messages={user.message} />
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
    </div>
  );
}
