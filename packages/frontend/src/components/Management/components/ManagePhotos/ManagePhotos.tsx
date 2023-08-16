import { useState, useEffect } from "react";
import axios from "axios";
import ManagePhoto from "./ManagePhoto";
import { Project } from "../../../../types/Project";

function ManagePhotos() {
  const [loading, setLoading] = useState(false);

  const addPhotos = () => {
    axios

      .post(`${import.meta.env.VITE_APP_PROJECTS_API_URL}/projects/presigned`, {
        number: 50,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="w-full flex-col flex items-center gap-4 mt-16">
        <button
          onClick={addPhotos}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add Photos
        </button>
      </div>
    </>
  );
}

export default ManagePhotos;
