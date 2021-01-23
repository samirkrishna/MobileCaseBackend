const Category = require("../models/category")
const { updateUser } = require("./user")

exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(403).json({
                "message":"Category npt found in DB"
            })
        }
        req.category = category
        next()
    })
}

exports.createCategory = (req,res)=>{
    const category = new Category(req.body)
    category.save((err,category)=>{
        if(err){
            return res.status(402).json({
                message:"Unable to create category"
            })
        }
        res.json(category)
    })
}

exports.getCategory = (req,res)=>{
    return res.json(req.category)
}

exports.getAllCategories = (req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                message:"No Categories Found in DB"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory = (req,res)=>{
    const category = req.category
    category.name = req.body.name

    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                message:"Unable to Update category"
            })
        }
        res.json(updatedCategory)
    })
}

exports.removeCategory = (req,res)=>{
    const category =req.category;

    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Unable to delete category"
            })
        }
        res.json({
            message:`Category ${category.name} is successfully Deleted `
        })
    })
}