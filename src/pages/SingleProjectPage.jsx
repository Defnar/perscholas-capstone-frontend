import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import Task from "../components/Task";
import { useParams } from "react-router-dom";

export default function SingleProjectPage() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [visibleCount, setVisibleCount] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const { projectId } = useParams();

  const [data, loading, error] = useFetch(`projects/${projectId}`);

  useEffect(() => {
    console.log(error)
  }, [error])

  useEffect(() => {
    if (data && data.tasks) {
      setTasks(data.tasks);
      setTaskCount(data.tasks.length || 0);
      setVisibleCount(Math.min(data.tasks.length, 10) || 0);
      setProjectData(data);
    }
  }, [data]);

  useEffect(() => {
    console.log("project data:", projectData)
  }, [projectData])
  //checks project list, finds user and assigns permissions
  useEffect(() => {
    if (!user || !projectData) return;

    console.log(user._id);
    console.log(projectData);
    
    const userObject = projectData.user.find(
      (projectUser) => projectUser.user._id == user._id
    );

    console.log(userObject);
    setPermissions(userObject.permissions);
  }, [projectData, user]);

  const showMoreTasks = () => {
    setVisibleCount((prev) => Math.min(prev + 5, taskCount));
  };

  return (
    <>
    {!user && <h1>Unauthorized, Please Log In</h1>}
      {user && data && (
        <div>
          <h2>{data.title}</h2>
          <section>{data.description}</section>
          <section>
            <p>
              Showing {visibleCount} of {taskCount} task
              {taskCount !== 1 ? "s" : ""}
            </p>
            <ul>
              {tasks &&
                tasks
                  .slice(0, visibleCount)
                  .map((task) => (
                    <Task
                      projectId={projectId}
                      task={task}
                      permissions={permissions}
                    />
                  ))}
            </ul>
            <button onClick={showMoreTasks} type="button">
              Show more tasks
            </button>
          </section>
        </div>
      )}
    </>
  );
}
