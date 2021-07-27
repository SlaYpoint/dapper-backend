const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const path = require('path');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

// Routes
const products = require('./routes/products');

const app = express();

// Body Parser
app.use(express.json());


// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

app.use(errorHandler);

// Mount routers
app.use('/api/v1/products', products);


const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode
    on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`);

  server.close(() => process.exit(1));
})