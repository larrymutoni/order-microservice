const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Microservice API",
      version: "1.0.0",
      description: "API documentation for the Order Microservice",
    },
  },
  apis: ["./routes/*.js"], // ← looks in your routes folder for Swagger comments
};

const specs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
