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
        url: "http://localhost:3000/api",
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
