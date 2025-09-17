import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";

export default function ProjectPage({ projectId }) {
  const { api } = useContext(AuthContext);
  const [tasks, setTasks] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [visibleCount, setVisibleCount] = useState(null);

  const [data, loading, error] = useFetch(`projects/${projectId}`);

  useEffect(() => {
    setTasks(data.tasks);
    setTaskCount(data.tasks.length);
    setVisibleCount(Math.min(data.task.length, 10));
  }, [data]);

  return (
    <>
      {data && (
        <div>
          <h2>{data.title}</h2>
          <section>{data.description}</section>
          <section>
            <ul>{data.tasks.slice(0, visibleCount).map((task) => {})}</ul>
          </section>
        </div>
      )}
    </>
  );
}
