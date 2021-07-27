const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxLength: [50, "Name can not be more than 50 characters"],
  },
  brandName: {
    type: String,
    required: [true, "Please add a brand"],
    trim: true,
    maxLength: [25, "Brand can not be more than 25 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please add the price"],
  },
  imageUrl: {
    type: String,
    required: [true, "Please add an image url"],
  },
  inStock: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    trim: true,
    enum: ["Jersey", "T-shirt", "Backpack", "Hoodie",
          "Accessories"],
    required: [true, "Please add a category"]
  },
  discountPrice : Number
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);