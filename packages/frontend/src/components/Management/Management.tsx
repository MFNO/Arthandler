import { useState } from "react";
import { Card, Flex, Select } from "antd";
import ManagePhotos from "./components/ManagePhotos/ManagePhotos";
import type { Project } from "../../types/Project";

type ManagementProps = {
  projects: Project[];
};

function Management({ projects }: ManagementProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(projects[0]?.projectId);

  return (
    <Flex justify="center" style={{ marginTop: "2rem" }}>
      <Card title="Photos" style={{ width: 560 }}>
        <Flex vertical gap={16}>
          <Select
            value={selectedProjectId}
            onChange={setSelectedProjectId}
            placeholder="Select a project"
            options={projects.map((project) => ({
              value: project.projectId,
              label: project.projectName,
            }))}
          />
          <ManagePhotos
            key={selectedProjectId}
            selectedProjectId={selectedProjectId}
          />
        </Flex>
      </Card>
    </Flex>
  );
}

export default Management;
