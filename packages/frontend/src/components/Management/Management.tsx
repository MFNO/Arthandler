import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Flex, Select } from "antd";
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
    <Flex justify="center" style={{ marginTop: "9rem" }}>
      <Card title="Manage" style={{ width: 320 }}>
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
          <ManagePhotos selectedProjectId={selectedProjectId} />
          <Link to="/add-project">
            <Button block>Manage projects</Button>
          </Link>
        </Flex>
      </Card>
    </Flex>
  );
}

export default Management;
