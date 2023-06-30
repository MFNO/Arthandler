import { Project } from "../../../../types/Project";

type ManageProjectProps = {
  project: Project;
  swapProjects: (indexOne: number, indexTwo: number) => void;
  isLastItem: boolean;
  isFirstItem: boolean;
};

function ManageProject(props: ManageProjectProps) {
  return (
    <div className="flex flex-row">
      {!props.isFirstItem && (
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
      {!props.isLastItem && (
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
      )}
    </div>
  );
}

export default ManageProject;
