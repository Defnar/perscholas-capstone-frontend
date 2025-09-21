import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  children,
  options,
  onSelect,
  buttonStyles = "",
  buttonPositionStyle = "",
  position="middle"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [positioning, setPositioning] = useState("left-1/2 transform -translate-x-1/2 mt-1")

  //event listeners for outside clicks and escape to handle opening/closing
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current) {
        if (event && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (dropdownRef.current) {
        if (event && event.key === "Escape") setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    const positionObj = {
      middle: "left-1/2 transform -translate-x-1/2",
      left: "left-0",
      right: "right-0"
    }

    setPositioning(positionObj[position])
  }, [position])

  return (
    <div className={buttonPositionStyle + " relative"}>
      {/*button setup*/}
      <button
        ref={dropdownButtonRef}
        className={buttonStyles}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {children}
      </button>
      {/*dropdown list*/}
      {isOpen && (
        <ul
          ref={dropdownRef}
          className={`absolute top-full  bg-white z-40 border border-black mt-1 ${positioning}`}
        >
          {options.map((option) => (
            <li
              className="px-2 hover:bg-green-200 hover:cursor-pointer"
              key={option}
              value={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
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
