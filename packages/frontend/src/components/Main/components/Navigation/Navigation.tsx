import { Menu } from "antd";
import type { Project } from "../../../../types/Project";

type NavigationProps = {
  projects: Project[];
  selectedProject?: Project;
  setSelectedProject: (project: Project) => void;
};

function Navigation({
  projects,
  selectedProject,
  setSelectedProject,
}: NavigationProps) {
  if (projects.length === 0) return null;

  return (
    <Menu
      mode="horizontal"
      selectedKeys={selectedProject ? [selectedProject.projectId] : []}
      style={{ justifyContent: "center", borderBottom: "none" }}
      items={projects.map((project) => ({
        key: project.projectId,
        label: project.projectName,
      }))}
      onClick={({ key }) => {
        const project = projects.find((item) => item.projectId === key);
        if (project) setSelectedProject(project);
      }}
    />
  );
}

export default Navigation;
