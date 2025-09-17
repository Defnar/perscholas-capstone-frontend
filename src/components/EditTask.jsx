import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function EditTask({ task, statusList, closeModal, setEditTask, projectId }) {
  const [taskInfo, setTaskInfo] = useState(task);
  const {api} = useContext(AuthContext);

  const statusDropdown = statusList.map((stat) => (
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
    setEditTask(false);
    closeModal();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await api.put(`projects/${projectId}/tasks/${task._id}`, {
        ...taskInfo
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title: </label>
      <input type="text" name="title" onChange={handleChange} value={taskInfo.title} />
      <label htmlFor="description">Description</label>
      <textarea name="description" onChange={handleChange} value={taskInfo.description} />
      <label htmlFor="status">Status: </label>
      <select name="status" value={taskInfo.status} onChange={handleChange}>
        {statusDropdown}
      </select>
      <label htmlFor="deadline">Deadline: </label>
      <input type="datetime-local" name="deadline" value={taskInfo.deadline} onChange={handleChange} />
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
