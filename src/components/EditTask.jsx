import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function EditTask({
  title,
  description,
  status,
  deadline,
  closeModal,
  editTask,
  projectId,
  taskId,
  setTasks,
}) {
  const [taskInfo, setTaskInfo] = useState({
    title: title || "",
    description: description || "",
    status: status || "To Do",
    deadline: deadline ? new Date(deadline).toISOString().slice(0, 16) : "",
  });
  const { api } = useContext(AuthContext);

  const statusArr = ["To Do", "In Progress", "Done", "Overdue", "Archive"];
  const statusDropdown = statusArr.map((stat) => (
    <option key={stat} value={stat}>
      {stat}
    </option>
  ));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = editTask
        ? await api.put(`projects/${projectId}/tasks/${taskId}`, {
            title: taskInfo.title,
            description: taskInfo.description,
            deadline: taskInfo.deadline,
            status: taskInfo.status,
          })
        : await api.post(`projects/${projectId}/tasks`, {
            title: taskInfo.title,
            description: taskInfo.description,
            deadline: taskInfo.deadline,
            status: taskInfo.status,
          });

      console.log(response.data); //toastify

      if (taskId) {
        setTasks((prev) =>
          prev.map((oldTask) =>
            oldTask._id === taskId ? response.data : oldTask
          )
        );
      }

      if (!taskId) {
        setTasks((prev) => [...prev, response.data]);
      }

      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title: </label>
      <input
        type="text"
        name="title"
        onChange={handleChange}
        value={taskInfo.title}
      />
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        onChange={handleChange}
        value={taskInfo.description}
      />
      <label htmlFor="status">Status: </label>
      <select name="status" value={taskInfo.status} onChange={handleChange}>
        {statusDropdown}
      </select>
      <label htmlFor="deadline">Deadline: </label>
      <input
        type="datetime-local"
        name="deadline"
        value={taskInfo.deadline}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
