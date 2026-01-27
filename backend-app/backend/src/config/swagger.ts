import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Scheduler API",
      version: "1.0.0",
      description: "API documentation for the Job Scheduler application",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                role: { type: "string" },
              },
            },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
            status: { type: "string" },
            priority: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            completedAt: { type: "string", format: "date-time" },
          },
        },
        File: {
          type: "object",
          properties: {
            _id: { type: "string" },
            originalName: { type: "string" },
            filename: { type: "string" },
            mimeType: { type: "string" },
            size: { type: "number" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.ts", "./src/routes/*.ts"],
};

export const specs = swaggerJsdoc(options);
