import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ManageProjectProps = {
  project: Project;
  swapProjects: (indexOne: number, indexTwo: number) => void;
};

function ManageProject(props: ManageProjectProps) {
  return (
    <div className="flex flex-row">
      {props.project.projectIndex > 0 && (
        <div
          onClick={() =>
            props.swapProjects(
              props.project.projectIndex,
              props.project.projectIndex - 1
            )
          }
        >
          {"<"}
        </div>
      )}
      <div>{props.project.projectName}</div>
      <div
        onClick={() =>
          props.swapProjects(
            props.project.projectIndex,
            props.project.projectIndex + 1
          )
        }
      >
        {">"}
      </div>
    </div>
  );
}

export default ManageProject;
