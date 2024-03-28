var express = require("express");
var router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");

const userModel = require("./users");

passport.use(new localStrategy(userModel.authenticate()));

function generateRandomCode() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.get("/", function (req, res) {
  res.send("welcome");
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const userid = req.flash("userId");
  const data = await userModel.findById(userid);
  req.flash("userId", userid);
  res.send(data);
});

router.get("/view", isLoggedIn, async function (req, res) {
  const userid = req.flash("userId");
  const data = await userModel.findById(userid);
  req.flash("userId", userid);
  res.send(data);
});

router.post("/register", function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    secret: generateRandomCode(),
  });

  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.send(registeredUser);
      });
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

router.post(
  "/login",
  passport.authenticate("local"),
  async function (req, res) {
    const data = await userModel.findOne({ username: req.body.username });
    req.flash("userId", data._id);
    res.send(data);
  }
);

router.get("/logout", function (req, res, next) {
  req.flash("userid", null);
  req.logout(function (err) {
    if (err) return next(err);
    res.send("Logged Out");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("Not Logged In");
}

module.exports = router;
