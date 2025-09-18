import { useMemo } from "react";
import useFetch from "../hooks/useFetch";
import Project from "./Project";
import { useNavigate } from "react-router-dom";

export default function ProjectList({
  privateProject = false,
  title,
  owner,
  sortBy,
  sortOrder,
  pageSize,
  page,
}) {
  const url = useMemo(
    () => `projects/${privateProject ? "private" : ""}`,
    [privateProject]
  );

  //tracks params and changes them as they changed
  const params = useMemo(() => {
    title, owner, sortBy, sortOrder, pageSize, page;
  }, [owner, page, pageSize, sortBy, sortOrder, title]);

  const [data, loading, error] = useFetch(url, params);
  console.log(loading);
  console.log(error);

  const navigate = useNavigate();
  const handleClick = (projectId) => {
    if (!privateProject) return;

    navigate(`/project/${projectId}`)
  }

  return (
    <ul>
      {data &&
        data.projects.map((project) => (
          <li key={project._id} onClick={() => handleClick(project._id)}>
            <Project
              title={project.title}
              owner={project.owner.username}
              description={project.description}
              status={project.status}
              userProject={privateProject}
            />
          </li>
        ))}
    </ul>
  );
}
