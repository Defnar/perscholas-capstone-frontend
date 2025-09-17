import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function Task({ projectId, task, permissions, userRole }) {
  //title, description, deadline, status
  const [status, setStatus] = useState(task.status);

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

  const statusOptions = () => {
    const statusArr = ["To Do", "In Progress", "Done", "Overdue"];

    if (
      permissions.some((perm) => perm === "archiveTask" || userRole === "owner")
    )
      statusArr.push("Archive");

    return statusArr.map((stat) => (
      <option key={stat} value={stat}>
        {stat}
      </option>
    ));
  };

  const changeStatus = async (event) => {
    const newStatus = event.target.value;

    setStatus(newStatus);

    const [response, error] = await api.put(`tasks/${projectId}/tasks/${task._id}/status`, {
      status: newStatus,
    });
  };

  const onTaskDelete = async () => {
    const [respone, error] = await api.delete(`tasks/${projectId}/tasks/${task._id}`)
  }

  return (
    <li>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>{task.deadline.toLocaleString()}</p>
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
  );
}
