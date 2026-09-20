import { useEffect, useState } from "react";
import axios from "axios";
import { App, Button, Empty, Flex, Image, Spin, Upload } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { projectsApi } from "../../../../api";
import { UPLOAD_CONTENT_TYPE, compressImage } from "../../../../image";
import type { Photo } from "../../../../types/Photo";

type ManagePhotosProps = {
  selectedProjectId?: string;
};

function ManagePhotos({ selectedProjectId }: ManagePhotosProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(selectedProjectId !== undefined);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    if (!selectedProjectId) return;

    projectsApi
      .get<{ Photos?: Photo[] }>(`/projects/${selectedProjectId}/photos`)
      .then((response) => {
        const loaded = response.data.Photos ?? [];
        setPhotos(loaded);
        setSavedOrder(loaded.map((photo) => photo.url));
      })
      .catch(() => message.error("Could not load photos"))
      .finally(() => setLoading(false));
  }, [selectedProjectId, message]);

  const order = photos.map((photo) => photo.url);
  const dirty = order.join("\n") !== savedOrder.join("\n");

  const move = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setPhotos(reordered);
  };

  const saveOrder = () => {
    if (!selectedProjectId) return;
    setSaving(true);
    projectsApi
      .put(`/projects/${selectedProjectId}/photos`, { urls: order })
      .then(() => {
        setSavedOrder(order);
        message.success("Photo order saved");
      })
      .catch(() => message.error("Could not save photo order"))
      .finally(() => setSaving(false));
  };

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    if (!selectedProjectId) return;

    try {
      const compressed = await compressImage(file as File);

      const { data } = await projectsApi.post<{ url: string; key: string }>(
        "/projects/presigned",
        { projectId: selectedProjectId },
      );

      // Bare axios: the presigned URL carries its own auth in the query string.
      await axios.put(data.url, compressed, {
        headers: { "Content-Type": UPLOAD_CONTENT_TYPE },
      });

      const { data: added } = await projectsApi.post<{ url: string }>(
        `/projects/${selectedProjectId}/photos`,
        { key: data.key },
      );

      setPhotos((current) => [...current, { url: added.url }]);
      setSavedOrder((current) => [...current, added.url]);
      onSuccess?.({});
    } catch (error) {
      onError?.(error as Error);
      message.error("Could not upload photo");
    }
  };

  return (
    <Flex vertical gap={16}>
      {loading ? (
        <Flex justify="center" style={{ padding: "2rem 0" }}>
          <Spin />
        </Flex>
      ) : photos.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={selectedProjectId ? "No photos yet" : "Select a project"}
        />
      ) : (
        <Image.PreviewGroup>
          <Flex wrap gap={12}>
            {photos.map((photo, index) => (
              <Flex key={photo.url} vertical align="center" gap={4}>
                <Image
                  src={photo.url}
                  width={96}
                  height={96}
                  style={{ objectFit: "cover" }}
                />
                <Flex gap={4}>
                  <Button
                    size="small"
                    type="text"
                    aria-label={`Move photo ${index + 1} earlier`}
                    icon={<LeftOutlined />}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  />
                  <Button
                    size="small"
                    type="text"
                    aria-label={`Move photo ${index + 1} later`}
                    icon={<RightOutlined />}
                    disabled={index === photos.length - 1}
                    onClick={() => move(index, index + 1)}
                  />
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Image.PreviewGroup>
      )}

      {dirty && (
        <Button type="primary" block loading={saving} onClick={saveOrder}>
          Save photo order
        </Button>
      )}

      <Upload
        multiple
        accept="image/*"
        customRequest={customRequest}
        disabled={!selectedProjectId}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />} disabled={!selectedProjectId} block>
          Add Photos
        </Button>
      </Upload>
    </Flex>
  );
}

export default ManagePhotos;
