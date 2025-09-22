import { useContext, useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import AuthContext from "../contexts/AuthContext";
import toastMessage from "../utils/toastMessage";

export default function EditCollab({
  user,
  projectId,
  setCollaborators,
  closeModal,
}) {
  const [collab, setCollab] = useState(user || null);

  const { api } = useContext(AuthContext);

  // Permission list with descriptions
  const allPermissions = [
    {
      perm: "getProject",
      description:
        "Allows a collaborator to view the project. This must be set for other operations",
    },
    {
      perm: "editProject",
      description: "Allows a user to edit details on a project",
    },
    { perm: "deleteProject", description: "Allows a user to delete a project" },
    { perm: "addTask", description: "Allows a user to add tasks to a project" },
    { perm: "deleteTask", description: "Allows a user to delete a task" },
    { perm: "archiveTask", description: "Allows a user to archive a task" },
    {
      perm: "inviteUsers",
      description: "Allows a user to invite other collaborators",
    },
    {
      perm: "updateTaskStatus",
      description: "Allows a user to update the task status",
    },
  ];

  const togglePermission = (perm) => {
    setCollab((prev) => {
      const hasPerm = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: hasPerm
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  const handleUserSubmit = async () => {
    const userId = collab.user._id;
    const perms = collab.permissions;

    try {
      await api.put(`projects/${projectId}/collaborators`, {
        userId: userId,
        permissions: perms,
      });

      setCollaborators((prev) =>
        prev.map((coll) => (coll.user._id === collab.user._id ? collab : coll))
      );
      toastMessage("successfully updated user");
    } catch (err) {
      console.log(err);
      toastMessage(
        "something went wrong, please refer to console for more info"
      );
    }
  };
  const checkPermission = (perm) => collab.permissions.includes(perm);

  return (
    <div>
      {!collab && <LoaderSpinner />}
      {collab && (
        <div className="p-4 rounded-md w-full max-w-md">
          {/*checkbox form*/}
          <h2 className="text-lg font-bold text-center mb-4">
            {collab?.user.username}
          </h2>
          <form className="flex flex-col gap-3 mb-5 border border-gray-300 p-3 rounded-md shadow-sm">
            {allPermissions.map(({ perm, description }) => (
              <label
                key={perm}
                className="flex flex-col sm:flex-row items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={checkPermission(perm)}
                  onChange={() => togglePermission(perm)}
                  className="h-4 w-4"
                />
                <span className="font-medium">{perm}</span>
                <span className="text-gray-500 text-sm">{description}</span>
              </label>
            ))}
          </form>
          {/*buttons*/}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-evenly">
              <button
                onClick={handleUserSubmit}
                className="bg-emerald-300 px-4 py-2 rounded-md shadow-md w-fit hover:bg-emerald-400 hover:cursor-pointer"
              >
                Save User
              </button>
              {/*removed until functionality can be created for it.  Need to make api endpoint */}
              {/* <button className="bg-red-300 px-4 py-2 rounded-md shadow-md w-fit hover:bg-red-400 hover:cursor-pointer">
                Remove User
              </button> */}
            </div>
            <button
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 hover:cursor-pointer w-1/2 self-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
