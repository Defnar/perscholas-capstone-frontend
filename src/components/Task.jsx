import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Modal from "./Modal";
import EditTask from "./EditTask";

export default function Task({
  projectId,
  task,
  permissions,
  userRole,
  setTasks
}) {
  //title, description, deadline, status
  const [status, setStatus] = useState(task.status);
  const [editTask, setEditTask] = useState(false);

  const { api } = useContext(AuthContext);

  const statusUpdateable =
    permissions.some(
      (perm) =>
        perm === "updateTaskStatus" ||
        perm === "editProject" ||
        perm === "editTask"
    ) || userRole === "owner";

  const taskEditable = permissions.some(
    (perm) =>
      perm === "editProject" || perm === "editTask" || userRole === "owner"
  );

  const taskDeletable = permissions.some(
    (perm) =>
      perm === "deleteProject" || perm === "deleteTask" || userRole === "owner"
  );

  const statusArr = ["To Do", "In Progress", "Done", "Overdue"];

  if (
    permissions.some((perm) => perm === "archiveTask" || userRole === "owner")
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
      
      setTasks(prev => prev.filter(oldTask => oldTask._id !== task._id))
    } catch (err) {
      console.log(err);
    }
  };

  const onTaskEdit = () => {
    setEditTask(true);
  };

  return (
    <>
      <li>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>{task.deadline?.toLocaleString()}</p>
        {statusUpdateable ? (
          <select onChange={changeStatus} value={status}>
            {statusOptions()}
          </select>
        ) : (
          <p>{status} </p>
        )}
        {taskEditable && <button onClick={onTaskEdit}>Edit Task</button>}
        {taskDeletable && <button onClick={onTaskDelete}>Delete Task</button>}
      </li>
      {editTask && (
        <Modal>
          <EditTask
            task={task}
            statusList={statusArr}
            setEditTask={setEditTask}
          />
        </Modal>
      )}
    </>
  );
}
