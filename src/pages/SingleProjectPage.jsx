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
      {!user && <h2>Unauthorized, Please Log In</h2>}
      {user && projectData && (
        <div className="flex flex-row gap-4">
          <div className="flex flex-col basis-2/3 gap-4">
            <div className="border border-gray-200 shadow-md p-4 rounded-lg bg-white">
              <h2 className="text-4xl font-bold mb-2">{projectData.title}</h2>
              <section>
                <span className="font-semibold">About:</span>{" "}
                {projectData.description}
              </section>
            </div>

            {/* Task list */}
            <div className="border border-gray-200 shadow-md p-4 rounded-lg bg-white">
              <p className="mb-2">
                Showing {visibleCount} of {taskCount} task
                {taskCount !== 1 ? "s" : ""}
              </p>
              {permissions && permissions.includes("addTask") && (
                <button
                  onClick={toggleTaskModal}
                  className="px-3 py-1 mb-4 bg-emerald-200 rounded"
                >
                  Add New Task
                </button>
              )}
              <ul className="space-y-2">
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
              {visibleCount < taskCount && (
                <button
                  onClick={showMoreTasks}
                  type="button"
                  className="mt-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Show more tasks
                </button>
              )}
            </div>
          </div>

          <div className="basis-1/3 border border-gray-200 shadow-md p-4 rounded-lg bg-white">
            <h3 className="text-2xl font-bold mb-2">Collaborators</h3>
            <Collaborators
              collabList={projectData.user}
              permissions={permissions}
              projectId={projectData._id}
              joinRequests={projectData.joinRequests}
            />
          </div>
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
