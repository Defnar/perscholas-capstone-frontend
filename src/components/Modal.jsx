import { useEffect, useRef, useState } from "react";

export default function Modal({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  //open modal on mount
  useEffect(() => {
    setModalOpen(true);
  }, []);

  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (modalRef.current) {
        if (event.key === "Escape") setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("mousedown", handleOutsideClick());
      document.addEventListener("keydown", handleEscapeKey());
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey());
    }
  }, [modalOpen]);

  return <div>{modalOpen && <div ref={modalRef}>{children({closeModal})}</div>}</div>;
}
