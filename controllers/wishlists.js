const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Wishlist = require("../models/Wishlist");
const User = require("../models/User");

exports.getOrCreateWishlist = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
        wishlist = Wishlist.create({ userId, wishlistItems: [] });
    }
    req.wishlist = wishlist;
    next();
});

// @desc : Get wishlist
// @route : GET /api/v1/wishlist
// @access : Private
exports.getPopulatedWishlist = asyncHandler(async (req, res, next) => {
    let { wishlist } = req;

    wishlist = await wishlist.populate({
        path: "wishlistItems",
        select: "name brandName price imageUrl inStock discountPrice",
    });

    res.status(200).json({
        success: true,
        wishlist,
    });
});

// @desc : Create a wishlist
// @route : POST /api/v1/wishlist
// @access : Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
    const newItem = req.body;
    let { wishlist } = req;

    const productAlreadyAdded = wishlist.wishlistItems.find(
        (item) => item == newItem._id,
    );

    if (productAlreadyAdded) {
        return next(
            new ErrorResponse(`Product ${newItem._id} is already present in the wishlist`, 400)
        );
    } else {
        wishlist.wishlistItems.push(newItem._id);
    }

    let updatedWishlist = await wishlist.save();
    updatedWishlist = await updatedWishlist.populate({
        path: "wishlistItems",
        select: "name brandName price imageUrl inStock discountPrice",
    });

    res.status(201).json({
        success: true,
        wishlist: updatedWishlist,
    });
});

// @desc : Delete item from wishlist
// @route : /api/v1/wishlist
// @access : Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
    const deleteItem = req.body;
    let { wishlist } = req;

    const itemIndex = wishlist.wishlistItems.findIndex((item) => {
        return item == deleteItem._id;
    });

    if (itemIndex === -1) {
        return next(
            new ErrorResponse(`Product not found with id of ${deleteItem._id}`, 400)
        );
    } else {
        wishlist.wishlistItems.splice(itemIndex, 1);
    }

    let newWishlist = await wishlist.save();
    
    res.status(200).json({
        success: true,
        wishlist: newWishlist,
    })
});