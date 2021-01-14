const User = require("../models/user");
const { validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
exports.signUp = (req, res) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  var user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "Unable to save user in DB",
      });
    }
    res.json(user);
  });
};

exports.signIn = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(403).json({
        error: "Email doesn't exists",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Incorrect Password",
      });
    }

    //Creating a token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Passing token using Cookie
    res.cookie("token", token,{expire:new Date()+9999});

    //Send response to frontend
    const { _id, name, email, role } = user;
    res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token")
  res.json({
   "message":"Successfully SignedOut"
  });
};

//Protected Routes
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth",
    algorithms: ['sha1', 'RS256', 'HS256'],
})

//Custom Middle wares