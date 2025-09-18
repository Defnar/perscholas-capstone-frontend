import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function ProjectEdit({
  closeModal,
  title,
  description,
  _id,
  status,
  deadline,
  privateProject,
}) {
  const [projectData, setProjectData] = useState({
    title: title || "",
    description: description || "",
    _id: _id || "",
    status: status || "To Do",
    deadline: deadline ? new Date(deadline) : null,
    private: privateProject || true,
  });

  const { api } = useContext(AuthContext);
  const [titleValidity, setTitleValidity] = useState(true);

  const statusArr = ["To Do", "In Progress", "Done", "Overdue", "Archive"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    let newValue = value;

    if (name === "private") newValue = value === "true";

    setProjectData((prev) => ({ ...prev, [name]: newValue }));

    console.log(projectData);
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === "title") setTitleValidity(value.length > 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (projectData.title.length === 0) {
      //toastify message
      return;
    }
    try {
        let response;
      if (projectData._id.length > 0) {
        response = await api.put(`projects/${projectData._id}`, {
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          deadline: projectData.deadline ? projectData.deadline : null,
          private: projectData.private,
        });
      } else {
        response = await api.post("projects/", {
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          deadline: projectData.deadline ? projectData.deadline : null,
          private: projectData.private,
        });
      }

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">title: </label>
      <input
        type="text"
        name="title"
        onChange={handleChange}
        value={projectData.title}
      />
      {!titleValidity && <span>Title is required</span>}
      <label htmlFor="description">description: </label>
      <textarea
        name="description"
        value={projectData.description}
        onChange={handleChange}
      />
      <label htmlFor="status">status: </label>
      <select name="status" value={projectData.status} onChange={handleChange}>
        {statusArr.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <label htmlFor="private">Visibility: </label>
      <label>
        <input
          type="radio"
          name="private"
          value={true}
          onChange={handleChange}
          checked={projectData.private ? true : undefined}
        />
        private
      </label>
      <label>
        <input
          type="radio"
          name="private"
          value={false}
          onChange={handleChange}
          check={!projectData.private ? true : undefined}
        />
        public
      </label>
      <label htmlFor="deadline">Deadline(leave empty for no deadline): </label>
      <input
        type="datetime-local"
        name="deadline"
        value={deadline}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={closeModal}>
        Cancel
      </button>
    </form>
  );
}
