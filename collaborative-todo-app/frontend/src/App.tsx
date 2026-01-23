import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TodoPage } from "./pages/TodoPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { BoardAcceptPage } from "./pages/BoardAcceptPage";
import { ProtectedRoute } from "./routing/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TodoPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/boards/:boardId/accept" element={<BoardAcceptPage />} />
        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
