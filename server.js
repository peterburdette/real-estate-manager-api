const express = require('express');
const propertiesRouter = require('./routes/properties');
const supportRouter = require('./routes/support');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

const app = express();
const port = 9999;

// Use Swagger middleware with updated route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/properties', propertiesRouter);
app.use('/api/support', supportRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
