import "./Navigation.css";
import { Project } from "../../types/Project";
import { Navbar } from 'flowbite-react';

type NavigationProps = {
  projects: Project[];
  setSelectedProject: (project: Project) => void;
  selectedProject: Project;
};

function Navigation(props: NavigationProps) {

  if (!props.projects || !props.selectedProject || !props.setSelectedProject) return <></>

  return (
    <Navbar    >
      <Navbar.Brand>
        <span className="self-center flex whitespace-nowrap text-xl font-semibold dark:text-white md:hidden">
          De Guzman
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {props.projects.map((project, index) => (
          <Navbar.Link key={index} onClick={() => props.setSelectedProject(project)} href="#" className={`${props.selectedProject.projectId === project.projectId ? " text-gray-400" : "text-gray-900"}`}>
            {project.projectName}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar >
  )
}

export default Navigation;
