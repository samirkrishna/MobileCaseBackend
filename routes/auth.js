const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signOut, signUp, signIn,isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("firstName", "First name should be minimum 3 characters ").isLength({
      min: 3,
    }),
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password should be minimum 5 characters ").isLength({
      min: 5,
    }),
  ],
  signUp
);

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 1 }),
  ],
  signIn
);

router.get("/signout", signOut);

router.get("/test",isSignedIn,(req,res)=>{
    res.send("Protected Route")
})

module.exports = router;
