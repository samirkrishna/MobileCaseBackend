const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductInCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    price:Number
});

const ProductCart = mongoose.model("ProductCart",ProductInCartSchema)

const OrderSchema = new mongoose.Schema(
  {
    products: [ProductInCartSchema],
    transactionId: {},
    amount: {
      type: Number,
    },
    address: String,
    updated: Date,
    status:{
      type:String,
      default:"Received",
      enum:["Cancelled","Delivered","Shipped","Processing","Received"]
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order",OrderSchema);

module.exports = { ProductCart,Order}
