const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add a user Id"],
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
