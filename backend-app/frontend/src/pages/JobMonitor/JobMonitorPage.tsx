import React, { useState, useCallback, useMemo, memo } from "react";
import { Row, Col, Form, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useJobs } from "../../hooks/useJobs";
import { Job, CreateJobDto } from "../../types/job";
import { Input, Card, Select, Table } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { useJobTableColumns } from "./useJobTableColumns";
import { JobLogsModal } from "./JobLogsModal";
import { CreateJobModal } from "./CreateJobModal";
import { JobMonitorHeader } from "./JobMonitorHeader";
import { useDebounce } from "../../hooks/useDebounce";
import styles from "./JobMonitorPage.module.css";

const STATUS_FILTERS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
] as const;

const JobMonitorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm<CreateJobDto>();
  const { user } = useAuth();
  const [isAdminView, setIsAdminView] = useState(user?.role === "admin");
  const { jobs, loading, addJob, fetchJobs } = useJobs(isAdminView);
  const [, modalContextHolder] = Modal.useModal();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedSearch = useDebounce(searchInput, 300);

  const handleSetSelectedJob = useCallback((job: Job) => {
    setSelectedJob(job);
  }, []);

  const columns = useJobTableColumns({
    onViewLogs: handleSetSelectedJob,
  });

  const handleAddJob = useCallback(
    async (values: CreateJobDto) => {
      const success = await addJob(values);
      if (success) {
        setIsModalOpen(false);
        form.resetFields();
      }
    },
    [addJob, form],
  );

  const handleAdminViewChange = useCallback(
    (checked: boolean) => {
      setIsAdminView(checked);
      fetchJobs(checked);
    },
    [fetchJobs],
  );

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleClearSelectedJob = useCallback(() => {
    setSelectedJob(null);
  }, []);

  const filteredJobs = useMemo(() => {
    const jobsArray = Array.isArray(jobs) ? jobs : [];

    return jobsArray.filter((job) => {
      const matchesSearch =
        !debouncedSearch ||
        job.id?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.type?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, debouncedSearch, statusFilter]);

  const statusOptions = useMemo(() => STATUS_FILTERS, []);

  return (
    <div className="page-transition">
      {modalContextHolder}
      <JobMonitorHeader
        userRole={user?.role}
        isAdminView={isAdminView}
        onAdminViewChange={handleAdminViewChange}
        onCreateJob={handleOpenModal}
      />
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col xs={24} sm={16} flex="auto">
            <Input
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              placeholder="Filter by Job ID or Type..."
              size="large"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchBar}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              size="large"
              style={{ width: "100%" }}
            >
              {statusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredJobs}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <CreateJobModal
        isOpen={isModalOpen}
        loading={loading}
        form={form}
        onClose={handleCloseModal}
        onSubmit={handleAddJob}
      />
      <JobLogsModal job={selectedJob} onClose={handleClearSelectedJob} />
    </div>
  );
};

export default memo(JobMonitorPage);
