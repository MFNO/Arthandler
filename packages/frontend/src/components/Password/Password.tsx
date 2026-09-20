import { useState } from "react";
import { App, Button, Card, Flex, Form, Input } from "antd";
import { usersApi } from "../../api";

type PasswordChange = {
  password: string;
  newPassword: string;
};

const MIN_PASSWORD_LENGTH = 12;

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
    <Flex justify="center" style={{ marginTop: "2rem" }}>
      <Card title="Update password" style={{ width: 360 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="password"
            label="Current password"
            rules={[{ required: true, message: "Current password is required" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New password"
            rules={[
              { required: true, message: "New password is required" },
              {
                min: MIN_PASSWORD_LENGTH,
                message: `At least ${MIN_PASSWORD_LENGTH} characters`,
              },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Update password
          </Button>
        </Form>
      </Card>
    </Flex>
  );
}

export default Password;
