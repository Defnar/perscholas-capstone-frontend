import { useMemo, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Project from "./Project";
import { useNavigate } from "react-router-dom";

export default function ProjectList({ privateProject = false, title, owner }) {
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
  console.log(loading);
  console.log(error);

  const navigate = useNavigate();
  const handleClick = (projectId) => {
    if (!privateProject) return;

    navigate(`/project/${projectId}`);
  };

  useEffect(() => {
    console.log(data);
    if (data && data.total) setTotalPages(Math.ceil(Number(data.total) / pageSize));
  }, [data, pageSize]);

  return (
    <>
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
        {page > 1 && (
          <button onClick={() => setPage((prev) => prev - 1)}>Jump Left</button>
        )}
        Page {page} of {totalPages}{" "}
        {page < totalPages && (
          <button onClick={() => setPage((prev) => prev + 1)}>
            Jump Right
          </button>
        )}
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
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
