import { Component, ErrorInfo, ReactNode } from "react";
import { Result, Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "24px",
          }}
        >
          <Result
            status="error"
            icon={<WarningOutlined style={{ color: "#ef4444" }} />}
            title="Something went wrong"
            subTitle={
              this.state.error?.message || "An unexpected error occurred"
            }
            extra={[
              <Button
                type="primary"
                key="reload"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>,
              <Button key="reset" onClick={this.handleReset}>
                Try Again
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
