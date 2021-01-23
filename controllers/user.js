const User = require("../models/user")
const Order = require("../models/order")

exports.getUserById = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(401).json({
                "message":"User Not Found"
            })
        }
        req.profile = user;
        next()
    })
}

exports.getUser = (req,res)=>{
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    return res.json(req.profile)
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err)
            return res.status(401).json({
                "message":"Something went wrong"
            })
            user.salt = undefined
            user.encry_password = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_is name")
    .exec((err,order)=>{
        if(err)
            return res.status(401).json({
                "message":"Orders is Empty"
            })
        res.json(order)
    })
}

exports.pushOrdersInPurchaseList = (req,res,next)=>{
    let purchases = []  
    req.body.order.products.forEach(product => {
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    });

    //store this in DB
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchases)=>{
            if(err){
                return res.json({
                    "message":"Unable to save purchase list"
                })
            }
           next()
        }
        )
}
