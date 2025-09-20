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

  //list of statuses to map to options
  const statusArr = ["To Do", "In Progress", "Done", "Overdue", "Archive"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    //changes private to boolean
    let newValue = value;
    if (name === "private") newValue = value === "true";

    setProjectData((prev) => ({ ...prev, [name]: newValue }));
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
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  const inputStyles =
    "flex-1 shadow-md border border-gray-200 max-h-7 bg-gray-100";
  const inputDivStyles = "flex flex-row gap-2 w-100 max-w-xs md:max-w-100";
  const formStyles = "flex flex-col gap-3 items-center";

  return (
    <form className={formStyles} onSubmit={handleSubmit}>
      <div className={inputDivStyles}>
        <label htmlFor="title">title: </label>
        <input
          className={inputStyles}
          type="text"
          name="title"
          onChange={handleChange}
          value={projectData.title}
          onBlur={handleBlur}
        />
      </div>
      {!titleValidity && <span className="text-center text-red-600">Title is required</span>}
      <div className={inputDivStyles}>
        <label htmlFor="description">description: </label>
        <textarea
        className="flex-1 shadow-md border border-gray-200 bg-gray-100"
          name="description"
          value={projectData.description}
          onChange={handleChange}
        />
      </div>{" "}
      <div className={inputDivStyles}>
        <label htmlFor="status">status: </label>
        <select
          className={inputStyles}
          name="status"
          value={projectData.status}
          onChange={handleChange}
        >
          {statusArr.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>{" "}
      </div>
      <div className={inputDivStyles}>
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
      </div>{" "}
      <div>
        <label htmlFor="deadline">
          Deadline(leave empty for no deadline):{" "}
        </label>
        <input
          className={inputStyles}
          type="datetime-local"
          name="deadline"
          value={deadline}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="bg-emerald-200 w-50 shadow-md rounded-md px-4 py-2 shrink-0 hover:bg-emerald-300 hover:cursor-pointer">Submit</button>
      <button type="button" className="bg-gray-200 w-50 shadow-md rounded-md px-4 py-2 shrink-0 hover:bg-gray-300 hover:cursor-pointer" onClick={closeModal}>
        Cancel
      </button>
    </form>
  );
}
