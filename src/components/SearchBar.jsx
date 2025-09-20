import { useEffect, useState } from "react";

export default function SearchBar({
  privateProject,
  setTitleSearch,
  setOwnerSearch,
}) {
  const [search, setSearch] = useState({
    title: "",
    owner: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setTitleSearch(search.title);

    if (!privateProject) setOwnerSearch(search.owner);

  };

  useEffect(() => {
    if (privateProject) setOwnerSearch("");
  }, [privateProject])

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          name="title"
          value={search.title}
          onChange={handleChange}
        />
        {!privateProject && (
          <>
            <label htmlFor="owner">Owner: </label>
            <input
              type="text"
              name="owner"
              value={search.owner}
              onChange={handleChange}
            />
          </>
        )}
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
