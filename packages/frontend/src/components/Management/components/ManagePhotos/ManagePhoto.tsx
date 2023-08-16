import { Photo } from "../../../../types/Photo";

type ManagePhotoProps = {
  photo: Photo;
  swapPhotos: (indexOne: number, indexTwo: number) => void;
  isLastItem: boolean;
  isFirstItem: boolean;
};

function ManagePhoto(props: ManagePhotoProps) {
  return (
    <div className="flex flex-row">
      {!props.isFirstItem && (
        <div
          onClick={() =>
            props.swapPhotos(props.photo.index, props.photo.index - 1)
          }
        >
          {"<"}
        </div>
      )}
      <div>{props.photo.projectName}</div>
      {!props.isLastItem && (
        <div
          onClick={() =>
            props.swapPhotos(props.photo.index, props.photo.index + 1)
          }
        >
          {">"}
        </div>
      )}
    </div>
  );
}

export default ManagePhoto;
