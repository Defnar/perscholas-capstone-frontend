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

  const inputStyles = "flex-1 shadow-md border border-gray-200 h-7 bg-gray-100";

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title: </label>
        <input
          className={inputStyles}
          type="text"
          name="title"
          onChange={handleChange}
          value={taskInfo.title}
        />
      </div>
      <div className="flex flex-col content-center">
        <label htmlFor="description">Description</label>

        <textarea
          name="description"
          className={`${inputStyles} max-h-full`}
          onChange={handleChange}
          value={taskInfo.description}
        />
      </div>
      <label htmlFor="status">Status: </label>
      <select
        name="status"
        className={inputStyles}
        value={taskInfo.status}
        onChange={handleChange}
      >
        {statusDropdown}
      </select>
      <label htmlFor="deadline">Deadline: </label>
      <input
        className={inputStyles}
        type="datetime-local"
        name="deadline"
        value={taskInfo.deadline}
        onChange={handleChange}
      />
      <div className="flex flex-row justify-evenly">
        <button
          type="submit"
          className="bg-emerald-200 hover:bg-emerald-300 px-4 py-2 rounded-md shadow-md"
        >
          Submit
        </button>
        <button type="button" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md shadow-md" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
