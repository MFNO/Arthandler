import { Button, Flex, List } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import type { Project } from "../../../../types/Project";

type ManageProjectProps = {
  project: Project;
  isFirstItem: boolean;
  isLastItem: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function ManageProject({
  project,
  isFirstItem,
  isLastItem,
  onMoveUp,
  onMoveDown,
}: ManageProjectProps) {
  return (
    <List.Item>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <span>{project.projectName}</span>
        <Flex gap={4}>
          <Button
            type="text"
            aria-label={`Move ${project.projectName} up`}
            icon={<ArrowUpOutlined />}
            disabled={isFirstItem}
            onClick={onMoveUp}
          />
          <Button
            type="text"
            aria-label={`Move ${project.projectName} down`}
            icon={<ArrowDownOutlined />}
            disabled={isLastItem}
            onClick={onMoveDown}
          />
        </Flex>
      </Flex>
    </List.Item>
  );
}

export default ManageProject;
