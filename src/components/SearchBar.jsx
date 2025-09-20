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
  }, [privateProject]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyles =
    "flex-1 shadow-md border border-gray-200 max-h-7 bg-gray-100 px-2";

  return (
    <div>
      <form
        className="flex flex-col md:flex-row w-full gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="title">Title: </label>
          <input
            className={inputStyles}
            type="text"
            name="title"
            value={search.title}
            onChange={handleChange}
          />
        </div>
        {!privateProject && (
          <div>
            <label htmlFor="owner">Owner: </label>
            <input
              className={inputStyles}
              type="text"
              name="owner"
              value={search.owner}
              onChange={handleChange}
            />
          </div>
        )}
        <button type="submit" className="bg-emerald-200 rounded-md shadow-md px-4 w-30 hover:bg-emerald-300 hover:cursor-pointer">Search</button>
      </form>
    </div>
  );
}
