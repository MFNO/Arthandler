import { useState, useEffect } from "react";
import axios from "axios";
import ManageProject from "./ManageProject";
import { Project } from "../../../../types/Project";

function ManageProjects() {
  const [loading, setLoading] = useState(false);

  const [updatedProjects, setUpdatedProjects] = useState<Array<Project>>([]);

  const [form, setForm] = useState({
    projectName: "",
    projectIndex: 0,
  });

  const swapItemsAtIndexes = (
    projectIndexOne: number,
    projectIndexTwo: number
  ) => {
    const newProjects = [...updatedProjects];
    newProjects[projectIndexOne].projectIndex = projectIndexTwo;
    newProjects[projectIndexTwo].projectIndex = projectIndexOne;
    newProjects.sort((a, b) => a.projectIndex - b.projectIndex);
    setUpdatedProjects(newProjects);
  };

  function getProjects() {
    axios
      .get<Array<Project>>(
        import.meta.env.VITE_APP_PROJECTS_API_URL + "/projects"
      )
      .then((response) => {
        const sortedProjects = response.data.sort(
          (a, b) => a.projectIndex - b.projectIndex
        );
        setUpdatedProjects(sortedProjects);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const addProject = () => {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_APP_PROJECTS_API_URL + "/projects", [form])
      .then(function () {
        setLoading(false);
        getProjects();
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const updateProjects = () => {
    setLoading(true);
    axios
      .put(
        import.meta.env.VITE_APP_PROJECTS_API_URL + "/projects",
        updatedProjects
      )
      .then(function () {
        setLoading(false);
        getProjects();
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  if (!updatedProjects) return <></>;

  return (
    <>
      <div className="w-full flex-col flex items-center gap-4 mt-16">
        <h1>Manage Project Order</h1>
        <div className="flex flex-row gap-4 justify-center flex-wrap bg-slate-200 w-3/4 ">
          {updatedProjects.map((item, index) => (
            <ManageProject
              swapProjects={swapItemsAtIndexes}
              isLastItem={index === updatedProjects.length - 1}
              isFirstItem={index === 0}
              key={item.projectId}
              project={item}
            />
          ))}
        </div>
        <button
          onClick={updateProjects}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save order
        </button>
      </div>
      <div className="mt-16 w-full h-full flex items-center flex-col">
        <div className="w-[17rem]">
          <div className="flex flex-col">
            <label>Project name:</label>
            <input
              type="text"
              value={form.projectName}
              onChange={(event) =>
                setForm({
                  ...form,
                  projectName: event.target.value,
                  projectIndex: updatedProjects.length,
                })
              }
            />
          </div>
          <div className="flex mt-2 justify-center">
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={addProject}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Add Project
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageProjects;
