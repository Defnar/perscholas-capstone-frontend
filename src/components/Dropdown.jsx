import { useEffect, useRef } from "react";

export default function Dropdown({ options, onSelect, setOpen }) {
  const dropdownRef = useRef(null);

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
    <div ref={dropdownRef} className="absolute border bg-white w-fit z-40">
      {open && (
        <ul className="list-none">
          {options.map((option) => (
            <li className="hover:bg-green-200 hover:cursor-pointer"
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
