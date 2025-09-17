import { useContext, useState } from "react";
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

  const url = `projects/${privateProject ? "private" : ""}`;

  const [loading, data, error] = useFetch(url, {
    params: {
      title: title,
      owner: owner,
      sortBy: sortBy,
      sortOrder: sortOrder,
      pageSize: pageSize,
      page: page,
    },
  });

  return (
    <ul>
      {data &&
        data.map((project) => (
          <li key={project._id}>
            <Project project={project} userProject={privateProject} />
          </li>
        ))}
    </ul>
  );
}
