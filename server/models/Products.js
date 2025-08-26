import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    desc: {
      type: String,
      required: true,
      index: true,
    },
    img: {
      type: String,
      required: true,
    },
    price: {
      type: {
        org: { type: Number, default: 0.0 },
        mrp: { type: Number, default: 0.0 },
        off: { type: Number, default: 0 },
      },
      default: { org: 0.0, mrp: 0.0, off: 0 },
    },
    sizes: {
      type: [String],
      default: [],
    },
    category: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);
  ProductsSchema.index({ "price.org": 1 });
  ProductsSchema.index({ category: 1 });
export default mongoose.model("Product",ProductsSchema);
