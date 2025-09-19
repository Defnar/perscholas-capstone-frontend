import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import Task from "../components/Task";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import EditTask from "../components/EditTask";
import Collaborators from "../components/Collaborators";

export default function SingleProjectPage() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(null);
  const [visibleCount, setVisibleCount] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const { projectId } = useParams();

  const [data, loading, error] = useFetch(`projects/${projectId}`);

  const [taskModalOpen, setTaskModalOpen] = useState(false);

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    if (!data || !data.tasks) return;
    setTasks(data.tasks);
    setProjectData(data);
  }, [data]);

  useEffect(() => {
    if (!tasks) return;
    setTaskCount(tasks.length || 0);
    setVisibleCount(Math.min(tasks.length, 10) || 0);
  }, [tasks]);

  //checks project list, finds user and assigns permissions
  useEffect(() => {
    if (!user || !projectData) return;

    const userObject = projectData.user.find(
      (projectUser) => projectUser.user._id == user._id
    );

    setPermissions(userObject.permissions);
  }, [projectData, user]);

  const showMoreTasks = () => {
    setVisibleCount((prev) => Math.min(prev + 5, taskCount));
  };

  const toggleTaskModal = () => {
    setTaskModalOpen((prev) => !prev);
  };

  return (
    <>
      {!user && <h1>Unauthorized, Please Log In</h1>}
      {user && projectData && (
        <div>
          <h2>{projectData.title}</h2>
          <section>{projectData.description}</section>
          <section>
            {projectData && (
              <Collaborators
                collabList={projectData.user}
                permissions={permissions}
                projectId={projectData._id}
                joinRequests={projectData.joinRequests}
              />
            )}
          </section>
          <section>
            <p>
              Showing {visibleCount} of {taskCount} task
              {taskCount !== 1 ? "s" : ""}
            </p>
            {permissions && permissions.includes("addTask") && (
              <button onClick={toggleTaskModal}>Add New Task</button>
            )}
            <ul>
              {tasks &&
                permissions &&
                tasks
                  .slice(0, visibleCount)
                  .map((task) => (
                    <Task
                      key={task._id}
                      projectId={projectId}
                      task={task}
                      permissions={permissions}
                      taskList={tasks}
                      setTasks={setTasks}
                    />
                  ))}
            </ul>
            <button onClick={showMoreTasks} type="button">
              Show more tasks
            </button>
          </section>
        </div>
      )}

      {taskModalOpen && (
        <Modal modalOpen={taskModalOpen} setModalOpen={setTaskModalOpen}>
          <EditTask
            closeModal={toggleTaskModal}
            projectId={projectId}
            setTasks={setTasks}
          />
        </Modal>
      )}
    </>
  );
}
