import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Layout, Typography } from "antd";
import styles from "./Guest.module.css";
import { Card } from "../components";
const { Content } = Layout;
const { Title } = Typography;
const Guest: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.backgroundGradients}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
        </div>
        <Card className={styles.card}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon} />
            <Title level={3} className={styles.logoText}>
              Portal
            </Title>
          </div>
          <Outlet />
        </Card>
      </Content>
    </Layout>
  );
};
export default Guest;
