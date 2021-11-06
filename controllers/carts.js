const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Cart = require("../models/Cart");

exports.getOrCreateCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = Cart.create({ userId, cartItems: [] });
  }
  req.cart = cart;
  next();
});

// @desc : Get cart
// @route : GET /api/v1/cart
// @access : Private
exports.getPopulatedCart = asyncHandler(async (req, res, next) => {
  let { cart } = req;

  cart = await cart.populate({
    path: "cartItems.productId",
    select: "name brandName price imageUrl inStock discountPrice",
  });

  res.status(200).json({
    success: true,
    cart,
  });
});

// @desc : Create a cart
// @route : POST /api/v1/cart
// @access : Private
exports.addOrUpdateToCart = asyncHandler(async (req, res, next) => {
  const itemUpdate = req.body;
  let { cart } = req;

  const productAlreadyAdded = cart.cartItems.find(
    (item) => item.productId == itemUpdate._id
  );

  if (productAlreadyAdded) {
      cart.cartItems = cart.cartItems.map((item) =>
          item.productId == itemUpdate._id
              ? Object.assign(item, itemUpdate)
              : item,
      );
  } else {
      cart.cartItems.push({
        productId: itemUpdate._id,
        quantity: 1,  
    }); 
  }

  let updatedCart = await cart.save();
  updatedCart = await updatedCart.populate({
    path: "cartItems.productId",
    select: "name brandName price imageUrl inStock discountPrice",
  });

  res.status(201).json({
    success: true,
    cart: updatedCart,
  });
});

// @desc : Delete item from cart
// @route : /api/v1/cart
// @access : Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const deleteItem = req.body;
  let { cart } = req;

  const itemIndex = cart.cartItems.findIndex((item) => {
    return item.productId == deleteItem._id;
  });

  if (itemIndex === -1) {
    return next(
      new ErrorResponse(`Product not found with id of ${deleteItem._id}`, 400)
    );
  } else {
    cart.cartItems.splice(itemIndex, 1);
  }

  let newCart = await cart.save();

  res.status(200).json({
    success: true,
    cart: newCart,
  });
});
