import "./Management.css";
import { Project } from "../../types/Project";
import { Outlet, Link } from "react-router-dom";

type ManageProps = {
  projects: Array<Project>;
};

function Management(props: ManageProps) {
  return (
    <div className="mt-36 w-full h-full flex items-center flex-col">
      <div className="w-[17rem]">
        <div className="flex flex-col">
          <label
            htmlFor="projects"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select a project
          </label>
          <select
            id="projects"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {props.projects.map((project, index) => {
              return (
                <option key={index} value={project.projectId}>
                  {project.projectName}
                </option>
              );
            })}
          </select>
          <Link
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            to="/add-project"
          >
            Add project
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Management;
