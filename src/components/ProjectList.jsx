import { useMemo, useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import Project from "./Project";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import LoaderSpinner from "./LoaderSpinner";
import AuthContext from "../contexts/AuthContext";

export default function ProjectList({ privateProject = false, title, owner }) {
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState(1);
  const [pageSize, setPageSize] = useState(5); //set page size not used, future features if used
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {user} = useContext(AuthContext);

  const url = useMemo(
    () => `projects/${privateProject ? "private" : ""}`,
    [privateProject]
  );

  //tracks params and changes them as they changed
  const params = useMemo(
    () => ({
      params: {
        title,
        owner,
        sortBy,
        sortOrder,
        pageSize,
        page,
      },
    }),
    [title, owner, sortBy, sortOrder, pageSize, page]
  );
  const [data, loading, error] = useFetch(url, params);

  const navigate = useNavigate();
  const handleClick = (projectId) => {
    if (!privateProject) return;

    navigate(`/project/${projectId}`);
  };

  useEffect(() => {
    if (data && data.total)
      setTotalPages(Math.ceil(Number(data.total) / pageSize));
  }, [data, pageSize]);

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(Number(event.target.value));
  };

  useEffect(() => {
    setPage(Math.min(Math.max(page, 1), totalPages));
  }, [totalPages, page]);

  return (
    <>
      <div>
        <div className="flex flex-row">
          <label htmlFor="sortBy">Sort By: </label>
          <select value={sortBy} name="sortBy" onChange={handleSortByChange}>
            <option value="title">Title</option>
            {!privateProject && <option value="owner">Owner</option>}
          </select>
        </div>
        <div className="flex flex-row">
          <label htmlFor="sortOrder">Sort Order: </label>
          <select
            value={sortOrder}
            name="sortOrder"
            onChange={handleSortOrderChange}
          >
            <option value={1}>Ascending</option>
            <option value={-1}>Descending</option>
          </select>
        </div>
      </div>
      {loading && <LoaderSpinner />}
      {data?.projects.length === 0 && <p>No Projects found</p>}
      {!user && privateProject && <p className="text-center text-lg font-semibold">Please login to view private projects</p>}
      {user && error && <p>Failed to retrieve project list with error: {error.status} {error.message}</p>}
      <ul>
        {data &&
          data.projects.map((project) => (
            <li key={project._id} onClick={() => handleClick(project._id)}>
              <Project
                projectId={project._id}
                title={project.title}
                owner={project.owner.username}
                description={project.description}
                status={project.status}
                userProject={privateProject}
              />
            </li>
          ))}
      </ul>
      <section>
        <div className="flex flex-row items-center">
          {page > 1 && (
            <button onClick={() => setPage((prev) => prev - 1)}>
              <ChevronLeftIcon className="size-6" />
            </button>
          )}
          Page {page} of {totalPages}{" "}
          {page < totalPages && (
            <button onClick={() => setPage((prev) => prev + 1)}>
              <ChevronRightIcon className="size-6" />
            </button>
          )}
        </div>
        <div className="flex flex-row">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              className="px-2 hover:bg-emerald-300 rounded-md text-center hover:cursor-pointer"
              key={num}
              onClick={() => setPage(num)}
              disabled={num === page}
            >
              {num}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
