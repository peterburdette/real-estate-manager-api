const express = require('express');
const propertiesRouter = require('./routes/properties');
const supportRouter = require('./routes/support');
const appStateRouter = require('./routes/appState');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 9999;

// Use the cors middleware to allow all origins
app.use(cors());

// Use Swagger middleware with updated route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/properties', propertiesRouter);
app.use('/api/pages', supportRouter);
app.use('/api/viewPropertiesToggleState', appStateRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
