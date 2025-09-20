import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import LoginHandler from "./LoginHandler";
import ProjectEdit from "./ProjectEdit";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import Message from "./Messages";
import { HomeIcon, PlusIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const { api, user, setUser, setToken } = useContext(AuthContext);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);

  console.log(user);
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

  const toggleDropDown = () => {
    setUserDropdown((prev) => !prev);
  };
  return (
    <div className="flex flex-row items-center justify-between h-13 shadow-md bg-emerald-300 p-4">
      <div className="flex flex-row gap-5 items-center">
        <Link to="/">
          <HomeIcon className="size-8 hover:cursor-pointer hover:bg-emerald-400 rounded-md" />{" "}
        </Link>
        <h1 className="font-bold italic text-xl">ProTracker</h1>
      </div>
      <div className="flex flex-row items-center gap-5 ">
        {!user && <button className="hover:cursor-pointer hover:bg-emerald-400 px-4 py-2 rounded-md" onClick={toggleLoginModal}>Login/register</button>}
        {user && (
          <button className="hover:cursor-pointer hover:bg-emerald-400 px-4 py-2 rounded-md" onClick={toggleProjectModal}>
            <PlusIcon className="size-8 sm:hidden" />
            <span className="hidden sm:block">New Project</span>
          </button>
        )}
        <div className="relative">
          {user && (
            <button
              className="bg-emerald-400 px-2 py-1 rounded-md shadow-md flex flex-row gap-1 hover:cursor-pointer hover:bg-emerald-500"
              onClick={toggleDropDown}
            >
              <UserCircleIcon className="size-8" />
              {user.username}
            </button>
          )}
          {userDropdown && (
            <Dropdown
              options={options}
              onSelect={selectOption}
              setOpen={setUserDropdown}
            />
          )}
        </div>
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
