import { Button, Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

type AdminLayoutProps = {
  onSignOut: () => void;
};

const items = [
  { key: "/management", label: <Link to="/management">Photos</Link> },
  { key: "/add-project", label: <Link to="/add-project">Projects</Link> },
  { key: "/password", label: <Link to="/password">Password</Link> },
  { key: "/", label: <Link to="/">View site</Link> },
];

function AdminLayout({ onSignOut }: AdminLayoutProps) {
  const { pathname } = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingInline: 16,
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={items}
          style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
        />
        <Button type="text" onClick={onSignOut}>
          Sign out
        </Button>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

export default AdminLayout;
