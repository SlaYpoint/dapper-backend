const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/Product");

// @desc : Get products
// @route : GET /api/v1/products
// @access : Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc : Get a single product
// @route : GET /api/v1/products/:id
// @access : Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                400
            )
        );
    }

    res.status(200).json({
      success: true,
      data: product,
    });
});