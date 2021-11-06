const express = require("express");
const {
  getOrCreateCart,
  getPopulatedCart,
  addOrUpdateToCart,
  removeFromCart,
} = require("../controllers/carts");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use(protect);

router.use(getOrCreateCart);

router
  .route("/")
  .get(getPopulatedCart)
  .post(addOrUpdateToCart)
  .delete(removeFromCart);

module.exports = router;
