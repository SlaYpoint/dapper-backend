const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");
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
const auth = require('./routes/auth');
const wishlists = require('./routes/wishlists');
const carts = require('./routes/carts');

const app = express();

// Body Parser
app.use(express.json());

// Cookie parsing
app.use(cookieParser());


// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

// Enable CORS(Cross-Origin Resource Sharing)
app.use(cors());


// Mount routers
app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use("/api/v1/wishlist", wishlists);
app.use("/api/v1/cart", carts);

app.use(errorHandler);


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