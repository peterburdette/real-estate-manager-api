const swaggerJSDoc = require('swagger-jsdoc');

// Swagger configuration options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Real Estate Manager API Documentation', // Title of the documentation
      version: '1.0.0', // Version of the API
      description: 'API documentation Real Estate Manager application.',
    },
  },
  // Specify the paths to the API routes for Swagger documentation
  apis: ['./routes/*.js'], // Assuming your route files are in a 'routes' directory
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
