import { useState, useEffect, createRef } from "react";
import axios from "axios";
import ManagePhoto from "./ManagePhoto";
import { Project } from "../../../../types/Project";
import AWS from "aws-sdk";

type ManagePhotosProps = {
  selectedProjectId: string;
};

function ManagePhotos(props: ManagePhotosProps) {
  const [loading, setLoading] = useState(false);
  const imageInput = createRef();

  const addPhotos = async () => {
    axios

      .post(`${import.meta.env.VITE_APP_PROJECTS_API_URL}/projects/presigned`, {
        number: imageInput.current.files.length,
        projectId: props.selectedProjectId,
      })
      .then((response) => {
        postToS3(response.data.urls);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const postToS3 = (urls: string[]) => {
    var options = {
      headers: { "Content-Type": "image/*" },
    };
    for (let x = 0; x < urls.length; x++) {
      console.log(imageInput.current.files);
      console.log(urls[x]);
      axios
        .put(urls[x], imageInput.current.files[x], options)
        .then((response) => console.log(response));
    }
  };
  return (
    <>
      <div className="w-full flex-col flex items-center gap-4 mt-16">
        <input ref={imageInput} type="file" name="photos" multiple />
        <button
          onClick={addPhotos}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add Photos
        </button>
      </div>
    </>
  );
}

export default ManagePhotos;
