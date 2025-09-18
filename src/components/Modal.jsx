import { useEffect, useRef } from "react";

export default function Modal({ children, modalOpen, setModalOpen }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current) {
        if (event && !modalRef.current.contains(event.target)) {
          setModalOpen(false);
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (modalRef.current) {
        if (event && event.key === "Escape") setModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [modalOpen, setModalOpen]);

  return <>{modalOpen && <div ref={modalRef}>{children}</div>}</>;
}
