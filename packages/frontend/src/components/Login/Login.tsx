import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button, Card, Flex, Form, Input } from "antd";
import { usersApi } from "../../api";
import { setToken } from "../../auth";

type LoginProps = {
  setAuthenticated: (authenticated: boolean) => void;
};

type Credentials = {
  username: string;
  password: string;
};

function Login({ setAuthenticated }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = (values: Credentials) => {
    setLoading(true);
    usersApi
      .post<{ token: string }>("/login", values)
      .then(({ data }) => {
        setToken(data.token);
        setAuthenticated(true);
        navigate("/management");
      })
      .catch(() => message.error("Incorrect username or password"))
      .finally(() => setLoading(false));
  };

  return (
    <Flex justify="center" style={{ marginTop: "9rem" }}>
      <Card title="Sign in" style={{ width: 320 }}>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign in
          </Button>
        </Form>
      </Card>
    </Flex>
  );
}

export default Login;
