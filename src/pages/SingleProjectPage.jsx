import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import Task from "../components/Task";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import EditTask from "../components/EditTask";
import Collaborators from "../components/Collaborators";
import ProjectEdit from "../components/ProjectEdit";
import LoaderSpinner from "../components/LoaderSpinner";

export default function SingleProjectPage() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskCount, setTaskCount] = useState(null);
  const [visibleCount, setVisibleCount] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [editProjectModal, setEditProjectModal] = useState(null);
  const { projectId } = useParams();

  const [data, loading, error] = useFetch(`projects/${projectId}`);

  const [taskModalOpen, setTaskModalOpen] = useState(false);

  useEffect(() => {
    console.log(error);
  }, [error]);

  //sets project and task list
  useEffect(() => {
    if (!data || !data.tasks) return;
    setTasks(data.tasks);
    setProjectData(data);
  }, [data]);

  //runs math to determine how many tasks are showing for user feedback
  useEffect(() => {
    if (!tasks) return;
    setTaskCount(tasks.length || 0);
    setVisibleCount(Math.min(tasks.length, 5) || 0);
  }, [tasks]);

  //checks project list, finds user and assigns permissions
  useEffect(() => {
    if (!user || !projectData) return;

    const userObject = projectData.user.find(
      (projectUser) => projectUser.user._id == user._id
    );

    //user permissions
    setPermissions(userObject.permissions);
  }, [projectData, user]);

  //increases visible tasks
  const showMoreTasks = () => {
    setVisibleCount((prev) => Math.min(prev + 5, taskCount));
  };

  const toggleTaskModal = () => {
    setTaskModalOpen((prev) => !prev);
  };

  const toggleProjectModal = () => {
    setEditProjectModal((prev) => !prev);
  };

  return (
    <>
      {!user && <h2>Unauthorized, Please Log In</h2>}
      {loading && <LoaderSpinner />}
      {user && projectData && (
        <div className="flex flex-col gap-4 h-screen p-2">
          <div className="flex sm:flex-row flex-col gap-4">
            {/*Project data*/}
            <div className="flex flex-col gap-2 flex-1 border border-gray-200 shadow-md p-4 rounded-lg">
              <h2 className="text-4xl font-bold mb-2">{projectData.title}</h2>
              <p>
                <span className="font-semibold">About:</span>{" "}
                {projectData.description}
              </p>
              <p>
                <span className="font-semibold">Status: </span>
                {projectData.status}
              </p>
              {projectData?.deadline && (
                <p>
                  <span className="font-semibold">Deadline: </span>
                  {new Date(projectData.deadline).toLocaleString()}
                </p>
              )}
              <div className="flex flex-1 h-full w-full">
                {permissions?.includes("editProject") && (
                  <button
                    className="self-end bg-emerald-200 px-4 py-2 rounded-md shadow-md hover:bg-emerald-300 hover:cursor-pointer"
                    onClick={toggleProjectModal}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/*collaborator box*/}
            <div className="sm:w-1/3 w-full border border-gray-200 shadow-md p-4 rounded-lg bg-white">
              <Collaborators
                collabList={projectData.user}
                permissions={permissions}
                projectId={projectData._id}
                joinRequests={projectData.joinRequests}
              />
            </div>
          </div>

          {/*Task list*/}
          <div className="flex-1 border border-gray-200 shadow-md p-4 rounded-lg bg-white">
            <p className="mb-2">
              Showing {visibleCount} of {taskCount} task
              {taskCount !== 1 ? "s" : ""}
            </p>
            {permissions && permissions.includes("addTask") && (
              <button
                onClick={toggleTaskModal}
                className="px-3 py-1 mb-4 bg-emerald-200 rounded hover:bg-emerald-300 hover:cursor-pointer"
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
      {editProjectModal && (
        <Modal modalOpen={editProjectModal} setModalOpen={setEditProjectModal}>
          <ProjectEdit
            closeModal={toggleProjectModal}
            title={projectData.title}
            description={projectData.description}
            _id={projectData._id}
            status={projectData.status}
            privateProject={projectData.privateProject}
          />
        </Modal>
      )}
    </>
  );
}
