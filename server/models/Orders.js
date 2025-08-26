import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 1 },
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,  
    },
    total_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Payment Done",
      index: true,
    },
  },
  { timestamps: true }
);
  OrdersSchema.index({ user: 1, createdAt: -1 });
export default mongoose.model("Orders", OrdersSchema);
