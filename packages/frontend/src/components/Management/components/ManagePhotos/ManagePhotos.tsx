import axios from "axios";
import { App, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { projectsApi } from "../../../../api";

type ManagePhotosProps = {
  selectedProjectId?: string;
};

function ManagePhotos({ selectedProjectId }: ManagePhotosProps) {
  const { message } = App.useApp();

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const { data } = await projectsApi.post<{ urls: string[] }>(
        "/projects/presigned",
        { number: 1, projectId: selectedProjectId },
      );

      await axios.put(data.urls[0], file, {
        headers: { "Content-Type": "image/*" },
      });

      onSuccess?.({});
    } catch (error) {
      onError?.(error as Error);
      message.error("Could not upload photo");
    }
  };

  return (
    <Upload
      multiple
      accept="image/*"
      customRequest={customRequest}
      disabled={!selectedProjectId}
    >
      <Button icon={<UploadOutlined />} disabled={!selectedProjectId} block>
        Add Photos
      </Button>
    </Upload>
  );
}

export default ManagePhotos;
