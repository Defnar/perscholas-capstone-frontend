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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}
