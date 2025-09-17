export default function Project({ project, userProject = false }) {
  return (
    <div>
      <h2>{project.title}</h2>
      <p>owned by {project.owner}</p>
      <p>description: {project.description}</p>
      <p>status: {project.status}</p>

      {userProject && <button>Request to join project</button>}
    </div>
  );
}
