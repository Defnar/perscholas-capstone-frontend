import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import EditTask from "./EditTask";

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

  const statusUpdateable = userRole === "owner";
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
      const response = await api.put(
        `projects/${projectId}/tasks/${task._id}/status`,
        {
          status: newStatus,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onTaskDelete = async () => {
    try {
      const response = await api.delete(
        `projects/${projectId}/tasks/${task._id}`
      );

      setTasks((prev) => prev.filter((oldTask) => oldTask._id !== task._id));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleEditModal = () => {
    console.log("toggling task");
    setEditTaskModal((prev) => !prev);
  };

  return (
    <>
      <li>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>{task.deadline && new Date(task.deadline).toLocaleString()}</p>
        {statusUpdateable ? (
          <select onChange={changeStatus} value={status}>
            {statusOptions()}
          </select>
        ) : (
          <p>{status} </p>
        )}
        {taskEditable && <button onClick={toggleEditModal}>Edit Task</button>}
        {taskDeletable && <button onClick={onTaskDelete}>Delete Task</button>}
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
