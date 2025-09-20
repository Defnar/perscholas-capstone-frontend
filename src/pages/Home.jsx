import { useEffect, useState } from "react";
import ProjectList from "../components/ProjectList";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [titleSearch, setTitleSeach] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [view, setView] = useState("Public");

  useEffect(() => {
    setIsPrivate(view === "Private");
  }, [view]);

  const handleViewChange = (event) => {
    console.log(event.target.value);
    setView(event.target.value);
  };

  return (
    <div className="p-4">
      <div>
        <label htmlFor="view">View: </label>
        <select name="view" className="mb-4 border border-gray-200 shadow-md rounded-md" value={view} onChange={handleViewChange}>
          <option value="Private">Private</option>
          <option value="Public">Public</option>
        </select>
      </div>
      <SearchBar
        privateProject={isPrivate}
        setTitleSearch={setTitleSeach}
        setOwnerSearch={setOwnerSearch}
      />
      <ProjectList
        title={titleSearch}
        owner={ownerSearch}
        privateProject={isPrivate}
      />
    </div>
  );
}
