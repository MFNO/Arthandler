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
    <Navbar className="w-full bg-white border-gray-200 dark:bg-gray-900 mb-8">
      <Navbar.Brand>
        <span className="self-center flex whitespace-nowrap text-xl dark:text-white md:hidden">
          De Guzman
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {props.projects.map((project, index) => (
          <Navbar.Link key={index} onClick={() => props.setSelectedProject(project)} href="#" className={`font-light text-lg ${props.selectedProject.projectId === project.projectId ? " text-gray-400" : "text-gray-900"}`}>
            {project.projectName}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar >
  )
}

export default Navigation;
