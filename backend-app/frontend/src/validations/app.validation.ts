import * as yup from "yup";
const passwordValidation = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character",
  );
const emailValidation = yup
  .string()
  .email("Invalid email format")
  .required("Email is required");
export const loginSchema = yup.object().shape({
  email: emailValidation,
  password: yup.string().required("Password is required"),
});
export type LoginFormData = yup.InferType<typeof loginSchema>;
export const registerSchema = yup.object().shape({
  email: emailValidation,
  password: passwordValidation.required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export const forgotPasswordSchema = yup.object().shape({
  email: emailValidation,
});
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export const resetPasswordSchema = yup.object().shape({
  password: passwordValidation.required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: passwordValidation.required("New password is required"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
export const createJobSchema = yup.object().shape({
  type: yup
    .string()
    .required("Job type is required")
    .oneOf(["Fast Task", "Heavy Processing", "Data Sync"], "Invalid job type"),
  priority: yup
    .number()
    .required("Priority is required")
    .min(0, "Priority must be at least 0")
    .max(10, "Priority cannot exceed 10"),
  metadataType: yup
    .string()
    .required("Simulation mode is required")
    .oneOf(
      ["standard", "fail_once", "fail_permanent"],
      "Invalid simulation mode",
    ),
  data: yup.object().required("Job data is required"),
});
export type CreateJobFormData = yup.InferType<typeof createJobSchema>;
export const updateProfileSchema = yup.object().shape({
  email: emailValidation,
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>;
export const validateData = async <T>(
  schema: yup.Schema<T>,
  data: unknown,
): Promise<{ isValid: boolean; errors?: Record<string, string>; data?: T }> => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { _error: "Validation failed" } };
  }
};
export const yupToAntdErrors = (error: yup.ValidationError) => {
  const errors: Array<{ name: string[]; errors: string[] }> = [];
  error.inner.forEach((err) => {
    if (err.path) {
      errors.push({
        name: err.path.split("."),
        errors: [err.message],
      });
    }
  });
  return errors;
};
export const yupValidator = <T>(schema: yup.Schema<T>) => {
  return async (_: unknown, value: T) => {
    try {
      await schema.validate(value);
      return Promise.resolve();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return Promise.reject(new Error(error.message));
      }
      return Promise.reject(new Error("Validation failed"));
    }
  };
};
export const validateField = async <T>(
  schema: yup.Schema<T>,
  fieldName: string,
  value: unknown,
): Promise<string | null> => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "Validation failed";
  }
};
export const commonRules = {
  email: emailValidation,
  password: passwordValidation,
  requiredString: (fieldName: string) =>
    yup.string().required(`${fieldName} is required`),
  optionalString: (min?: number, max?: number) => {
    let schema = yup.string();
    if (min) schema = schema.min(min, `Must be at least ${min} characters`);
    if (max) schema = schema.max(max, `Cannot exceed ${max} characters`);
    return schema;
  },
  requiredNumber: (fieldName: string, min?: number, max?: number) => {
    let schema = yup.number().required(`${fieldName} is required`);
    if (min !== undefined) schema = schema.min(min, `Must be at least ${min}`);
    if (max !== undefined) schema = schema.max(max, `Cannot exceed ${max}`);
    return schema;
  },
  url: yup.string().url("Invalid URL format"),
  phone: yup
    .string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number",
    ),
  alphanumeric: yup
    .string()
    .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed"),
};
export const validationSchemas = {
  auth: {
    login: loginSchema,
    register: registerSchema,
    forgotPassword: forgotPasswordSchema,
    resetPassword: resetPasswordSchema,
    changePassword: changePasswordSchema,
  },
  job: {
    create: createJobSchema,
  },
  profile: {
    update: updateProfileSchema,
  },
};
export default validationSchemas;
export * as yup from "yup";
