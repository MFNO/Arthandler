import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#1f1f1f",
    colorLink: "#1f1f1f",
    fontFamily: '"Open Sans", system-ui, sans-serif',
    borderRadius: 2,
    colorBorderSecondary: "#eaeaea",
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      bodyBg: "#ffffff",
      footerBg: "#ffffff",
    },
    Menu: {
      horizontalItemSelectedColor: "#9ca3af",
      itemColor: "#1f2937",
    },
  },
};
