import { Layout, Typography } from "antd";

function Footer() {
  return (
    <Layout.Footer
      style={{
        borderTop: "1px solid #eaeaea",
        margin: "35px auto 0",
        width: "75%",
        textAlign: "left",
      }}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        © Zachary de Guzman. All rights reserved.
      </Typography.Text>
    </Layout.Footer>
  );
}

export default Footer;
