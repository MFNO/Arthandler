import { useCallback, useEffect, useState } from "react";
import { App, Button, Card, Flex, Form, Input, List, Spin } from "antd";
import { projectsApi } from "../../../../api";
import type { Project } from "../../../../types/Project";
import ManageProject from "./ManageProject";

function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<{ projectName: string }>();
  const { message } = App.useApp();

  const getProjects = useCallback(() => {
    projectsApi
      .get<Project[]>("/projects")
      .then((response) => {
        setProjects(
          [...response.data].sort(
            (a, b) =>
              a.projectIndex - b.projectIndex ||
              a.projectName.localeCompare(b.projectName),
          ),
        );
      })
      .catch(() => message.error("Could not load projects"))
      .finally(() => setLoading(false));
  }, [message]);

  useEffect(getProjects, [getProjects]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= projects.length) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setProjects(
      reordered.map((project, index) => ({ ...project, projectIndex: index })),
    );
  };

  const addProject = ({ projectName }: { projectName: string }) => {
    setSaving(true);
    projectsApi
      .post("/projects", { projectName })
      .then(() => {
        form.resetFields();
        getProjects();
      })
      .catch(() => message.error("Could not add project"))
      .finally(() => setSaving(false));
  };

  const saveOrder = () => {
    setSaving(true);
    projectsApi
      .put("/projects", projects)
      .then(() => {
        message.success("Project order saved");
        getProjects();
      })
      .catch(() => message.error("Could not save project order"))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <Flex justify="center" style={{ marginTop: "9rem" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Flex vertical align="center" gap={24} style={{ marginTop: "4rem" }}>
      <Card title="Project order" style={{ width: 420 }}>
        <List
          dataSource={projects}
          locale={{ emptyText: "No projects yet" }}
          renderItem={(project, index) => (
            <ManageProject
              project={project}
              isFirstItem={index === 0}
              isLastItem={index === projects.length - 1}
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
            />
          )}
        />
        <Button
          type="primary"
          block
          loading={saving}
          disabled={projects.length === 0}
          onClick={saveOrder}
          style={{ marginTop: 16 }}
        >
          Save Projects
        </Button>
      </Card>

      <Card title="Add a project" style={{ width: 420 }}>
        <Form form={form} layout="vertical" onFinish={addProject}>
          <Form.Item
            name="projectName"
            label="Project name"
            rules={[{ required: true, message: "Project name is required" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={saving}>
            Add Project
          </Button>
        </Form>
      </Card>
    </Flex>
  );
}

export default ManageProjects;
