const express = require("express");
const {
    getOrCreateWishlist,
    getPopulatedWishlist,
    addToWishlist,
    removeFromWishlist,
} = require('../controllers/wishlists');

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use(protect);

router.use(getOrCreateWishlist);

router.route('/')
    .get(getPopulatedWishlist)
    .post(addToWishlist)
    .delete(removeFromWishlist);

module.exports = router;