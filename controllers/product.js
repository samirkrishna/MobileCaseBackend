const Product = require("../models/product");

const formidable = require("formidable");
var _ = require("lodash");
var fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not found in DB2",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }
    //De-structure Fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please provide all details",
      });
    }

    let product = new Product(fields);

    //Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too large",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product)
    //Save product to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save product to DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    //Update product here
    let product = Product(req.product);
    product = _.extend(product, fields);

    //Handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too large",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product)
    //Save product to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to Update product",
        });
      }
      res.json(product);
    });
  });
};
exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete Product",
      });
    }
    res.json({
      message: `Product ${deletedProduct.name} successfully deleted`,
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Products found in DB1",
        });
      }
      res.json(products);
    });
};

exports.getUniqueCategories = (req, res) => {
 Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No unique categories Found",
      });
    }
    res.json(category);
  });
};


exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation Failed",
      });
    }
    next();
  });
};

