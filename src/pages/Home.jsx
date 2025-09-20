import { useState } from "react";
import ProjectList from "../components/ProjectList";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [titleSearch, setTitleSeach] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");

  return (
    <>
      <button onClick={() => setIsPrivate((prev) => !prev)}>
        toggle Private
      </button>

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
    </>
  );
}
