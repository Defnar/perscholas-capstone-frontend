import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import EditTask from "./EditTask";
import { Bounce, toast } from "react-toastify";

export default function Task({
  projectId,
  task,
  permissions,
  userRole,
  setTasks,
}) {
  //title, description, deadline, status
  const [status, setStatus] = useState(task.status);
  const [editTaskModal, setEditTaskModal] = useState(false);

  const { api } = useContext(AuthContext);

  const statusUpdateable =
    userRole === "owner" ||
    permissions.some(
      (perm) =>
        perm === "updateTaskStatus" ||
        perm === "editProject" ||
        perm === "editTask"
    );

  const taskEditable =
    userRole === "owner" ||
    permissions.some((perm) => perm === "editProject" || perm === "editTask");

  const taskDeletable =
    userRole === "owner" ||
    permissions.some(
      (perm) => perm === "deleteProject" || perm === "deleteTask"
    );

  const statusArr = ["To Do", "In Progress", "Done", "Overdue"];

  if (
    userRole === "owner" ||
    permissions.some((perm) => perm === "archiveTask")
  )
    statusArr.push("Archive");

  const statusOptions = () => {
    return statusArr.map((stat) => (
      <option key={stat} value={stat}>
        {stat}
      </option>
    ));
  };

  const changeStatus = async (event) => {
    const newStatus = event.target.value;

    setStatus(newStatus);
    try {
      await api.put(
        `projects/${projectId}/tasks/${task._id}/status`,
        {
          status: newStatus,
        }
      );
    } catch (err) {
      console.log(err);
      toast(`Error updating status`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const onTaskDelete = async () => {
    try {
      await api.delete(
        `projects/${projectId}/tasks/${task._id}`
      );

      setTasks((prev) => prev.filter((oldTask) => oldTask._id !== task._id));
      toast(`Task successfully deleted`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      console.log(err);
      toast(`Error occurred deleting task`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const toggleEditModal = () => {
    setEditTaskModal((prev) => !prev);
  };

  return (
    <>
      <li className="border border-gray-200 rounded-md px-4 py-2 shadow-md flex flex-col gap-2">
        <h2 className="font-bold text-3xl">{task.title}</h2>
        <p>{task.description}</p>
        <p>{task.deadline && new Date(task.deadline).toLocaleString()}</p>
        {statusUpdateable ? (
          <select
            onChange={changeStatus}
            className="flex-1 shadow-md border border-gray-200 max-h-7 bg-gray-100 w-fit"
            value={status}
          >
            {statusOptions()}
          </select>
        ) : (
          <p>{status} </p>
        )}
        <div className="flex flex-row gap-5">
          {taskEditable && <button className="bg-emerald-200 rounded-md shaodow-md px-4 py-2 hover:bg-emerald-300 hover:cursor-pointer" onClick={toggleEditModal}>Edit Task</button>}
          {taskDeletable && <button className="bg-red-200 rounded-md shadow-md px-4 py-2 hover:bg-red-300 hover:cursor-pointer" onClick={onTaskDelete}>Delete Task</button>}
        </div>
      </li>
      {editTaskModal && (
        <Modal modalOpen={editTaskModal} setModalOpen={setEditTaskModal}>
          <EditTask
            title={task.title}
            description={task.description}
            status={task.status}
            deadline={task.deadline}
            projectId={projectId}
            setTasks={setTasks}
            taskId={task._id}
            closeModal={toggleEditModal}
            editTask={true}
          />
        </Modal>
      )}
    </>
  );
}
