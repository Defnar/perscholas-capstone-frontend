import { useEffect, useRef } from "react";

export default function Dropdown({ options, onSelect, openDropdown, setOpen }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    setOpen(openDropdown);
  }, [openDropdown, setOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current) {
        if (event && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (dropdownRef.current) {
        if (event && event.key === "Escape") setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      {open && (
        <ul>
          {options.map((option) => (
            <li
              key={option}
              value={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
