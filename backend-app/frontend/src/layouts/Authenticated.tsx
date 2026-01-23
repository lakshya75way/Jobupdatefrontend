import React, { useState } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Typography,
  Space,
  theme,
  MenuProps,
  Drawer,
  Grid,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  MenuOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Avatar } from "../components";
import UploadTray from "../components/UploadTray/UploadTray";
import NotificationBanner from "../components/NotificationBanner/NotificationBanner";
import styles from "./Authenticated.module.css";
const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const Authenticated: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = !screens.md;
  theme.useToken();
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) return null;
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: <PieChartOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/jobs",
      icon: <DesktopOutlined />,
      label: "Job Monitor",
    },
    {
      key: "/dashboard/uploads",
      icon: <CloudUploadOutlined />,
      label: "My Uploads",
    },
    {
      key: "api-docs",
      icon: <FileTextOutlined />,
      label: "API Documentation",
    },
  ];
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Account Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: handleLogout,
    },
  ];
  const SidebarContent = (
    <>
      <div className={styles.logoWrapper}>
        <div className={styles.logoIcon}>
          <div className={styles.logoInner} />
        </div>
        {(isMobile || !collapsed) && (
          <Title level={4} className={styles.logoText}>
            Dashboard
          </Title>
        )}
      </div>
      <div className={styles.menuContainer}>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => {
            if (key === "api-docs") {
              const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
              window.open(`${baseUrl}/api/docs`, "_blank");
              return;
            }
            navigate(key);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          className={styles.menu}
        />
      </div>
    </>
  );
  return (
    <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          width={collapsed ? 80 : 280}
          className={styles.sidebar}
        >
          {SidebarContent}
        </Sider>
      )}
      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        styles={{ body: { padding: 0 }, header: { display: "none" } }}
        style={{ width: 280 }}
        className={styles.mobileDrawer}
      >
        <div style={{ background: "#0f172a", height: "100%" }}>
          {SidebarContent}
        </div>
      </Drawer>
      <Layout className={styles.mainLayout}>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsMobileMenuOpen(true)}
                className={styles.collapseBtn}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className={styles.collapseBtn}
              />
            )}
            {!isMobile && (
              <Text strong style={{ fontSize: 18, marginLeft: 8 }}>
                {location.pathname === "/dashboard/jobs"
                  ? "Task Monitor"
                  : location.pathname === "/dashboard/uploads"
                    ? "My Uploads"
                    : "Overview"}
              </Text>
            )}
          </div>
          <div className={styles.headerRight}>
            <Space size={isMobile ? 12 : 24}>
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <div className={styles.userDropdown}>
                  <Avatar
                    size={isMobile ? 32 : 40}
                    className={styles.avatar}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  />
                  {!isMobile && (
                    <div className={styles.userInfo}>
                      <Text strong className={styles.userName}>
                        {user?.email?.split("@")[0]}
                      </Text>
                      <Text className={styles.userRole}>
                        {user?.role === "admin"
                          ? "Systems Admin"
                          : "Standard User"}
                      </Text>
                    </div>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className={styles.content}>
          <div className={styles.contentInner}>
            <NotificationBanner />
            <Outlet />
          </div>
        </Content>
      </Layout>
      <UploadTray />
    </Layout>
  );
};
export default Authenticated;
