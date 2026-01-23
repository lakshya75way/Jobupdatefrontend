import { useState, useEffect } from "react";
export interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  revenue: number;
  pendingTasks: number;
}
export interface Project {
  key: string;
  name: string;
  status: "Completed" | "In Progress" | "Pending";
  priority: "High" | "Medium" | "Low";
  completion: number;
}
export const useDashboard = () => {
  const [stats] = useState<DashboardStats>({
    totalUsers: 112893,
    activeProjects: 42,
    revenue: 92600,
    pendingTasks: 18,
  });
  const [projects] = useState<Project[]>([
    {
      key: "1",
      name: "Authentication System",
      status: "In Progress",
      priority: "High",
      completion: 65,
    },
    {
      key: "2",
      name: "Admin Dashboard UI",
      status: "Completed",
      priority: "Medium",
      completion: 100,
    },
    {
      key: "3",
      name: "Mobile App API",
      status: "Pending",
      priority: "High",
      completion: 15,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return {
    stats,
    projects,
    loading,
  };
};
