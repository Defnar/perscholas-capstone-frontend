import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function Collaborators({ collabList, sidebar = true }) {
  const [collaborators, setCollaborators] = useState(collabList);
  const [count, setCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const visibleCount = 10;

  console.log(collabList);

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

  return (
    <>
      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <Collaborators collabList={collaborators} sidebar={false} />
        </Modal>
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
