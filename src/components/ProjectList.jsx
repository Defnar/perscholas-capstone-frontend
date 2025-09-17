import { useContext, useMemo } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import Project from "./Project";

export default function ProjectList({
  privateProject = false,
  title,
  owner,
  sortBy,
  sortOrder,
  pageSize,
  page,
}) {
  const { api } = useContext(AuthContext);

  const url = useMemo(
    () => `projects/${privateProject ? "private" : ""}`,
    [privateProject]
  );

  const params = useMemo(() => {
    title, owner, sortBy, sortOrder, pageSize, page;
  }, [owner, page, pageSize, sortBy, sortOrder, title]);

  const [data, loading, error] = useFetch(url, params);

  return (
    <ul>
      {data &&
        data.projects.map((project) => (
          <li key={project._id}>
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
