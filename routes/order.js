const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getUserById,
  pushOrdersInPurchaseList,
} = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../controllers/order");

//Params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Create Routes
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrdersInPurchaseList,
  updateStock,
  createOrder
);

//read
router.get(
  "/orders/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//status of order

router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.post(
  "/order/:orderId/user/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
