const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  getPhoto,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//Params
router.param("userId", getUserById);
router.param("productId", getProductById);

//Create Routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Read Routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getPhoto);

//Update Routes
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);
//Delete Routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//listing products
router.get("/products", getAllProducts);

//getting unique categories
router.get("/products/categories", getUniqueCategories);

module.exports = router;
