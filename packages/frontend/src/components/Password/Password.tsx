import { useState } from "react";
import { Link } from "react-router-dom";
import { App, Button, Card, Flex, Form, Input } from "antd";
import { usersApi } from "../../api";

type PasswordChange = {
  username: string;
  password: string;
  newPassword: string;
};

function Password() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<PasswordChange>();
  const { message } = App.useApp();

  const onFinish = (values: PasswordChange) => {
    setLoading(true);
    usersApi
      .post("/password", values)
      .then(() => {
        message.success("Password updated");
        form.resetFields();
      })
      .catch(() => message.error("Could not update password"))
      .finally(() => setLoading(false));
  };

  return (
    <Flex justify="center" style={{ marginTop: "9rem" }}>
      <Card title="Update password" style={{ width: 320 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Old password"
            rules={[{ required: true, message: "Old password is required" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New password"
            rules={[{ required: true, message: "New password is required" }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Flex justify="space-between" align="center">
            <Link to="/login">Login</Link>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
}

export default Password;
